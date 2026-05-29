#!/usr/bin/env python3
"""Run a Codex skill/workflow over a task list, one item at a time."""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Sequence


DEFAULT_OUT_DIR = Path("outputs") / "codex-skill-batch"
VALID_MODES = ("independent", "resume-last")


@dataclass(frozen=True)
class BatchTask:
    id: str
    payload_text: str


def load_tasks(path: Path) -> list[BatchTask]:
    """Load tasks from JSONL or JSON.

    JSONL accepts one JSON value per line. JSON accepts either a list or an
    object with a "tasks" list. Dict tasks should include "input"; "id" is
    optional and falls back to the 1-based position.
    """
    if path.suffix.lower() == ".json":
        raw = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(raw, dict) and "tasks" in raw:
            raw = raw["tasks"]
        if not isinstance(raw, list):
            raise ValueError(f"{path} must contain a list or an object with a tasks list")
        return [_coerce_task(item, index) for index, item in enumerate(raw, start=1)]

    tasks: list[BatchTask] = []
    for index, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        stripped = line.strip()
        if not stripped:
            continue
        try:
            raw_item = json.loads(stripped)
        except json.JSONDecodeError as error:
            raise ValueError(f"{path}:{index} is not valid JSONL: {error}") from error
        tasks.append(_coerce_task(raw_item, len(tasks) + 1))
    return tasks


def render_prompt(skill_name: str, task: BatchTask, output_path: Path, work_dir: Path) -> str:
    return f"""Use the skill/workflow named "{skill_name}" to process exactly one batch input.

Rules:
- Only process this one task. Do not inspect, solve, summarize, or pre-process any other batch task.
- Treat the task id as the stable identity for this run.
- Write the main result to: {output_path}
- Put temporary or supporting files for this task under: {work_dir}
- If the skill has its own output convention, follow it, but still leave the final artifact or a short pointer at the result path above.
- When finished, the final response should include only the task id, status, output path, and blockers.

Task id: {task.id}

Input:
{task.payload_text}
"""


def build_codex_command(
    *,
    codex_bin: str,
    mode: str,
    root: Path,
    sandbox: str,
    final_message_path: Path,
    model: str | None,
) -> list[str]:
    if mode == "independent":
        command = [
            codex_bin,
            "exec",
            "-C",
            str(root),
            "-s",
            sandbox,
        ]
        if model:
            command.extend(["-m", model])
        command.extend(["-o", str(final_message_path), "-"])
        return command

    if mode == "resume-last":
        command = [
            codex_bin,
            "exec",
            "resume",
            "--last",
        ]
        if model:
            command.extend(["-m", model])
        command.extend(["-o", str(final_message_path), "-"])
        return command

    raise ValueError(f"Unsupported mode: {mode}")


