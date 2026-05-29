# `memory.ts` Python 逐行讲解

本文覆盖 `packages/core/src/challenge/memory.ts` 第 1 到 394 行。目标是把这个文件的 TypeScript 实现翻译成 Python 教学型伪代码，并解释每一段代码在整个 challenge memory / ideas 存储流程中的位置。

本文中的 Python 代码用于阅读和理解，不追求直接运行。文中 `remove_path(...)` 保留源码里的 `rm(...)` 语义，即删除文件或目录。仓库人工清理文件仍必须遵循项目规则：把待清理内容移动到当前工作目录下的 `待删除` 文件夹。

## 0. 总览

`memory.ts` 管两类数据：

- `memory`: 事实、证据、失败、备注、提示这类记录。每次新增会写一个独立 JSON 文件，目录是 `rootDir/<challengeId>/memory/entries/`。
- `ideas`: 解题想法。它有一个总索引 `ideas/index.json`，并且每条 idea 还有一个 `ideas/by-id/<ideaId>.json` 副本。

直观类比：

- `memory` 像实验室记录本里的证据卡片，每张卡片独立编号，适合追加和回看。
- `ideas` 像任务看板，核心状态集中在一张索引表里，方便去重、搜索、更新状态。
- `locks` 像门口的占用牌。写入共享文件前先挂占用牌，写完摘掉，避免多个写入者同时改同一份 JSON。

数学化地看目录锁的陈旧判定：

$$
lockAge = nowMs - lockCreatedAtMs
$$

当

$$
lockAge > staleMs
$$

成立时，当前锁会被视为陈旧锁，源码会清理它并重新尝试加锁。

## 1. 数据结构词典, 行 4-62

### Python 伪代码

```python
from typing import Literal, TypedDict, NotRequired

IdeaStatus = Literal["pending", "testing", "verified", "failed", "skipped"]
MemoryKind = Literal["fact", "evidence", "failure", "note", "hint"]


class MemoryEntry(TypedDict):
    id: str
    challengeId: str
    kind: MemoryKind
    content: str
    refs: list[str]
    source: str
    created_at: str
    updated_at: str


class AddMemoryInput(TypedDict):
    challengeId: str
    kind: MemoryKind
    content: str
    refs: NotRequired[list[str]]
    source: str


class IdeaRecord(TypedDict):
    id: str
    content: str
    normalized: str
    status: IdeaStatus
    result: str
    created_at: str
    updated_at: str


class IdeasIndexRecord(TypedDict):
    challengeId: str
    updated_at: str
    items: list[IdeaRecord]


class MemoryEntryWithPath(TypedDict):
    path: str
    entry: MemoryEntry


class AddIdeaResult(TypedDict):
    created: bool
    item: IdeaRecord


class AddIdeaInput(TypedDict):
    content: str
    status: NotRequired[IdeaStatus]
    result: NotRequired[str]


class UpdateIdeaInput(TypedDict):
    content: NotRequired[str]
    status: NotRequired[IdeaStatus]
    result: NotRequired[str]
```

### 逐行解释

- 行 4 定义 `IdeaStatus`，这是 idea 的状态枚举。`pending` 表示待验证，`testing` 表示验证中，`verified` 表示已验证有效，`failed` 表示验证失败，`skipped` 表示跳过。它像一个小型状态机，状态集合是有限的。
- 行 5 定义 `MemoryKind`，这是 memory 的类型枚举。`fact` 偏事实，`evidence` 偏证据，`failure` 记录失败边界，`note` 是普通备注，`hint` 是提示信息。
- 行 7-16 定义 `MemoryEntry`，即落盘的一条 memory JSON。输入输出结构要求：`id` 是系统生成的唯一短 ID，`challengeId` 绑定题目，`kind` 必须来自 `MemoryKind`，`content` 是正文，`refs` 是证据路径或引用列表，`source` 是来源标识，两个时间字段是 ISO 字符串。
- 行 18-24 定义 `AddMemoryInput`，这是新增 memory 的输入。`refs` 可省略，函数内部会把它补成空数组并去重。
- 行 26-34 定义 `IdeaRecord`，即一条 idea 的持久化结构。`normalized` 是从 `content` 派生出的去重键，规则是裁剪空白并转小写。
- 行 36-40 定义 `IdeasIndexRecord`，即 `ideas/index.json` 的整体结构。`items` 是全部 idea 记录数组。
- 行 42-45 定义 `MemoryEntryWithPath`，这是内部辅助结构。它把 memory 内容和文件路径绑在一起，更新和删除时需要知道原文件路径。
- 行 47-50 定义 `AddIdeaResult`。`created` 为 `true` 表示真的创建了新 idea，为 `false` 表示命中已有去重项。
- 行 52-56 定义 `AddIdeaInput`。新增 idea 必填 `content`，可选 `status` 和 `result`。
- 行 58-62 定义 `UpdateIdeaInput`。更新 idea 时三个字段都可选，传了哪个字段就更新哪个字段。

## 2. 导入, 行 1-2

### Python 伪代码

```python
from pathlib import Path
import json
import os
import shutil
import time
import uuid
from datetime import datetime, timezone
from urllib.parse import quote
```

### 逐行解释

- 行 1 从 `fs/promises` 引入 `mkdir`、`readdir`、`rename`、`rm`。它们分别对应创建目录、读取目录、重命名路径、删除路径。这里用 promise 版本，说明所有文件操作都是异步 I/O。
- 行 2 从 `path` 引入 `dirname` 和 `join`。`dirname(path)` 取父目录，`join(...)` 按操作系统规则拼路径。

被调对象说明：

```python
mkdir(path, recursive=False) -> None
readdir(path) -> list[str]
rename(src, dst) -> None
rm(path, recursive=False, force=False) -> None
join(*parts) -> str
dirname(path) -> str
```

这些调用对象都处理文件系统路径。输入通常是字符串路径，输出要么为空，要么是目录项列表。

## 3. 基础工具函数, 行 64-84

### Python 伪代码

```python
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def require_text(value: str, field_name: str) -> str:
    text = value.strip()
    if not text:
        raise ValueError(f"{field_name} is required")
    return text


def normalize_idea_text(content: str) -> str:
    return content.strip().lower()


def is_directory_exists_error(error: Exception) -> bool:
    return getattr(error, "code", None) == "EEXIST"


def create_entity_id(prefix: str) -> str:
    compact = uuid.uuid4().hex[:8]
    return f"{prefix}_{compact}"
```

### 逐行解释

