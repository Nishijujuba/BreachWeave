# Agent 长程任务架构分析

本文标注并整理 BreachWeave 在自动化渗透测试场景中的多 agent 设计。重点关注任务拆分、任务执行漂移监测、任务结束判定、上下文管理、上下文压缩、记忆管理、agent 间通讯、Ralph-loop、多 agent 分工，以及固定系统规则和大模型自由发挥之间的取舍。

## 代码标注索引

| 主题 | 关键文件 | 设计要点 |
| --- | --- | --- |
| 全局调度 | [`packages/core/src/challenge/manager.ts`](../packages/core/src/challenge/manager.ts) | 构造 planner snapshot，限制 challenge/solver 资源，启动和停止 solver |
| 赛题状态与结束判定 | [`packages/core/src/challenge/store.ts`](../packages/core/src/challenge/store.ts) | 保存 challenge、attempt、submission，并用 flag 进度判定完成 |
| Solver 运行时 | [`packages/core/src/runtime/runtime.ts`](../packages/core/src/runtime/runtime.ts) | Docker 执行、JSONL 事件流、host bridge 请求转发 |
| Solver 会话 | [`packages/core/src/solver/session.ts`](../packages/core/src/solver/session.ts) | 组装 prompt、extension、workspace、session manager |
| Observer 循环 | [`packages/core/src/solver/extension/challenge-observer/observer-loop.ts`](../packages/core/src/solver/extension/challenge-observer/observer-loop.ts) | 按轮次收集行为摘要，周期性或强制触发旁路审查 |
| Observer Agent | [`packages/core/src/solver/extension/challenge-observer/observer-agent.ts`](../packages/core/src/solver/extension/challenge-observer/observer-agent.ts) | 维护 strategy board，收束 idea/memory，必要时发纠偏提醒 |
| Ralph-loop | [`packages/core/src/solver/extension/challenge-observer/ralph-loop.ts`](../packages/core/src/solver/extension/challenge-observer/ralph-loop.ts) | agent 结束后根据 challenge 完成状态自动续跑 |
| Idea/Memory 存储 | [`packages/core/src/challenge/memory.ts`](../packages/core/src/challenge/memory.ts) | 将攻击假设和耐压缩事实分层保存 |
| Host bridge | [`packages/core/src/challenge/host-bridge-handler.ts`](../packages/core/src/challenge/host-bridge-handler.ts) | 处理 hint、flag 提交、完成状态查询，并向同题 solver 广播 |
| Subagent 调度 | [`packages/core/src/config/tools/subagent.ts`](../packages/core/src/config/tools/subagent.ts) | 支持 single、parallel、chain 三种子 agent 调用模式 |
| Subagent 输出合约 | [`packages/core/src/config/tools/submit-sub-agent-output.ts`](../packages/core/src/config/tools/submit-sub-agent-output.ts) | 要求子 agent 以结构化 schema 提交结果 |
| Subagent 结果汇入 | [`packages/core/src/config/tools/ingest-sub-agent-output.ts`](../packages/core/src/config/tools/ingest-sub-agent-output.ts) | 合并 hypothesis、finding、coverage gap，驱动后续阶段 |
| 执行边界 | [`packages/core/src/solver/extension/scope-guard.ts`](../packages/core/src/solver/extension/scope-guard.ts) | 约束主 agent 和子 agent 的工具权限、写入边界、探索预算 |
| 大输出降噪 | [`packages/core/src/solver/extension/large-tool-result.ts`](../packages/core/src/solver/extension/large-tool-result.ts) | 大工具结果落盘，只把摘要和定位方式送回上下文 |
| 压缩指令 | [`packages/core/src/solver/extension/pentest-compaction.ts`](../packages/core/src/solver/extension/pentest-compaction.ts) | 指定会话压缩时必须保留的状态与证据 |

## 总体架构

BreachWeave 的核心架构可以概括为四个平面：

- **控制平面**：`Manager` 负责调度 challenge 实例和 solver 资源。
- **执行平面**：`Solver` 负责真实的渗透测试动作，例如信息收集、漏洞验证、利用链推进、flag 提交。
- **监督平面**：`Observer` 作为旁路审查者，持续维护 idea/memory 看板，发现低效或漂移时做轻量纠偏。
- **状态平面**：challenge store、memory store、subagent output、run-state 共同保存跨轮次、跨 agent 的 durable state。

这个架构的价值在于把 LLM 最薄弱的部分交给程序固定下来：资源调度、完成判定、持久记忆、权限边界、结构化输出。模型的自由度集中在局部推理、攻击假设、payload 构造、证据解释和下一步选择上。

## 任务拆分与调度

`manager.ts` 中的 planner snapshot 是调度核心。它把以下信息压缩成当前轮次的调度视图：

- 未完成 challenge 列表和分数、难度、flag 剩余量。
- 当前活跃 solver、所属 challenge、运行时长、是否 stale。
- 可用 solver prompt，以及不同 prompt 的历史表现。
- 上一轮 planner 动作和摘要，避免重复启动、重复停止、重复改阵型。

