# AI 视频生成 skills 与插件审查库

用于存放经过静态审查的 AI 视频 skills、插件候选和版本记录。说明为中文，第三方 skill 保留原文。

本目录收录静态审查通过的原版 skills，以及未通过或待进一步审查的插件候选记录。

## 内容

- [审查报告](docs/AUDIT-2026-11-04.md)：5 个开源候选及限制。
- [来源锁定清单](sources.lock.json)：上游提交、文件来源和校验值。
- [Runway 原版 skills](vendor/runway/skills/)：7 个 skills，按需选用。
- [Runway MIT 许可证](vendor/runway/LICENSE)：随复制文件保留。
- [MCP 配置示例](examples/runway-dev.mcp.json)：只有官方 HTTPS 地址，无密钥。

## 使用

只收集本仓库不会安装或连接任何服务。基础视频接口通常只需 `runway-dev`、`runway-dev-setup`、`runway-dev-models`，其他 skills 按任务选取。

将选中的 `vendor/runway/skills/<name>` 文件夹复制至宿主文档规定的 skills 目录（兼容宿主常使用 `.agents/skills/` 或 `.claude/skills/`）。同时保留 `vendor/runway/LICENSE` 及来源记录。不要把全部候选批量启用。

MCP 示例不会自动加载；需要连接 Dev MCP 时，按 [Runway 官方 MCP 文档](https://docs.dev.runwayml.com/guides/mcp/) 配置宿主，并自行完成 OAuth。应用 API 密钥仅放服务端的环境变量/秘密管理器，不能提交仓库。

**这些 skills 不附赠算力或 API 免费额度。** 当前没有执行安装、生成或付费实测。有关静态审查范围和未审依赖，见报告。

## 仓库位置

当前存放于 [love00wisjbs/love00wisjbs](https://github.com/love00wisjbs/love00wisjbs/tree/main/ai-video-skills-plugins) 的独立目录。以后可以整体迁移到专用仓库，内部相对链接与来源记录无需改动。

## 更新原则

第三方内容固定到提交 SHA。更新前重新审查差异，核对许可证及脚本、权限、费用变化，再更新来源锁定文件。上游 README 或远程文档变化不会自动获得本次通过结论。