- 行 64 声明 `nowIso(): string`，返回类型是字符串。
- 行 65 返回当前时间的 ISO 字符串。这个时间像日志里的统一时间戳，用于 `created_at` 和 `updated_at`。
- 行 68 声明 `requireText(value, fieldName)`，输入是原始字符串和字段名，输出是裁剪后的非空字符串。
- 行 69 执行 `trim()`，去掉首尾空白。
- 行 70 如果裁剪后为空，抛出错误。这个函数把“字段必须有实质内容”的校验集中起来。
- 行 71 返回校验后的文本。后续逻辑用这个返回值，避免重复裁剪。
- 行 74 声明 `normalizeIdeaText(content)`，输入是 idea 正文，输出是去重键。
- 行 75 把内容裁剪后转小写。例子：`" Try SQL "` 和 `"try sql"` 会变成同一个 key。
- 行 78 声明 `isDirectoryExistsError(error)`，输入是未知错误对象，输出布尔值。
- 行 79 检查错误是否像对象、是否有 `code` 字段，以及 `code` 是否为 `EEXIST`。这专门服务于目录锁：创建锁目录时如果目录已存在，说明锁被别人占着。
- 行 82 声明 `createEntityId(prefix)`，输入如 `"mem"` 或 `"idea"`，输出短 ID。
- 行 83 生成 UUID，去掉连字符，取前 8 位，再加前缀。生成结果类似 `mem_12ab34cd`。

被调对象说明：

```python
now_iso() -> str
# 输出: ISO 时间字符串, 用于 created_at / updated_at。

require_text(value: str, field_name: str) -> str
# 输入: 任意字符串字段。
# 输出: trim 后的非空字符串。
# 失败: 空字符串抛错。

normalize_idea_text(content: str) -> str
# 输入: idea 正文。
# 输出: 去重 key。

create_entity_id(prefix: str) -> str
# 输入: ID 前缀。
# 输出: prefix_八位随机十六进制。
```

## 4. 路径构造函数, 行 86-108

### Python 伪代码

```python
def challenge_dir(root_dir: str, challenge_id: str) -> str:
    return str(Path(root_dir) / quote(challenge_id, safe=""))


def ideas_lock_dir(root_dir: str, challenge_id: str) -> str:
    return str(Path(challenge_dir(root_dir, challenge_id)) / "locks" / "ideas.lock")


def ideas_index_path(root_dir: str, challenge_id: str) -> str:
    return str(Path(challenge_dir(root_dir, challenge_id)) / "ideas" / "index.json")


def idea_by_id_path(root_dir: str, challenge_id: str, idea_id: str) -> str:
    return str(Path(challenge_dir(root_dir, challenge_id)) / "ideas" / "by-id" / f"{idea_id}.json")


def memory_entries_dir(root_dir: str, challenge_id: str) -> str:
    return str(Path(challenge_dir(root_dir, challenge_id)) / "memory" / "entries")


def memory_lock_dir(root_dir: str, challenge_id: str) -> str:
    return str(Path(challenge_dir(root_dir, challenge_id)) / "locks" / "memory.lock")
```

### 逐行解释

- 行 86 声明 `challengeDir(rootDir, challengeId)`。
- 行 87 返回 `rootDir/encodeURIComponent(challengeId)`。`encodeURIComponent` 把题目 ID 变成安全目录名，避免 `/`、空格、特殊字符破坏路径结构。
- 行 90 声明 `ideasLockDir(...)`。
- 行 91 返回 `challengeDir(...)/locks/ideas.lock`。这是 ideas 写操作的互斥锁目录。
- 行 94 声明 `ideasIndexPath(...)`。
- 行 95 返回 `challengeDir(...)/ideas/index.json`。这个文件存全部 idea 的索引。
- 行 98 声明 `ideaByIdPath(...)`。
- 行 99 返回 `challengeDir(...)/ideas/by-id/<ideaId>.json`。它是单条 idea 的副本路径。
- 行 102 声明 `memoryEntriesDir(...)`。
- 行 103 返回 `challengeDir(...)/memory/entries`。所有 memory entry 文件都放在这里。
- 行 106 声明 `memoryLockDir(...)`。
- 行 107 返回 `challengeDir(...)/locks/memory.lock`。这是 memory 更新和删除操作的互斥锁目录。

被调对象说明：

```python
challenge_dir(root_dir: str, challenge_id: str) -> str
# 输入: 根目录和题目 ID。
# 输出: 题目专属目录。

ideas_index_path(root_dir: str, challenge_id: str) -> str
# 输出: ideas/index.json 路径。

idea_by_id_path(root_dir: str, challenge_id: str, idea_id: str) -> str
# 输出: 单条 idea JSON 路径。

memory_entries_dir(root_dir: str, challenge_id: str) -> str
# 输出: memory entries 目录。

memory_lock_dir(...) / ideas_lock_dir(...) -> str
# 输出: 用作互斥锁的目录路径。
```

目录整体形态：

```text
rootDir/
  <encodedChallengeId>/
    memory/
      entries/
        <timestamp>-mem_xxxxxxxx.json
    ideas/
      index.json
      by-id/
        idea_xxxxxxxx.json
    locks/
      memory.lock/
      ideas.lock/
```

## 5. JSON 读取和原子写入, 行 110-125

### Python 伪代码

```python
def read_json_file(path: str) -> dict | list | None:
    file_path = Path(path)
    if not file_path.exists():
        return None
    try:
        return json.loads(file_path.read_text(encoding="utf-8"))
    except Exception:
        return None


def atomic_write_json(path: str, data: object) -> None:
    target = Path(path)
    tmp_path = target.with_name(
        f"{target.name}.tmp-{os.getpid()}-{int(time.time() * 1000)}-{uuid.uuid4().hex[:8]}"
    )
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp_path.replace(target)
```

### 逐行解释

- 行 110 声明泛型函数 `readJsonFile<T>`。输入是路径，输出是 `T` 或 `undefined`。
- 行 111 用 `Bun.file(path)` 得到 Bun 的文件对象。文件对象提供 `exists()` 和 `json()`。
- 行 112 如果文件不存在，直接返回空。这里没有抛错，调用方可以把缺失文件当成空状态。
- 行 113 进入解析保护区。
- 行 114 调用 `file.json()` 解析 JSON，并强制视作类型 `T`。
- 行 115 捕获解析错误或读取错误。
- 行 116 解析失败也返回空。坏 JSON 会被静默跳过。
- 行 117 结束捕获块。
- 行 120 声明 `atomicWriteJson(path, data)`，输入目标路径和任意数据，输出为空。
- 行 121 构造临时文件路径。临时路径包含目标路径、进程 ID、当前时间和随机片段，降低并发冲突概率。
- 行 122 确保目标文件的父目录存在。
- 行 123 把数据格式化成两空格缩进的 JSON，写入临时文件。
- 行 124 用 `rename(tmpPath, path)` 把临时文件替换成目标文件。这个动作在同一文件系统内通常具备原子性，读者看到的要么是旧文件，要么是新文件，很少看到半截文件。