`CHALLENGE_PLANNER.md` 给 planner 设置了硬约束：最多 3 个 challenge 实例，solver 总数受 `maxSolvers` 限制，`stale = no` 的题目不能随意停止。这是一种防抖设计。复杂长程任务里，模型常因短期反馈不足而频繁换方向；BreachWeave 用 stale、资源槽位和上一轮动作记录，让调度更接近队列系统。

一个直观类比：Manager 像机场塔台。塔台不亲自开飞机，但它决定跑道、航线、优先级和是否返航。Solver 像飞机，负责执行飞行任务。Observer 像飞行记录员和安全监督员，持续记录偏差和关键证据。

## 任务执行漂移监测

漂移指 agent 的行为逐渐偏离原始目标，表现为重复低价值探索、忘记已有结论、沉迷某条已被证伪的路线，或在收到新同步消息后机械改线。

`observer-loop.ts` 通过事件监听构造审查窗口：

- 每个 assistant message 结束时，记录一轮 `ObserverRoundPayload`。
- 工具调用只保留工具名、参数摘要、结果摘要、错误状态。
- 默认每 6 轮触发一次 review，最多回看最近 10 轮。
- 调用 `challenge_get_hint` 后强制触发 review。
- agent 结束时触发最终 review。

Observer 的审查输入经过压缩，避免把原始工具结果和完整对话塞进审查上下文。它看到的是“行为轨迹摘要”，这让它更接近一个审计器，定位上不承担执行者角色。

## Ralph-loop 与结束判定

`ralph-loop.ts` 解决一个非常具体的问题：solver 在阶段性停顿后可能过早结束。自动化渗透测试常出现“拿到一个 flag 后停下”的情况，而比赛题可能有多个 flag。

Ralph-loop 的逻辑是：

1. agent 结束时通过 host bridge 查询 `challenge_is_completed`。
2. 如果 challenge 没完成，注入一条继续任务的系统同步消息。
3. 如果前一轮是错误结束，按指数退避重试，最多 10 次。
4. 继续消息明确要求基于现有上下文推进，并且多 flag 题需要等比赛 API 显示完成。

真正的完成判定在 `store.ts`：

\[
completed = flag\_count > 0 \land flag\_got\_count \ge flag\_count
\]

这个设计把“主观感觉做完了”替换为“外部状态证明完成”。长程 agent 系统里，这种外置判定非常关键，因为模型的自我停止倾向常早于任务真实完成。

## 上下文管理与压缩

BreachWeave 没有依赖一段无限增长的对话上下文。它把上下文拆为几层：

- **原始会话层**：JSONL session 保存完整消息、工具调用和工具结果。
- **近期行为层**：Observer 只读最近若干轮摘要。
- **结构化记忆层**：Memory 保存事实、证据、失败边界、hint、约束。
- **策略看板层**：Idea 保存待验证攻击假设及生命周期。
- **外部工件层**：大工具输出、subagent 输出、evidence path 落盘保存。

可以把上下文压缩理解为函数：

\[
C_{next}=f(C_{raw}, M, I, R, E)
\]

其中 `C_raw` 是原始会话，`M` 是 durable memory，`I` 是 ideas，`R` 是 recent rounds，`E` 是 evidence artifacts。好的压缩函数保留高信号事实、攻击假设、失败边界和证据引用，丢弃低价值流水账。

`large-tool-result.ts` 的设计也服务于这个目标：当工具结果超过阈值时，完整内容写入 `.tool-results/`，上下文只保留预览、路径和检索建议。这能降低“工具输出淹没推理”的风险。

## 记忆管理：Idea 与 Memory 分层

`memory.ts` 把状态拆成两个概念：

- **Idea**：下一步值得测试的攻击假设，状态为 `pending/testing/verified/failed/skipped`。
- **Memory**：压缩后仍值得保留的事实、证据、失败边界、hint、约束，类型为 `fact/evidence/failure/note/hint`。

这两者的差别非常重要。Idea 像白板，上面写“接下来测什么”；Memory 像证据柜，里面放“已经确认或需要长期保留什么”。白板允许假设、推进、证伪；证据柜要求稳定、可复用、耐压缩。

Observer prompt 还给出强约束：优先 `NO_CHANGE`，再更新已有记录，再删除过时记录，最后才新增记录。这是对抗上下文腐烂的核心手段。上下文腐烂指信息越来越多、越来越旧、越来越混杂，导致后续决策被噪音牵着走。这里的治理策略是“先闭环，再收缩，最后扩展”。

## Agent 间通讯

BreachWeave 的 agent 通讯分为三类：