def run_batch(args: argparse.Namespace) -> int:
    root = args.root.resolve()
    tasks_path = args.tasks.resolve()
    out_dir = (root / args.out_dir).resolve() if not args.out_dir.is_absolute() else args.out_dir.resolve()
    logs_dir = out_dir / "_logs"

    out_dir.mkdir(parents=True, exist_ok=True)
    logs_dir.mkdir(parents=True, exist_ok=True)

    tasks = load_tasks(tasks_path)
    if not tasks:
        print(f"No tasks found in {tasks_path}", file=sys.stderr)
        return 1

    codex_bin = resolve_codex_bin(args.codex_bin)
    print(f"Loaded {len(tasks)} task(s) from {tasks_path}")
    print(f"Mode: {args.mode}")
    print(f"Output directory: {out_dir}")
    print(f"Codex binary: {codex_bin}")

    failures: list[str] = []
    for index, task in enumerate(tasks, start=1):
        safe_id = safe_file_stem(task.id)
        result_path = out_dir / f"{safe_id}.md"
        work_dir = out_dir / f"{safe_id}.work"
        final_message_path = logs_dir / f"{safe_id}.final.txt"
        stdout_path = logs_dir / f"{safe_id}.stdout.log"
        stderr_path = logs_dir / f"{safe_id}.stderr.log"
        prompt_path = logs_dir / f"{safe_id}.prompt.txt"
        work_dir.mkdir(parents=True, exist_ok=True)

        prompt = render_prompt(args.skill, task, result_path, work_dir)
        if args.extra_instructions:
            prompt = f"{prompt}\nAdditional instructions:\n{args.extra_instructions}\n"
        prompt_path.write_text(prompt, encoding="utf-8")

        command = build_codex_command(
            codex_bin=codex_bin,
            mode=args.mode,
            root=root,
            sandbox=args.sandbox,
            final_message_path=final_message_path,
            model=args.model,
        )

        print(f"[{index}/{len(tasks)}] Running task {task.id}")
        if args.dry_run:
            print(f"[{index}/{len(tasks)}] Dry run: {' '.join(command)}")
            continue

        completed = subprocess.run(
            command,
            input=prompt,
            text=True,
            cwd=root,
            capture_output=True,
            encoding="utf-8",
            errors="replace",
            check=False,
        )
        stdout_path.write_text(completed.stdout, encoding="utf-8")
        stderr_path.write_text(completed.stderr, encoding="utf-8")

        if completed.returncode == 0:
            print(f"[{index}/{len(tasks)}] Done: {task.id} -> {result_path}")
            continue

        failures.append(task.id)
        print(f"[{index}/{len(tasks)}] Failed: {task.id} (exit {completed.returncode})", file=sys.stderr)
        print(f"  stdout: {stdout_path}", file=sys.stderr)
        print(f"  stderr: {stderr_path}", file=sys.stderr)
        if not args.continue_on_error:
            return completed.returncode

    if failures:
        print(f"Failed task(s): {', '.join(failures)}", file=sys.stderr)
        return 1

    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run Codex over a JSONL/JSON task list, strictly one task after another.",
    )
    parser.add_argument("--tasks", required=True, type=Path, help="Path to a .jsonl or .json task list")
    parser.add_argument("--skill", required=True, help="Skill or workflow name to invoke in each Codex run")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="Workspace root passed to codex exec")
    parser.add_argument("--out-dir", type=Path, default=DEFAULT_OUT_DIR, help="Directory for results and logs")
    parser.add_argument("--codex-bin", default="codex", help="Codex executable, e.g. codex or codex.cmd")
    parser.add_argument("--mode", choices=VALID_MODES, default="independent", help="Run style")
    parser.add_argument("--sandbox", default="workspace-write", help="Sandbox mode for independent codex exec runs")
    parser.add_argument("--model", default=None, help="Optional model override passed to Codex")
    parser.add_argument("--extra-instructions", default="", help="Extra text appended to every per-task prompt")
    parser.add_argument("--continue-on-error", action="store_true", help="Continue with later tasks after a failure")
    parser.add_argument("--dry-run", action="store_true", help="Write prompts and print commands without running Codex")
    return parser


def resolve_codex_bin(codex_bin: str) -> str:
    if os.path.dirname(codex_bin):
        return codex_bin
    found = shutil.which(codex_bin)
    if found:
        return found
    if os.name == "nt" and not codex_bin.lower().endswith(".cmd"):
        found = shutil.which(f"{codex_bin}.cmd")
        if found:
            return found
    return codex_bin


def safe_file_stem(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", value).strip("._-")
    return cleaned or "task"


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return run_batch(args)


def _coerce_task(raw_item: object, index: int) -> BatchTask:
    task_id = f"{index:03d}"
    payload: object

    if isinstance(raw_item, dict):
        if "id" in raw_item:
            task_id = str(raw_item["id"])
        if "input" not in raw_item:
            raise ValueError(f"Task {task_id} must include an input field")
        payload = raw_item["input"]
    else:
        payload = raw_item

    return BatchTask(id=task_id, payload_text=_payload_to_text(payload))


def _payload_to_text(payload: object) -> str:
    if isinstance(payload, str):
        return payload
    return json.dumps(payload, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    raise SystemExit(main())