被调对象说明：

```python
read_json_file(path: str) -> dict | list | None
# 输入: JSON 文件路径。
# 输出: 解析后的对象；文件缺失或解析失败时返回 None。

atomic_write_json(path: str, data: object) -> None
# 输入: 目标路径和可 JSON 序列化的数据。
# 输出: 无。
# 整体行为: 先写临时文件，再 rename 到目标路径。
```

`atomic` 可以理解成数据库事务里的“提交点”。临时文件阶段像草稿，`rename` 那一刻才正式切换到新版本。

## 6. 目录锁, 行 127-160

### Python 伪代码

```python
def with_directory_lock(lock_dir: str, action):
    started_at = now_ms()
    timeout_ms = 5000
    stale_ms = 60_000

    while True:
        try:
            Path(lock_dir).mkdir()
            break
        except Exception as error:
            if not is_directory_exists_error(error):
                raise

            lock_meta = read_json_file(str(Path(lock_dir) / "lock-meta.json"))
            created_at = parse_time(lock_meta.get("created_at")) if lock_meta else None
            lock_age = now_ms() - created_at if created_at is not None else None

            if lock_age is not None and lock_age > stale_ms:
                remove_path(lock_dir, recursive=True, force=True)
                continue

            if now_ms() - started_at > timeout_ms:
                raise RuntimeError(f"challenge memory lock timeout: {lock_dir}")

            sleep_ms(25)

    write_text(
        Path(lock_dir) / "lock-meta.json",
        json.dumps({"created_at": now_iso(), "pid": os.getpid()}, indent=2),
    )

    try:
        return action()
    finally:
        remove_path(lock_dir, recursive=True, force=True)
```

### 逐行解释

- 行 127 声明 `withDirectoryLock<T>(lockDir, action)`。输入是锁目录和一个异步动作，输出是这个动作的结果。
- 行 128 记录开始等待锁的时间。
- 行 129 设置最多等待 5000 毫秒。
- 行 130 设置锁超过 60000 毫秒就算陈旧。
- 行 132 开始无限循环，直到拿到锁或超时。
- 行 133 进入尝试加锁的保护区。
- 行 134 尝试创建锁目录。目录创建是关键点：如果目录已经存在，创建会失败；如果成功，就代表当前调用者拿到了锁。
- 行 135 创建成功后跳出循环。
- 行 136 捕获创建目录时的错误。
- 行 137 如果错误类型并非“目录已存在”，说明遇到权限、磁盘等其他问题，直接抛出。
- 行 139 读取 `lock-meta.json`。这个文件记录锁的创建时间和进程 ID。
- 行 140 如果元数据里有 `created_at`，就把它解析成时间戳；没有则记为 `NaN`。
- 行 141 如果时间戳有效，就计算锁年龄 `Date.now() - lockCreatedAt`；无效则继续使用 `NaN`。
- 行 142 如果锁年龄有效且大于 `staleMs`，说明占锁者可能崩溃或失联。
- 行 143 源码删除锁目录。本文伪代码写作 `remove_path(lock_dir, recursive=True, force=True)`，代表保留原 TS 的清理语义。
- 行 144 清理陈旧锁后继续循环，重新尝试拿锁。
- 行 147 如果总等待时间超过 `timeoutMs`，进入超时分支。
- 行 148 抛出锁超时错误，错误消息包含锁目录，便于定位是哪类资源卡住。
- 行 150 等待 25 毫秒再重试。这个小睡眠避免 CPU 忙等。
- 行 154 拿到锁后写入 `lock-meta.json`，内容包含创建时间和当前进程 ID。
- 行 155 进入 `try`，保证后续清理一定有机会发生。
- 行 156 执行传入的 `action`，并返回它的结果。
- 行 157 进入 `finally`。
- 行 158 无论 action 成功还是失败，都删除锁目录。
- 行 159-160 结束锁函数。

被调对象说明：

```python
with_directory_lock(lock_dir: str, action: Callable[[], T]) -> T
# 输入: 锁目录, 以及在锁内执行的函数。
# 输出: action 的返回值。
# 失败: 非 EEXIST 文件错误、等待超时、action 自身异常。

read_json_file(path) -> dict | None
# 这里用于读取 lock-meta.json, 预期结构是 {"created_at": str, "pid": number}。

is_directory_exists_error(error) -> bool
# 这里用于判断 mkdir 失败是否代表锁已被占用。
```

## 7. 初始化目录和 ideas 索引, 行 162-181

### Python 伪代码

```python
def ensure_challenge_dirs(root_dir: str, challenge_id: str) -> None:
    id_ = require_text(challenge_id, "challengeId")
    base_dir = challenge_dir(root_dir, id_)
    mkdir(base_dir, recursive=True)
    mkdir(Path(base_dir) / "memory" / "entries", recursive=True)
    mkdir(Path(base_dir) / "ideas" / "by-id", recursive=True)
    mkdir(Path(base_dir) / "locks", recursive=True)


def read_ideas_index(root_dir: str, challenge_id: str) -> IdeasIndexRecord:
    id_ = require_text(challenge_id, "challengeId")
    existing = read_json_file(ideas_index_path(root_dir, id_))
    if existing:
        return existing
    return {"challengeId": id_, "updated_at": now_iso(), "items": []}


def write_ideas_index(root_dir: str, challenge_id: str, record: IdeasIndexRecord) -> None:
    id_ = require_text(challenge_id, "challengeId")
    atomic_write_json(ideas_index_path(root_dir, id_), record)
```

### 逐行解释

- 行 162 声明 `ensureChallengeDirs(rootDir, challengeId)`。
- 行 163 校验 `challengeId` 非空，并把裁剪后的值保存为 `id`。
- 行 164 计算题目基础目录。
- 行 165 创建基础目录，`recursive: true` 表示父目录缺失也一起创建。
- 行 166 创建 memory entries 目录。
- 行 167 创建 ideas by-id 目录。
- 行 168 创建 locks 目录。
- 行 171 声明 `readIdeasIndex(rootDir, challengeId)`。
- 行 172 校验题目 ID。
- 行 173 调用 `readJsonFile` 读取 `ideas/index.json`。
- 行 174 如果文件存在且解析成功，返回现有索引。
- 行 175 如果索引不存在，返回内存里的空索引对象。注意这里没有写文件，单纯读列表不会制造目录或文件。
- 行 178 声明 `writeIdeasIndex(rootDir, challengeId, record)`。
- 行 179 校验题目 ID。
- 行 180 调用 `atomicWriteJson` 把索引写到 `ideas/index.json`。