1. **Host bridge 通讯**：solver 通过 `challenge_get_state`、`challenge_get_hint`、`challenge_submit_flag` 等工具向宿主请求权威状态。
2. **Solver 间同步**：当一个 solver 提交正确 flag，host bridge 会把进度、writeup、idea/memory 摘要广播给同题其他 solver，减少重复劳动。
3. **Subagent 文件合约**：subagent 使用 `submit_sub_agent_output` 生成结构化 JSON，主 agent 用 `ingest_sub_agent_output` 汇入全局状态。

这种设计避免了纯自然语言转述带来的信息丢失。尤其是 subagent 输出合约，强制每个子任务交付 `assets`、`hypotheses`、`candidate_findings`、`evidence_refs`、`coverage_gaps` 和可选 `goal`。这相当于给 agent 协作增加了类型系统。

## 多 Agent 分工与协作

项目里存在两套多 agent 协作模式：

- **Challenge 模式**：Manager 启动多个 Solver 并行攻题，Observer 对单个 solver 旁路监督，host bridge 负责同题广播。
- **Pentest workspace 模式**：主 agent 调度 `recon`、`targeted-pentest`、`payload-research`、`custom` 等 subagent，结果通过结构化输出进入 hypothesis backlog。

`subagent.ts` 支持三种模式：

- single：单个专用 agent 处理一项任务。
- parallel：多个 agent 并发探索不同方向，最大并发数受限制。
- chain：顺序调用多个 agent，后一步可以引用前一步输出。

`scope-guard.ts` 则给协作加边界：主 agent 直接执行 recon/test 命令会被统计和提醒；子 agent 写共享状态会被阻止；子 agent 的探索工具调用有预算。这种约束能防止“所有 agent 都在改同一本账”，也能防止主 agent 从调度者滑向无边界执行者。

## 固定系统规则与模型自由度

BreachWeave 的 tradeoff 可以用一句话概括：固定任务骨架，开放局部策略。

固定部分包括：

- challenge/solver 资源上限。
- stale 和完成判定。
- Idea/Memory schema。
- subagent 输出 schema。
- host bridge 权威状态查询。
- Ralph-loop 续跑规则。
- scope guard 权限边界。
- 大工具结果落盘策略。

开放部分包括：

- 具体漏洞假设。
- payload 构造和变体选择。
- 工具组合顺序。
- 子路线探索。
- 证据解释。
- writeup 和下一步计划。

LLM 擅长在局部不确定空间里联想、试探、解释和构造。LLM 薄弱点在长期记账、边界一致性、终止判断、重复控制和状态压缩。BreachWeave 把后者交给程序和结构化状态，把前者留给模型，这是它适合复杂长程任务的根本原因。

## 亮点设计

- **Observer sidecar**：监督者只维护看板和提醒，权限受到限制，减少“第二个 solver 抢方向”的混乱。
- **失败边界**：一次 payload 失败通常只说明某个变体失败，不能直接关闭整条攻击路线。Observer prompt 明确强调 failure boundary。
- **Ralph-loop**：用外部完成状态驱动续跑，降低早停概率。
- **同题广播**：一个 solver 拿到 flag 后把路线摘要和剩余 flag 信息同步给其他 solver，减少重复劳动。
- **Subagent schema**：把探索产出收束成可验证、可汇入、可排序的结构化记录。
- **Scope guard**：用工具层规则约束主 agent 和子 agent 的职责边界。
- **Attack timeline**：把 solver、observer、board、submission 事件串起来，为复盘和调参提供时间轴。

## 风险与改进空间

- 部分很有价值的 extension 在 `session.ts` 中处于注释状态，例如大输出落盘、scope guard、compaction、rtk rewrite。需要确认生产运行时是否通过其他路径启用。
- `memory.ts` 和 `store.ts` 使用文件锁和 JSON 文件持久化，简单可靠，但高并发下需要继续关注锁超时、临时文件残留、跨平台路径差异。
- Observer 依赖摘要质量。若工具结果摘要过短，可能漏掉关键证据；若摘要过长，又会增加上下文压力。
- Idea 去重目前主要基于归一化文本，近义攻击路线仍可能重复，需要结合语义聚类或人工规则继续收缩。
- Planner 的 prompt 表现统计已经存在，但更细粒度的“题型到 prompt 能力”映射还有提升空间。

## 对长程 agent 系统的启发

BreachWeave 的核心经验是：复杂任务要把“思考”和“记账”分开，把“执行”和“监督”分开，把“假设”和“事实”分开。

对于任意长程 agent 系统，可以复用以下模式：

1. 用外部状态判定完成，减少模型早停。
2. 用旁路 Observer 维护压缩状态，减少主 agent 负担。
3. 用 Idea/Memory 分层保存假设与事实，减少状态混淆。
4. 用结构化输出合约汇入子 agent 结果，减少自然语言协作损耗。
5. 用 scope guard 约束职责边界，减少多 agent 相互踩状态。
6. 用时间轴和统计数据复盘，持续调 prompt、工具和调度策略。

最终，这套架构的重点落在系统化长程执行能力上：把长程自动化任务变成可调度、可观察、可压缩、可恢复的系统。
