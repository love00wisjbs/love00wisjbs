# 自有 skill 清单

核查日期：2026-10-25。范围：当前 /workspace 可见 SKILL.md，及 GitHub 连接可见的 love00wisjbs/love00wisjbs、love00wisjbs/coding-interview-university 默认分支完整目录树（未截断）。没有扫描账号凭据、私人系统目录或不可见历史会话。

|Skill|来源路径|状态|部署|
|---|---|---|---|
|after-effects-windows|[SKILL.md](../skills/after-effects-windows/SKILL.md)|已提炼、纠错、精简|GitHub 保存；没有自动安装到手机或 Windows|

本次找到1个自有技能。coding-interview-university 中没有 SKILL.md；外部插件提供的技能不属于本次原创资料，不批量修改。不能据此声称已优化不可访问的“所有历史技能”。

## 本次精简

- 主入口从433降至264个按空白分隔的词，减少39.0%；UTF-8从3472降至2306字节，减少33.6%。这是文件尺寸比较，未测 tokenizer 或账户额度节省。
- 合并重复的工作流与常见错误说明，缩短路由表；API 细节和工具比较保留在按需 references。
- 保留 AE 主机限制、关键帧纠错、明确目标、空选择拒绝、ES3、索引与 matchName、撤销边界、串行执行、未知结果不重试、视觉验收和接续入口。
- JSX 与 helper 没有改动；全套12项测试继续验证实际代码契约。Windows AE 实机项目仍待执行。
- 旧版保留在 GitHub commit `bd44affeff559d54664d0d02c663c084abe6f506`；回退只需恢复该提交中的 SKILL.md，不需要回退后续其他资料。

## 实施记录

目标：精简现有入口，不改变技能范围或安装软件。步骤：盘点可见资料→保留旧版快照和版本→旧版场景检索→精简→新版同场景检索与代码回归→审阅与提交。工具安装、跨账号自动同步和未知刷新时间提醒均不在本次执行范围。

新旧场景比较及最终核查记录在 [verification.md](verification.md)。

后续创作拓展：技术入口精简后新增一条分镜/动画设计路由，创作细节放入 references/motion-art.md，未把长策划塞回主SKILL。上面的264词为精简当时的记录；当前尺寸由 `node tools/audit-skills.cjs .` 输出为准。