被调对象说明：

```python
ensure_challenge_dirs(root_dir: str, challenge_id: str) -> None
# 输入: 根目录和题目 ID。
# 输出: 无。
# 整体行为: 创建 memory、ideas、locks 所需目录。

read_ideas_index(root_dir: str, challenge_id: str) -> IdeasIndexRecord
# 输出: 已有索引；缺失时返回 {"challengeId": id, "updated_at": now, "items": []}。

write_ideas_index(root_dir: str, challenge_id: str, record: IdeasIndexRecord) -> None
# 输入: 完整索引对象。
# 输出: 无。
# 整体行为: 原子写入 index.json。
```

## 8. 新增 memory, `appendChallengeMemory`, 行 183-201

### Python 伪代码

```python
def append_challenge_memory(root_dir: str, input_: AddMemoryInput) -> MemoryEntry:
    challenge_id = require_text(input_["challengeId"], "challengeId")
    content = require_text(input_["content"], "content")
    ensure_challenge_dirs(root_dir, challenge_id)

    refs = []
    for item in input_.get("refs", []):
        cleaned = item.strip()
        if cleaned and cleaned not in refs:
            refs.append(cleaned)

    now = now_iso()
    entry = {
        "id": create_entity_id("mem"),
        "challengeId": challenge_id,
        "kind": input_["kind"],
        "content": content,
        "refs": refs,
        "source": require_text(input_["source"], "source"),
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    filename = f"{now_ms()}-{entry['id']}.json"
    atomic_write_json(Path(memory_entries_dir(root_dir, challenge_id)) / filename, entry)
    return entry
```

### 逐行解释

- 行 183 导出 `appendChallengeMemory`，输入是根目录和 `AddMemoryInput`，输出是创建后的 `MemoryEntry`。
- 行 184 校验 `input.challengeId`，得到安全的 `challengeId`。
- 行 185 校验 `input.content`，得到非空内容。
- 行 186 调用 `ensureChallengeDirs` 创建该题目的存储目录。
- 行 188 开始构造 `MemoryEntry`。
- 行 189 调用 `createEntityId("mem")` 生成 memory ID。
- 行 190 写入题目 ID。
- 行 191 写入 memory 类型。
- 行 192 写入正文内容。
- 行 193 处理 `refs`：空值转空数组，每个元素裁剪空白，过滤空字符串，用 `Set` 去重，再转回数组。
- 行 194 校验并写入来源 `source`。
- 行 195 写入创建时间。
- 行 196 写入更新时间。这里源码调用了两次 `nowIso()`，两个时间可能相差极小。
- 行 197 结束 entry 对象。
- 行 198 文件名由当前毫秒时间戳和 entry ID 组成，排序时大致按创建时间排列。
- 行 199 调用 `atomicWriteJson` 写入 `memory/entries/<timestamp>-<id>.json`。
- 行 200 返回创建好的 entry。

被调对象说明：

```python
append_challenge_memory(root_dir: str, input_: AddMemoryInput) -> MemoryEntry
# 输入: root_dir, 以及含 challengeId/kind/content/source/refs 的对象。
# 输出: 完整 MemoryEntry。
# 落盘: 新增一个 memory entry JSON 文件。

ensure_challenge_dirs(root_dir, challenge_id) -> None
# 确保存储目录存在。

atomic_write_json(path, entry) -> None
# 把 entry 作为 JSON 原子写入。
```

设计意图：新增 memory 不需要锁。因为每次新增写的是不同文件名，冲突概率很低。更新和删除需要锁，因为它们要先搜索再改特定文件。

## 9. 列出 memory, `listChallengeMemory`, 行 203-213

### Python 伪代码

```python
def list_challenge_memory(root_dir: str, challenge_id: str) -> list[MemoryEntry]:
    dir_ = memory_entries_dir(root_dir, require_text(challenge_id, "challengeId"))
    files: list[str] = []
    try:
        files = sorted(file for file in readdir(dir_) if file.endswith(".json"))
    except Exception:
        return []

    items = [read_json_file(Path(dir_) / file) for file in files]
    return [item for item in items if item]
```

### 逐行解释

- 行 203 导出 `listChallengeMemory`，输入是根目录和题目 ID，输出 memory 数组。
- 行 204 先校验题目 ID，再定位 memory entries 目录。
- 行 205 初始化文件名数组。
- 行 206 进入读取目录的保护区。
- 行 207 读取目录，只保留 `.json` 文件，并排序。排序依赖文件名前缀中的时间戳，效果是大致按写入顺序返回。
- 行 208 捕获目录读取错误。
- 行 209 读取失败返回空数组。缺失目录会被视为空 memory。
- 行 211 对每个文件调用 `readJsonFile`，并行读取所有 JSON。
- 行 212 过滤掉解析失败或空值，只返回有效 `MemoryEntry`。

被调对象说明：

```python
list_challenge_memory(root_dir: str, challenge_id: str) -> list[MemoryEntry]
# 输入: root_dir, challengeId。
# 输出: MemoryEntry 数组。
# 空状态: 目录缺失、读目录失败、文件解析失败时不会整体抛错。

read_json_file(path) -> MemoryEntry | None
# 这里预期读到单条 MemoryEntry。
```

## 10. 列出 memory 并保留路径, 行 215-231

### Python 伪代码

```python
def list_challenge_memory_with_paths(root_dir: str, challenge_id: str) -> list[MemoryEntryWithPath]:
    dir_ = memory_entries_dir(root_dir, require_text(challenge_id, "challengeId"))
    files: list[str] = []
    try:
        files = sorted(file for file in readdir(dir_) if file.endswith(".json"))
    except Exception:
        return []

    items = []
    for file in files:
        path = str(Path(dir_) / file)
        entry = read_json_file(path)
        if entry:
            items.append({"path": path, "entry": entry})
    return items
```

### 逐行解释

- 行 215 声明内部函数 `listChallengeMemoryWithPaths`，输出带路径的 memory 列表。
- 行 216 校验题目 ID 并定位目录。
- 行 217 初始化文件名数组。
- 行 218 进入读取目录保护区。
- 行 219 读取 `.json` 文件并排序。
- 行 220 捕获读取失败。
- 行 221 返回空数组。
- 行 223 开始并行读取每个文件。
- 行 224 对每个文件执行异步回调。
- 行 225 计算完整路径。
- 行 226 调用 `readJsonFile` 读取 entry。
- 行 227 如果 entry 存在，返回 `{ path, entry }`；否则返回 `undefined`。
- 行 228-229 结束 map 和 `Promise.all`。
- 行 230 过滤掉空项，返回 `MemoryEntryWithPath[]`。

