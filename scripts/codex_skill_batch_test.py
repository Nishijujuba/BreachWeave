import json
import sys
import unittest
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import codex_skill_batch as batch


class CodexSkillBatchTest(unittest.TestCase):
    def test_load_jsonl_tasks(self) -> None:
        tmp = Path.cwd() / ".cache" / "codex-skill-batch-tests" / uuid.uuid4().hex
        tmp.mkdir(parents=True, exist_ok=True)
        path = tmp / "tasks.jsonl"
        path.write_text(
            "\n".join(
                [
                    json.dumps({"id": "001", "input": "first"}),
                    json.dumps({"id": "002", "input": {"url": "https://example.test"}}),
                ]
            ),
            encoding="utf-8",
        )

        tasks = batch.load_tasks(path)

        self.assertEqual([task.id for task in tasks], ["001", "002"])
        self.assertEqual(tasks[0].payload_text, "first")
        self.assertEqual(tasks[1].payload_text, json.dumps({"url": "https://example.test"}, ensure_ascii=False, indent=2))

    def test_build_independent_command(self) -> None:
        command = batch.build_codex_command(
            codex_bin="codex",
            mode="independent",
            root=Path("D:/repo"),
            sandbox="workspace-write",
            final_message_path=Path("D:/repo/outputs/001.final.txt"),
            model="gpt-5.4",
        )

        self.assertEqual(
            command,
            [
                "codex",
                "exec",
                "-C",
                "D:\\repo",
                "-s",
                "workspace-write",
                "-m",
                "gpt-5.4",
                "-o",
                "D:\\repo\\outputs\\001.final.txt",
                "-",
            ],
        )

    def test_build_resume_last_command(self) -> None:
        command = batch.build_codex_command(
            codex_bin="codex",
            mode="resume-last",
            root=Path("D:/repo"),
            sandbox="workspace-write",
            final_message_path=Path("D:/repo/outputs/001.final.txt"),
            model=None,
        )

        self.assertEqual(
            command,
            [
                "codex",
                "exec",
                "resume",
                "--last",
                "-o",
                "D:\\repo\\outputs\\001.final.txt",
                "-",
            ],
        )

    def test_render_prompt_limits_scope_to_single_task(self) -> None:
        prompt = batch.render_prompt(
            skill_name="example-skill",
            task=batch.BatchTask(id="001", payload_text="payload"),
            output_path=Path("D:/repo/outputs/001.md"),
            work_dir=Path("D:/repo/outputs/001.work"),
        )

        self.assertIn("example-skill", prompt)
        self.assertIn("Task id: 001", prompt)
        self.assertIn("Only process this one task", prompt)
        self.assertIn("D:\\repo\\outputs\\001.md", prompt)
        self.assertIn("payload", prompt)


if __name__ == "__main__":
    unittest.main()
