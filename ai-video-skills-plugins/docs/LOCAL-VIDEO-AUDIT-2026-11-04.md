# 本地视频制作 skills 补充审查

日期：2026-11-04。范围扩展至 AI 辅助编程动画、分镜、剪辑和后期，不限云端文生视频。以下是静态审查结论，不能替代运行时隔离或完整依赖审计。

## 本次收录

### Manim Composer：讲解视频分镜

上游：[adithya-s-k/manim_skill](https://github.com/adithya-s-k/manim_skill/tree/cef045011722d285692e3381d12d4d637da56e18)，MIT。

逐份阅读并原样收录 manim-composer 的 SKILL.md、3 份 references、1 份模板以及根许可证。内容涉及叙事、镜头、节奏和场景规格，没有安装脚本、密钥读取或自动上传步骤。研究阶段会使用网页搜索，因此“无需生成 API”不代表整个工作流离线。

该 skill **只规划分镜，不渲染视频**。实现仍需 ManimCE 或 ManimGL，本次未收录或验证对应 best-practices 技能与整套运行依赖。参考中的 FlashAround、frame.animate.reorient 等接口涉及不同 Manim 版本，不能直接当成 ManimCE 通用可执行代码。用户文件 scenes.md 应按任务选择输出位置，保留已有内容。

### FFmpeg：剪辑与后期

上游：[digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit/tree/a50da9e7e78a162b58a4fb9e1c3a4008e831b8dc)，MIT。

逐份阅读并原样收录 .claude/skills/ffmpeg 下的 SKILL.md、reference.md 及根许可证。用于转码、裁剪、拼接、变速、提取音频和 GIF 输出；本地 FFmpeg/ffprobe 即可，不需要生成 API。未复制整套 Video Toolkit、ElevenLabs 集成或项目 hooks。

有条件作为操作参考收录，存在技术限制：

- 平台大小、时长限制为静态说明，应重新核对；不能把 Twitter/X 等表格当成现行事实。
- 音频变速范围描述不适用于所有 FFmpeg 版本；带音轨的示例也不适用于无音轨源。
- concat demuxer 要求输入流兼容，单纯给 concat 命令添加重编码参数并不能解决所有异构输入；必要时统一输入或使用 concat filter。
- `-safe 0` 仅对自己生成且核对过的列表使用，拒绝不可信路径列表。
- 某些 H.264 level/resolution 组合不合适，具体导出时应重新选择；`-fs` 可能截断输出，不保证完整影片。
- 使用不同的输出文件名，必要时加 `-n`；执行前检查引用路径、磁盘空间，避免覆盖源文件。不能直接执行从字幕或素材元数据拼接出的 shell 命令。

## 继续候选，未复制完整插件

| 项目 | 本次检查 | 结论 |
| --- | --- | --- |
| [Remotion 官方 skills](https://github.com/remotion-dev/skills/tree/c7cb2fdcacd134fb2ccb9b7a44f9ffa44e467271) | 完整文件树、README、package.json、remotion-render、remotion-license，以及官方许可入口 | 很适合 React 动效和图表视频，可本地渲染；本次未确认独立 skills 仓库的复制许可证文本，不擅自按 MIT 复制。Remotion 软件有自身使用条款，不能因为本地运行就承诺任何团队免费。暂保留官方链接。 |
| [Blender 社区 MCP](https://github.com/ahujasid/mcp-for-blender/tree/2e4b0bc294694b1570d76ed01be657c22e6d02a0) | 文件树、telemetry.py 中同意检查及关闭选项 | 非 Blender 基金会官方插件；适合 3D 场景和动画。存在遥测，代码提供 consent 检查及 BLENDER_MCP_DISABLE_TELEMETRY 等关闭变量；未完整审计 100KB server.py、Blender addon 和网络执行面，暂不启用或复制。不能由此断言恶意或无同意上传。 |
| [Yusuke710/manim-skill](https://github.com/Yusuke710/manim-skill/tree/a0048d9e265499038f34a9aa58ff16d306b5034c) | 文件树 | 含 TTS 与本地视频查看器脚本，尚未阅读实现，继续候选，不作通过结论。 |

## 费用与效果边界

本地渲染消耗自己的 CPU/GPU 和存储；驱动 agent 的模型服务仍可能收费。Manim 擅长数学和解释动画，FFmpeg 擅长已有素材处理；它们不等同扩散模型生成写实新画面。没有执行第三方安装器或启用 MCP。

## 本次验证

9 份新增上游文件均与固定提交的 Git blob SHA 一致，并记录 SHA-256。使用本机 FFmpeg 生成 1 秒合成测试片，执行 H.264 缩放压缩至 160×120、保留 AAC 音轨，并单独提取 WAV；ffprobe 确认视频尺寸与音轨。该冒烟测试仅覆盖这两个操作，不证明所有导出示例可执行；Manim 未做渲染实测。