被调对象说明：

```python
list_challenge_memory_with_paths(root_dir, challenge_id) -> list[MemoryEntryWithPath]
# 输出项结构: {"path": str, "entry": MemoryEntry}。
# 用途: update/delete 需要知道 entry 来自哪个 JSON 文件。
```

这和 `listChallengeMemory` 的区别很小，但用途关键：普通列表只给内容，更新删除还需要文件位置。

## 11. 按 ID 或前缀查找 memory, 行 233-241

### Python 伪代码

```python
def find_memory_entry_by_id_or_prefix(
    items: list[MemoryEntryWithPath],
    entry_id_or_prefix: str,
) -> MemoryEntryWithPath:
    lookup = require_text(entry_id_or_prefix, "entryIdOrPrefix")

    exact = next((item for item in items if item["entry"]["id"] == lookup), None)
    if exact:
        return exact

    matched = [item for item in items if item["entry"]["id"].startswith(lookup)]
    if len(matched) == 0:
        raise ValueError(f'memory "{lookup}" not found')
    if len(matched) > 1:
        raise ValueError(f'memory id prefix "{lookup}" is ambiguous')
    return matched[0]
```

### 逐行解释

- 行 233 声明 `findMemoryEntryByIdOrPrefix`，输入是带路径的 memory 数组和 ID 或 ID 前缀。
- 行 234 校验查询字符串。
- 行 235 先找完整 ID 精确匹配。
- 行 236 如果找到，立即返回。精确匹配优先级高于前缀匹配。
- 行 237 找所有 ID 以查询字符串开头的项。
- 行 238 如果没有匹配项，抛出 `memory "<id>" not found`。
- 行 239 如果匹配超过一条，抛出前缀歧义错误。
- 行 240 返回唯一匹配项。

被调对象说明：

```python
find_memory_entry_by_id_or_prefix(items, entry_id_or_prefix) -> MemoryEntryWithPath
# 输入: 带路径 memory 列表, 完整 ID 或短前缀。
# 输出: 唯一匹配项。
# 失败: 找不到或前缀匹配多条。
```

前缀查找是人机交互友好设计：用户可以输入 `mem_12ab` 这类短 ID，但系统必须防止短 ID 同时命中多条记录。

## 12. 更新 memory, `updateChallengeMemory`, 行 243-270

### Python 伪代码

```python
def update_challenge_memory(
    root_dir: str,
    challenge_id: str,
    entry_id_or_prefix: str,
    patch: dict,
) -> MemoryEntry:
    id_ = require_text(challenge_id, "challengeId")
    ensure_challenge_dirs(root_dir, id_)

    def action():
        items = list_challenge_memory_with_paths(root_dir, id_)
        matched = find_memory_entry_by_id_or_prefix(items, entry_id_or_prefix)

        next_content = (
            require_text(patch["content"], "content")
            if "content" in patch
            else matched["entry"]["content"]
        )
        next_source = (
            require_text(patch["source"], "source")
            if "source" in patch
            else matched["entry"]["source"]
        )
        next_refs = (
            dedupe_trim_nonempty(patch["refs"])
            if "refs" in patch
            else matched["entry"]["refs"]
        )

        updated = {
            **matched["entry"],
            **({"kind": patch["kind"]} if patch.get("kind") else {}),
            "content": next_content,
            "refs": next_refs,
            "source": next_source,
            "updated_at": now_iso(),
        }
        atomic_write_json(matched["path"], updated)
        return updated

    return with_directory_lock(memory_lock_dir(root_dir, id_), action)
```

### 逐行解释

- 行 243-248 导出 `updateChallengeMemory`，输入是根目录、题目 ID、entry ID 或前缀、patch 对象，输出更新后的 `MemoryEntry`。
- 行 249 校验题目 ID。
- 行 250 确保存储目录存在。
- 行 252 用 `withDirectoryLock(memoryLockDir(...), async () => {...})` 包住更新逻辑。memory 更新需要锁，因为要“读列表、定位文件、写回文件”。
- 行 253 在锁内调用 `listChallengeMemoryWithPaths`，读出所有 memory 及路径。
- 行 254 用 `findMemoryEntryByIdOrPrefix` 定位目标 entry。
- 行 255 计算 `nextContent`。如果 patch 里显式传了 `content`，就校验并使用新内容；否则保留旧内容。
- 行 256 同理计算 `nextSource`。
- 行 257-258 计算 `nextRefs`。如果 patch 传了 refs，就裁剪、过滤空值、去重；否则保留旧 refs。
- 行 259 开始构造更新后的 `MemoryEntry`。
- 行 260 用对象展开复制旧 entry 的所有字段。
- 行 261 如果 patch 里有 truthy 的 `kind`，就覆盖 kind。
- 行 262 覆盖 content。
- 行 263 覆盖 refs。
- 行 264 覆盖 source。
- 行 265 覆盖更新时间。
- 行 266 结束对象。
- 行 267 用 `atomicWriteJson` 原子写回原文件路径。
- 行 268 返回更新后的 entry。
- 行 269-270 结束锁内回调和函数。

被调对象说明：

```python
update_challenge_memory(root_dir, challenge_id, entry_id_or_prefix, patch) -> MemoryEntry
# patch 结构: {"kind"?: MemoryKind, "content"?: str, "refs"?: list[str], "source"?: str}
# 输出: 更新后的 MemoryEntry。
# 落盘: 重写目标 memory JSON 文件。

with_directory_lock(memory_lock_dir(...), action) -> T
# 保证同一题目的 memory 更新/删除串行执行。
```

关键点：patch 是部分更新。没传的字段沿用旧值，传了的字段会做必要清洗。

## 13. 删除 memory, `deleteChallengeMemory`, 行 272-282

### Python 伪代码

```python
def delete_challenge_memory(root_dir: str, challenge_id: str, entry_id_or_prefix: str) -> MemoryEntry:
    id_ = require_text(challenge_id, "challengeId")
    ensure_challenge_dirs(root_dir, id_)

    def action():
        items = list_challenge_memory_with_paths(root_dir, id_)
        matched = find_memory_entry_by_id_or_prefix(items, entry_id_or_prefix)
        remove_path(matched["path"], force=True)
        return matched["entry"]

    return with_directory_lock(memory_lock_dir(root_dir, id_), action)
```

