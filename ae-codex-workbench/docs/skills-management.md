# Skill 管理与优化工具

核查日期：2026-10-25。已读下列项目 README、相关说明与仓库元数据；未安装软件、未连接备份账号、未更改其他客户端配置。星标用于筛选，不代表安全或质量认证。

## 推荐搭配

|用途|项目与本次观察|结论|
|---|---|---|
|Windows 图形管理|[Skills Manager](https://github.com/xingkongliang/skills-manager)：6,822 stars，MIT，最近推送2026-10-21；已核实正式版 v1.43.0 有 Windows x64 EXE/MSI 和独立 CLI|优先候选：统一技能库、标签、预设、来源追踪、按客户端部署、备份与多设备同步。不是内容自动精简器，也不是 ChatGPT 手机插件。|
|轻量安装与更新|[Vercel skills](https://github.com/vercel-labs/skills)：36,503 stars，MIT，最近推送2026-10-19；当前 README 要求 Node≥22.20|CLI 可找、装、列出、查更新和更新技能，支持 Codex。不负责判断删减后是否仍正确。|
|内容与触发优化|[Anthropic skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)：官方技能集内，已读 SKILL.md|最贴近“优化 skill”：测试任务、旧新对照、评估输出、精简、描述触发优化。部分自动评估/描述优化脚本依赖 Claude CLI；不能当成无需账号的 Codex 优化插件。安装前看该子目录许可证。|
|格式参考检查|[Agent Skills skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref)：标准仓库内，Apache-2.0|validate / read-properties / to-prompt。README 明说仅作演示、不是生产工具；检查格式不证明效果、安全或 AE API 正确。|
|跨客户端加载备选|[OpenSkills](https://github.com/numman-ali/openskills)：10,811 stars，最近推送2026-01-18；README 标 Apache-2.0，但 GitHub license 元数据为 NOASSERTION|用 AGENTS.md 索引加载技能；当前已有原生技能支持时不必再加一层。会修改索引，默认路径与 Codex 不同。|

管理软件与优化评估是不同能力。推荐 Windows 上选 Skills Manager 或 Vercel CLI 其中一种负责部署，GitHub 保留源文件，评估后再合并内容修改。不要让两个管理器同时写同一部署目录。

## Windows 接续

### 图形界面：Skills Manager

1. 打开 [v1.43.0 release](https://github.com/xingkongliang/skills-manager/releases/tag/v1.43.0)，核对设备架构，选择官方 EXE/MSI；本任务未运行安装器。
2. 首先导入本仓库内 `ae-codex-workbench/skills/after-effects-windows` 本地文件夹；从 central library 明确部署到 Codex，确认客户端发现技能。导入和部署是两步。
3. 初始使用 copy 模式；先只管理该技能，避免迁移整个现有库。应用还提供 `manage-skills` 技能和 CLI 供 agent 调用，但需要本机安装、路径及可用性核实。
4. GitHub 自动备份是额外授权：README 说 device-flow 登录会创建私有备份仓库，并自动提交推送。你当前只授权了现有仓库工作，本任务没有开启此功能；采用前先说明授权范围与自动行为。
5. 源码仍以本仓库为准，先审阅 diff 再更新。其 manage-skills 文档说明 update 会整体替换技能目录：新版本同路径文件可能覆盖本地修改；多余文件移除有单独拦截，但不保护同路径编辑。不要在受管理副本里存唯一的修改。

### 命令行：Vercel skills

以下仅为经文档核对的操作说明，未在本任务执行。先下载本仓库，进入 `ae-codex-workbench`，确认 Node≥22.20 与 Git 可用，然后：

```powershell
# 可选：不发送 CLI 匿名遥测（该设置也禁用其安全审计请求）
$env:DISABLE_TELEMETRY = '1'

# 把本地这一项技能复制到当前项目的 Codex 技能目录
npx skills add .\skills\after-effects-windows --agent codex --copy
npx skills list --agent codex

# 只查看来源跟踪技能的可用更新，不应用更新
npx skills check
```

命令会通过 npm 获取并执行工具；安装依赖先核对版本，不把 npx 当成纯读取。需要全局安装时再明确增加 `--global`。本地来源未必具有远程更新追踪；这次本地导入应手动从 GitHub 审阅并同步。Windows symlink 可能受 Developer Mode 限制，`--copy` 避免将其作为前提。

`skills check` 不等于内容检查。`skills update` 会写入技能，只在保存个人修改并审阅来源后使用；本任务没有执行 update/remove。检查和更新时只使用所选管理器，避免来源元数据互相冲突。

## 手机与 ChatGPT

手机继续用 GitHub 阅读与审阅；上述桌面软件不在手机后台运行。插件目录搜索返回的相关已安装插件为 Superpowers 和 Plugin Creator，没有找到可确认适用的独立 skill 管理插件；目录结果并不穷尽，不声称不存在。它们已有写 skill/检查流程，但不等于 Windows 技能库管理器。

GitHub 发布的 Claude Code 插件不能直接当 ChatGPT 插件安装；静态 Agent Skills、CLI、桌面应用和 MCP 是不同接入方式。本次没有推荐或安装无关插件。

## 精简维护流程

1. 盘点：记录自有 skill 的路径、用途、来源、字数和部署位置；第三方包保留上游。
2. 确定缺口：重复解释移到 reference；主 SKILL 留触发条件、最短步骤、必要约束和按需链接。没有缺口不扩写。
3. 留旧版本：Git commit 可回退；不靠把旧新两份都装到客户端保存历史。
4. 验证：同一组实际场景比较旧新答案，运行相关代码测试、检查链接。字数减少只能证明文件缩短，不能声称模型额度或效果按比例改善。
5. 部署：GitHub 是来源，Windows 是执行端。审阅后更新指定技能；记录哪些仅生成、哪些本地测试过、哪些实机通过。

对本次盘点和精简结果，见 [skill 清单](skills-catalog.md)。若以后连接更多存有自有技能的仓库，先盘点再沿用同一流程。
