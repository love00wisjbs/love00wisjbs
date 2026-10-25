# Windows 接续

## 手机现在能做

在 GitHub 浏览本目录、审阅需求和代码、保存来源与进度。手机不运行 AE 桌面应用；云端脚本生成不会修改 Windows 工程。GitHub 文件没有自动安装到本会话，后续会话需要读取或显式加载 skill。

## Windows 获取

通过 GitHub Code → Download ZIP 下载仓库，解压到普通可写目录，例如 Documents\ae-workbench。保留整个 ae-codex-workbench 目录结构；不要只下载单个 JSX，因为它相对 include 同目录 ease-core.js。

或已安装 Git 时：
```powershell
git clone https://github.com/love00wisjbs/love00wisjbs.git
Set-Location .\love00wisjbs\ae-codex-workbench
```

## 可选安装 skill

Codex 等支持 Agent Skills 的客户端可将 `skills/after-effects-windows` 文件夹复制到项目 `.agents/skills/after-effects-windows`，或用户 `$HOME\.agents\skills\after-effects-windows`。保留技能文件夹内的 references 和 scripts；附加接续文档使用 GitHub 链接，不需要把 docs 塞入技能目录。也可在项目中保留本包并显式引用技能入口，避免修改已有用户目录。

重开会话，确认客户端能发现 after-effects-windows。若客户端不支持此目录，使用其官方技能配置；不要把 MCP 配置当成技能安装。

## 第一次运行 JSX

1. 用已安装的 AE 打开测试工程并另存副本，记录 AE 版本、工程路径和当前提交。
2. 建立 1920×1080、30fps、5秒合成，添加普通 2D 文本层。保持无父级、Position/Opacity 无关键帧、无启用的表达式、Position 不分离维度，解锁层。示例拒绝有父级的层，避免父级旋转或缩放改变“水平 200px”的效果。
3. 选中且只选这一层，把时间指示器移到 0 秒。脚本将从当前位置左侧 200px 滑入当前位置，并在一秒内从 0% 淡入 100%；它不会保留原本静态不透明度。
4. File → Scripts → Run Script File，选择 `skills/after-effects-windows/scripts/slide-selected.jsx`。此示例不写外部文件、不需要网络权限；若后续接入需要结果文件的 MCP，再按其说明启用脚本文件权限。
5. 验收：Position 和 Opacity 各两帧；起点左移 200px、终点原位置；路径水平，透明度 0→100；预览一秒运动。再次运行应拒绝并保留关键帧。Ctrl+Z 一次撤销，确认恢复。
6. 分别尝试零选择、多选择、锁定、3D、Position 分离、已有关键帧/表达式、离合成或图层末尾不足一秒，均应无写入地拒绝。

若发生中途异常，undo group 并非事务；Ctrl+Z 后检查状态再重试。测试在工程副本上进行，不处理原始项目或素材。

## 可选自动连接

23d1 MCP 的安装和 `npm run doctor` 见其 README；先在 Windows 本地验证，之后按你实际使用的客户端注册 stdio。`AfterFX.exe -r` 的进程退出不能证明完成。一次只派发一个操作；等待结果文件，查看 AE 对话框和实际图层，未知结果不要直接重跑。

## 接续记录

下一会话记录：GitHub commit、AE/Windows 版本、客户端、项目与素材根目录、已通过的用例、日志/截图/帧路径、剩余项。素材用本地清单映射；不要提交大体积 AEP、私人素材或账号凭据。