### 逐行解释

- 行 272 导出 `deleteChallengeMemory`，输入是根目录、题目 ID、entry ID 或前缀，输出被删除前的 `MemoryEntry`。
- 行 273 校验题目 ID。
- 行 274 确保存储目录存在。
- 行 276 使用 memory 锁包裹删除逻辑。
- 行 277 列出 memory 及路径。
- 行 278 定位目标 entry。
- 行 279 源码调用 `rm(matched.path, { force: true })` 删除目标 JSON 文件。`force` 表示文件不存在时也尽量不报错。
- 行 280 返回被删除的 entry 内容，方便调用方广播或记录删除结果。
- 行 281-282 结束锁内回调和函数。

被调对象说明：

```python
delete_challenge_memory(root_dir, challenge_id, entry_id_or_prefix) -> MemoryEntry
# 输出: 删除前的 MemoryEntry。
# 落盘: 源码语义是移除目标 memory JSON 文件。
```

删除也加锁，因为它同样先查找再操作路径。如果查找和删除之间被另一个写入者打断，就可能删错或报错。

## 14. 列出和搜索 ideas, 行 284-293

### Python 伪代码

```python
def list_challenge_ideas(root_dir: str, challenge_id: str) -> list[IdeaRecord]:
    index = read_ideas_index(root_dir, challenge_id)
    return [*index["items"]]


def search_challenge_ideas(root_dir: str, challenge_id: str, query: str) -> list[IdeaRecord]:
    normalized_query = require_text(query, "query").lower()
    index = read_ideas_index(root_dir, challenge_id)
    return [
        item for item in index["items"]
        if normalized_query in item["content"].lower()
        or normalized_query in item["result"].lower()
    ]
```

### 逐行解释

- 行 284 导出 `listChallengeIdeas`，输入是根目录和题目 ID，输出 idea 数组。
- 行 285 调用 `readIdeasIndex` 读取索引。索引不存在时会返回空索引。
- 行 286 返回 `index.items` 的浅拷贝。浅拷贝像把列表外壳复制一份，避免调用者直接持有内部数组引用。
- 行 289 导出 `searchChallengeIdeas`，输入是根目录、题目 ID、查询文本，输出匹配的 idea 数组。
- 行 290 校验查询文本，并转小写。
- 行 291 读取 ideas 索引。
- 行 292 过滤 items：只要 `content` 或 `result` 的小写文本包含查询词，就返回。

被调对象说明：

```python
list_challenge_ideas(root_dir, challenge_id) -> list[IdeaRecord]
# 输出: 当前索引里的全部 idea。

search_challenge_ideas(root_dir, challenge_id, query) -> list[IdeaRecord]
# 输入: query 必须是非空字符串。
# 输出: content 或 result 包含 query 的 idea。

read_ideas_index(root_dir, challenge_id) -> IdeasIndexRecord
# 索引缺失时返回空索引。
```

搜索只查 `content` 和 `result`，不查 `status`、`id`、`normalized`。这是一个简单全文包含匹配。

## 15. 新增 idea, `addChallengeIdea`, 行 295-325

### Python 伪代码

```python
def add_challenge_idea(root_dir: str, challenge_id: str, input_: AddIdeaInput) -> AddIdeaResult:
    id_ = require_text(challenge_id, "challengeId")
    normalized_content = require_text(input_["content"], "content")
    dedup_key = normalize_idea_text(normalized_content)
    ensure_challenge_dirs(root_dir, id_)

    def action():
        index = read_ideas_index(root_dir, id_)
        existing = next((item for item in index["items"] if item["normalized"] == dedup_key), None)
        if existing:
            return {"created": False, "item": existing}

        now = now_iso()
        idea = {
            "id": create_entity_id("idea"),
            "content": normalized_content,
            "normalized": dedup_key,
            "status": input_.get("status", "pending"),
            "result": input_.get("result", "").strip(),
            "created_at": now,
            "updated_at": now,
        }
        next_index = {
            **index,
            "updated_at": now,
            "items": [*index["items"], idea],
        }
        write_ideas_index(root_dir, id_, next_index)
        atomic_write_json(idea_by_id_path(root_dir, id_, idea["id"]), idea)
        return {"created": True, "item": idea}

    return with_directory_lock(ideas_lock_dir(root_dir, id_), action)
```

### 逐行解释

- 行 295 导出 `addChallengeIdea`，输入是根目录、题目 ID、新增 idea 输入，输出 `AddIdeaResult`。
- 行 296 校验题目 ID。
- 行 297 校验 idea 正文，得到 `normalizedContent`。变量名里有 normalized，但这一步只是 trim 后的内容。
- 行 298 调用 `normalizeIdeaText` 得到真正的去重 key。
- 行 299 确保存储目录存在。
- 行 301 使用 ideas 锁包裹新增逻辑。因为新增 idea 会改共享的 `index.json`。
- 行 302 读取当前 ideas 索引。
- 行 303 查找是否已有相同 `normalized` 的 idea。
- 行 304 如果已有，返回 `{ created: false, item: existing }`，不重复创建。
- 行 306 记录统一的当前时间。
- 行 307 开始构造 `IdeaRecord`。
- 行 308 生成 `idea_` 前缀 ID。
- 行 309 保存原始裁剪后的内容。
- 行 310 保存去重 key。
- 行 311 如果输入没有 status，默认 `pending`。
- 行 312 如果输入有 result，就 trim；没有则用空字符串。
- 行 313 写入创建时间。
- 行 314 写入更新时间。
- 行 315 结束 idea 对象。
- 行 316 开始构造新的索引。
- 行 317 复制旧索引字段。
- 行 318 更新索引级 `updated_at`。
- 行 319 把新 idea 追加到 items 末尾。
- 行 320 结束 nextIndex。
- 行 321 调用 `writeIdeasIndex` 写入 `ideas/index.json`。
- 行 322 调用 `atomicWriteJson` 写入 `ideas/by-id/<ideaId>.json`。
- 行 323 返回 `{ created: true, item: idea }`。
- 行 324-325 结束锁内回调和函数。

被调对象说明：

```python
add_challenge_idea(root_dir, challenge_id, input_) -> AddIdeaResult
# 输入: {"content": str, "status"?: IdeaStatus, "result"?: str}
# 输出: {"created": bool, "item": IdeaRecord}
# 去重: content.trim().toLowerCase()

write_ideas_index(root_dir, id_, next_index) -> None
# 写完整索引。

idea_by_id_path(root_dir, id_, idea_id) -> str
# 给单条 idea 副本生成路径。
```

