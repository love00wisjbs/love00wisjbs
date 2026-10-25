# Approved direction and implementation choices

User confirmed Adobe After Effects and ChatGPT/Codex five-hour quota. On 2026-10-25 they selected portable skill first and delegated implementation details without stepwise confirmation.

Intent: phone-accessible, GitHub-persistent skills and evidence that a future Windows session can resume. Produce a portable reference skill and one narrowly scoped JSX example; do not require MCP for first use.

Approaches: macOS-only upstream runner is unsuitable for Windows. Manual AE JSX is the selected initial route, with local 23d1 MCP as optional next step. Nexrender handles template/batch rendering, Lottie handles compatible web/mobile animation exports; neither replaces general AE editing.

Builder choices: original Markdown and ES3 code, MIT for original files, Node built-in tests without dependencies. Example touches exactly one selected nonanimated 2D layer, rejects unsupported state, uses undo groups and avoids external output. Keyframe documentation uses community API references with corrections explicitly sourced. Live AE, UI and notification claims require Windows execution.

Reminder: reuse OpenTokenUsage for Windows 11 reset notifications rather than invent a quota-reading plugin. It uses an undocumented upstream endpoint; reading its code/docs is not runtime validation. No refresh time is known; no reminder scheduled. Phone push needs a known time and phone-capable scheduling channel.
