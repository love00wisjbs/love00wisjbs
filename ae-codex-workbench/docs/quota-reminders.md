# ChatGPT / Codex 五小时额度提醒

**当前没有设置提醒，没有读取你的额度，刷新时间未知。** 不把当前时间加五小时当成刷新时间。五小时窗口和每周窗口可能同时约束；五小时刷新不保证每周额度允许继续使用。

## 推荐现成 Windows 工具

[OpenTokenUsage](https://github.com/poweruserz/OpenTokenUsage) 是 Windows 11 托盘应用，README 明确支持限额重置时通知、声音及中文。它不是 ChatGPT 手机插件，也没有在本任务安装。相比另写一个额度接口插件，先复用并验收更合适。

**源码限制：不是每次刷新必提醒。** 本次读取 `src/lib/usage-alerts.ts`，其 `RESET_MIN_FRACTION = 0.8`；重置通知要求上次已使用至少 80%，并且新 reset 时间比旧值晚超过一小时、尚未通知过。对应测试明确轻度使用的窗口不报重置。适合“接近用尽后刷新提醒”，如果要所有窗口刷新都提醒，需后续配置支持或有测试的小范围改动；不能只凭 README 宣称完全满足。

证据：[重置逻辑](https://github.com/poweruserz/OpenTokenUsage/blob/main/src/lib/usage-alerts.ts)、[重置测试](https://github.com/poweruserz/OpenTokenUsage/blob/main/src/lib/usage-alerts.test.ts)。本次仅审阅，未运行上游完整测试。普通窗口重置与 banked reset credits 到期提醒是两种功能，不能混淆。

Windows 可先打开项目 releases 核实版本，按官方说明安装；README 提供的命令为：
```powershell
winget install PowerUserZ.OpenTokenUsage
```

在自己的 Windows 本地登录 Codex，启用该账户与使用量/重置通知，确认 Windows 系统通知权限及勿扰状态，保持应用运行。等待一次真实刷新，记录收到通知时刻、显示的 reset 与账户使用页是否一致。没有验证前不称“已经能提醒”。电脑关机不工作；轮询间隔、网络与睡眠可能使通知延迟。

已读 [Codex provider 文档](https://github.com/poweruserz/OpenTokenUsage/blob/main/docs/providers/codex.md)：使用逆向、未公开的 ChatGPT usage 接口，可能随时变化；读取本地 Codex OAuth，会刷新并保存到所选账户自己的 auth.json。不得把登录凭据发到 GitHub/聊天/手机中转服务。Windows keyring-only 登录兼容性需要本机检查，文档所列 keychain fallback 仅 macOS。API key 余额和 ChatGPT/Codex 订阅额度不是一回事。

[Codex Usage Monitor](https://github.com/upstream-ray/codex-usage-monitor) 支持 Windows 10/11、5h/7d、倒计时及低额度通知；本次 README 未承诺重置后通知。因此是倒计时/Windows 10 候选，不将低额度报警当成刷新提醒。

## 手机到达方案

已知真实刷新时间时，可以另设一次性手机系统提醒或手机能收到的日历提醒，并标为“预计刷新，请核对额度”。需要确切日期时间和时区；现在缺少这些信息，所以不创建空猜的日程。当前时间不能代替账户数据。

自动检测再推送手机需要常在线的可信设备或云调度，以及明确选定的通知渠道与授权；手机后台浏览器定时器不是可靠方案。本包不公开本机 HTTP API，也不把 OAuth 放到云端。OpenTokenUsage 的 loopback API 只供本机，不能直接当手机推送服务。

自建的必要条件：先证明现成工具不能满足；用新鲜 provider 数据识别旧 reset 已过与新窗口，不凭计时器宣称恢复；账户/窗口级去重，错误和过期数据不通知恢复，睡眠与重启后重新核对。若剩余每周窗口仍耗尽，准确说明局部刷新。