这个函数的核心是“幂等新增”：同一条想法重复添加不会制造两个记录，只会返回已有记录。

## 16. 按 ID 或前缀查找 idea, 行 327-335

### Python 伪代码

```python
def find_idea_by_id_or_prefix(items: list[IdeaRecord], idea_id_or_prefix: str) -> IdeaRecord:
    lookup = require_text(idea_id_or_prefix, "ideaIdOrPrefix")

    exact = next((item for item in items if item["id"] == lookup), None)
    if exact:
        return exact

    prefixed = [item for item in items if item["id"].startswith(lookup)]
    if len(prefixed) == 0:
        raise ValueError(f'idea "{lookup}" not found')
    if len(prefixed) > 1:
        raise ValueError(f'idea id prefix "{lookup}" is ambiguous')
    return prefixed[0]
```

### 逐行解释

- 行 327 声明 `findIdeaByIdOrPrefix`，输入是 idea 数组和 ID 或前缀，输出唯一 `IdeaRecord`。
- 行 328 校验查询字符串。
- 行 329 先找完整 ID 精确匹配。
- 行 330 找到就返回。
- 行 331 再找所有前缀匹配。
- 行 332 没找到就抛出 `idea "<id>" not found`。
- 行 333 匹配多条就抛出前缀歧义错误。
- 行 334 返回唯一匹配项。

被调对象说明：

```python
find_idea_by_id_or_prefix(items, idea_id_or_prefix) -> IdeaRecord
# 输入: ideas 索引中的 items, 完整 ID 或短前缀。
# 输出: 唯一 idea。
# 失败: 找不到或前缀歧义。
```

这和 memory 的查找逻辑平行，只是 idea 不需要携带文件路径，因为它的主数据从 `index.items` 来。

## 17. 更新 idea, `updateChallengeIdea`, 行 337-376

### Python 伪代码

```python
def update_challenge_idea(
    root_dir: str,
    challenge_id: str,
    idea_id_or_prefix: str,
    patch: UpdateIdeaInput,
) -> IdeaRecord:
    id_ = require_text(challenge_id, "challengeId")
    ensure_challenge_dirs(root_dir, id_)

    def action():
        index = read_ideas_index(root_dir, id_)
        matched = find_idea_by_id_or_prefix(index["items"], idea_id_or_prefix)

        next_content = matched["content"]
        next_normalized = matched["normalized"]
        if "content" in patch:
            content = require_text(patch["content"], "content")
            normalized = normalize_idea_text(content)
            duplicate = next(
                (
                    item for item in index["items"]
                    if item["id"] != matched["id"] and item["normalized"] == normalized
                ),
                None,
            )
            if duplicate:
                raise ValueError(f"idea content duplicates {duplicate['id']}")
            next_content = content
            next_normalized = normalized

        now = now_iso()
        updated = {
            **matched,
            "content": next_content,
            "normalized": next_normalized,
            "status": patch.get("status", matched["status"]),
            "result": patch["result"].strip() if "result" in patch else matched["result"],
            "updated_at": now,
        }
        next_index = {
            **index,
            "updated_at": now,
            "items": [
                updated if item["id"] == matched["id"] else item
                for item in index["items"]
            ],
        }
        write_ideas_index(root_dir, id_, next_index)
        atomic_write_json(idea_by_id_path(root_dir, id_, updated["id"]), updated)
        return updated

    return with_directory_lock(ideas_lock_dir(root_dir, id_), action)
```

### 逐行解释

- 行 337 导出 `updateChallengeIdea`，输入是根目录、题目 ID、idea ID 或前缀、patch，输出更新后的 `IdeaRecord`。
- 行 338 校验题目 ID。
- 行 339 确保存储目录存在。
- 行 341 使用 ideas 锁包裹更新逻辑。
- 行 342 读取当前索引。
- 行 343 用 `findIdeaByIdOrPrefix` 定位目标 idea。
- 行 345 初始化 `nextContent` 为旧内容。
- 行 346 初始化 `nextNormalized` 为旧去重 key。
- 行 347 如果 patch 显式传入 `content`，进入内容更新分支。
- 行 348 校验新内容非空。
- 行 349 计算新内容的 normalized key。
- 行 350 在其他 idea 中查找是否已有相同 normalized key。
- 行 351 如果找到重复项，进入错误分支。
- 行 352 抛出 `idea content duplicates <id>`，阻止两个 idea 拥有同一去重 key。
- 行 354 保存新内容。
- 行 355 保存新 normalized key。
- 行 358 记录统一更新时间。
- 行 359 开始构造更新后的 `IdeaRecord`。
- 行 360 复制旧 idea 字段。
- 行 361 覆盖 content。
- 行 362 覆盖 normalized。
- 行 363 如果 patch 有 status 就用新值，否则保留旧状态。
- 行 364 如果 patch 有 result 就 trim 后覆盖，否则保留旧 result。
- 行 365 覆盖更新时间。
- 行 366 结束 updated 对象。
- 行 367 开始构造新索引。
- 行 368 复制旧索引字段。
- 行 369 更新索引级 `updated_at`。
- 行 370 用 `map` 替换目标 item，其他 item 原样保留。
- 行 371 结束 nextIndex。
- 行 372 写回 `ideas/index.json`。
- 行 373 写回 `ideas/by-id/<ideaId>.json`。
- 行 374 返回更新后的 idea。
- 行 375-376 结束锁内回调和函数。

被调对象说明：

```python
update_challenge_idea(root_dir, challenge_id, idea_id_or_prefix, patch) -> IdeaRecord
# patch 结构: {"content"?: str, "status"?: IdeaStatus, "result"?: str}
# 输出: 更新后的 IdeaRecord。
# 落盘: 同步更新 index.json 和 by-id 副本。

find_idea_by_id_or_prefix(items, prefix) -> IdeaRecord
# 从索引 items 中定位目标。
```

这里的重复检查很重要。`normalized` 像数据库里的唯一索引，更新内容时也要维护唯一性。

## 18. 删除 idea, `deleteChallengeIdea`, 行 378-394

### Python 伪代码

```python
def delete_challenge_idea(root_dir: str, challenge_id: str, idea_id_or_prefix: str) -> IdeaRecord:
    id_ = require_text(challenge_id, "challengeId")
    ensure_challenge_dirs(root_dir, id_)

    def action():
        index = read_ideas_index(root_dir, id_)
        matched = find_idea_by_id_or_prefix(index["items"], idea_id_or_prefix)
        next_index = {
            **index,
            "updated_at": now_iso(),
            "items": [item for item in index["items"] if item["id"] != matched["id"]],
        }
        write_ideas_index(root_dir, id_, next_index)
        remove_path(idea_by_id_path(root_dir, id_, matched["id"]), force=True)
        return matched

    return with_directory_lock(ideas_lock_dir(root_dir, id_), action)
```

