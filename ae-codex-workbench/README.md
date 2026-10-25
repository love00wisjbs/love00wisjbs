# AE + Codex portable workbench

手机准备、GitHub 保存、Windows 执行。已包含可复用 AE skill、关键帧纠错、一个 JSX 示例和接续说明。**保存不等于已安装，逻辑测试不等于 AE 实机验证。**

- [技能入口](skills/after-effects-windows/SKILL.md)
- [Windows 接续与验收](docs/windows-handoff.md)
- [Codex 额度刷新提醒方案](docs/quota-reminders.md)
- [当前验证与待办](docs/verification.md)
- [关键帧规则纠错](skills/after-effects-windows/references/keyframes.md)
- [自有 skill 清单与精简记录](docs/skills-catalog.md)
- [管理与优化工具比较](docs/skills-management.md)
- [只读技能检查工具与能力维护](docs/capability-maintenance.md)

下一次可直接说：
> 阅读 love00wisjbs/love00wisjbs 仓库 ae-codex-workbench/README.md 和 docs/verification.md，接着做 Windows AE 验收。不要假设已经安装或运行。

本地验证：`node --test --test-isolation=none`（Node 22+；不安装依赖）。这里的 ES3 helper 由 Node VM 加载，测试隔离选项用于兼容当前云执行环境。

盘点与引用检查：`node tools/audit-skills.cjs .`。只读所选目录，输出 JSON，不安装或修改 skill。

原始文件采用 [MIT](LICENSE)。第三方仓库仅链接，遵守各自许可证。首轮调研笔记 research-2026-10-25.md 在 GitHub 同目录保留。