### 逐行解释

- 行 378 导出 `deleteChallengeIdea`，输入是根目录、题目 ID、idea ID 或前缀，输出被删除前的 `IdeaRecord`。
- 行 379 校验题目 ID。
- 行 380 确保存储目录存在。
- 行 382 使用 ideas 锁包裹删除逻辑。
- 行 383 读取当前索引。
- 行 384 用 ID 或前缀定位目标 idea。
- 行 385 开始构造新索引。
- 行 386 复制旧索引字段。
- 行 387 更新索引级 `updated_at`。
- 行 388 过滤掉目标 idea。
- 行 389 结束 nextIndex。
- 行 390 写回 `ideas/index.json`。
- 行 391 源码删除 `ideas/by-id/<ideaId>.json` 副本。
- 行 392 返回被删除的 idea。
- 行 393-394 结束锁内回调和函数。

被调对象说明：

```python
delete_challenge_idea(root_dir, challenge_id, idea_id_or_prefix) -> IdeaRecord
# 输出: 删除前的 IdeaRecord。
# 落盘: index.json 移除该 item, by-id 副本按源码语义移除。
```

ideas 的删除需要同时维护两份落盘结构：索引是主视图，by-id 副本是辅助视图。只删其中一边会造成读者看到的状态不一致。

## 19. 公共接口速查

```python
append_challenge_memory(root_dir, input_) -> MemoryEntry
list_challenge_memory(root_dir, challenge_id) -> list[MemoryEntry]
update_challenge_memory(root_dir, challenge_id, entry_id_or_prefix, patch) -> MemoryEntry
delete_challenge_memory(root_dir, challenge_id, entry_id_or_prefix) -> MemoryEntry

list_challenge_ideas(root_dir, challenge_id) -> list[IdeaRecord]
search_challenge_ideas(root_dir, challenge_id, query) -> list[IdeaRecord]
add_challenge_idea(root_dir, challenge_id, input_) -> AddIdeaResult
update_challenge_idea(root_dir, challenge_id, idea_id_or_prefix, patch) -> IdeaRecord
delete_challenge_idea(root_dir, challenge_id, idea_id_or_prefix) -> IdeaRecord
```

这些导出函数是 `memory.ts` 对外提供的行为面。其他文件通常不关心 JSON 文件怎么写，只关心这些函数的输入输出。

## 20. 流程地图

### memory 新增

```text
input -> requireText -> ensureChallengeDirs -> build MemoryEntry -> atomicWriteJson -> return entry
```

### memory 更新

```text
challengeId -> ensureChallengeDirs -> memory.lock
  -> list entries with paths
  -> find by exact id or unique prefix
  -> merge patch
  -> atomicWriteJson(original path)
  -> unlock
```

### memory 删除

```text
challengeId -> ensureChallengeDirs -> memory.lock
  -> list entries with paths
  -> find by exact id or unique prefix
  -> remove matched file
  -> return old entry
  -> unlock
```

### idea 新增

```text
content -> requireText -> normalize -> ensureChallengeDirs -> ideas.lock
  -> read index
  -> if normalized exists: return existing
  -> build IdeaRecord
  -> write index
  -> write by-id copy
  -> unlock
```

### idea 更新

```text
idea id/prefix -> ensureChallengeDirs -> ideas.lock
  -> read index
  -> find idea
  -> if content changes: normalize and reject duplicates
  -> build updated item
  -> replace item in index
  -> write index and by-id copy
  -> unlock
```

### idea 删除

```text
idea id/prefix -> ensureChallengeDirs -> ideas.lock
  -> read index
  -> find idea
  -> filter item out of index
  -> write index
  -> remove by-id copy
  -> unlock
```

## 21. 行号覆盖清单

- 行 1-2：导入文件系统和路径工具。
- 行 4-62：类型、接口、输入输出数据结构。
- 行 64-84：时间、非空文本校验、idea 归一化、目录存在错误识别、短 ID 生成。
- 行 86-108：challenge、ideas、memory、locks 的路径构造。
- 行 110-125：JSON 容错读取和原子写入。
- 行 127-160：基于目录创建的互斥锁。
- 行 162-181：目录初始化、ideas 索引读取和写入。
- 行 183-201：新增 memory。
- 行 203-213：列出 memory。
- 行 215-231：列出 memory 并附带路径。
- 行 233-241：按完整 ID 或唯一前缀查找 memory。
- 行 243-270：更新 memory。
- 行 272-282：删除 memory。
- 行 284-293：列出和搜索 ideas。
- 行 295-325：新增 idea，含 normalized 去重。
- 行 327-335：按完整 ID 或唯一前缀查找 idea。
- 行 337-376：更新 idea，含重复内容拒绝。
- 行 378-394：删除 idea。

## 22. 从测试反推的关键行为

`memory.test.ts` 可以验证本文解释的几个关键事实：

- 同一 idea 正文只要 normalized 后相同，第二次新增会返回已有记录，`created` 为 `false`。
- idea 可以通过 ID 前缀更新和删除。
- 把一条 idea 更新成另一条已有 idea 的 normalized 内容会抛出 duplicates 错误。
- memory 新增后能按列表读回。
- memory 可以通过 ID 前缀更新和删除。
- 删除函数返回被删除前的记录，方便上层继续广播“哪条记录被删了”。

## 23. 读这个文件时容易漏掉的点

- `readIdeasIndex` 在索引缺失时只返回空对象，不会创建文件。这解释了“列出空 challenge ideas 不创建存储目录”的测试行为。
- `appendChallengeMemory` 没有加锁，因为新增写入的是独立文件；`updateChallengeMemory` 和 `deleteChallengeMemory` 加锁，因为它们依赖“先查找再改路径”的复合动作。
- `ideas/index.json` 是主索引，`ideas/by-id/*.json` 是副本。更新和删除 idea 时必须同步维护二者。
- `refs` 的清洗规则会去掉空字符串并去重。顺序由第一次出现的位置决定。
- `patch.kind ? { kind: patch.kind } : {}` 意味着空值不会覆盖 kind。由于合法 `MemoryKind` 都是非空字符串，这个写法在当前类型下成立。
- `Date.now()` 文件名前缀提供排序线索，但唯一性仍主要依赖随机 ID。
- 目录锁是一种轻量文件系统锁。它依赖“创建已存在目录会失败”的原子特性，适合本地文件存储的小规模并发控制。
