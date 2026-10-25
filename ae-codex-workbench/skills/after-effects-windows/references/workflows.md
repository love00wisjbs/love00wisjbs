# Workflow routing and provenance

Read on 2026-10-25. References are independently owned; original skill/code in this package is not a copy of their implementations.

## Existing skill

[aedev-tools/adobe-agent-skills](https://github.com/aedev-tools/adobe-agent-skills), Apache-2.0, covers layers, keyframes, expressions, effects, comps, footage, rendering and batch scripts. Read the relevant domain only. Its query→drill-down→action→result pattern is useful. Its README says macOS only; its runner, symlink handling and `/tmp` assumptions must not be presented as working Windows support. Correct its animation advice with keyframes.md. Its undo promises do not guarantee filesystem rollback.

## Local MCP

[23d1/after-effects-mcp](https://github.com/23d1/after-effects-mcp), README states MIT, Node 18+, Windows/macOS. Upstream reports end-to-end tests against AE 26.4 macOS and 26.5 Windows; this session has not reproduced them. Uses macOS DoScriptFile or Windows AfterFX.exe -r; no panel required. `npm run doctor` exercises host discovery, dispatch, result file and frame rendering. Its documented hazards: asynchronous Windows dispatch, concurrent edits, modal dialogs, delayed PNG completion and temporary file locks.

Use a pinned reviewed commit, build locally, doctor, then register stdio MCP with the actual client's supported config. Claude config examples do not prove ChatGPT mobile or Codex configuration compatibility. Confirm tools are available. Serialize calls, use request-specific result paths, inspect rendered image completion and resolve uncertain execution before retries.

[Dakkshin/after-effects-mcp](https://github.com/Dakkshin/after-effects-mcp), MIT, uses an AE bridge panel. It is a distinct project. The inspected bridge falls back to active comp on a failed name lookup; an adapter should reject unresolved names to prevent wrong-target edits. More stars do not remove integration checks.

## Template rendering

[inlife/nexrender](https://github.com/inlife/nexrender) prepares an AEP template, replaces text/footage/data, runs `aerender`, then post-processes and copies/uploads outputs. It needs an AE rendering installation and applicable plugins/fonts on Windows/macOS workers. Do not infer Linux AE rendering from Linux-capable scheduling. Verify Adobe/plugin licensing for the actual deployment rather than repeating broad README claims.

Use stable unique composition/layer names and a manifest of inputs/outputs. Test one job first, configure installed output/settings templates, and retain outputs explicitly: README warns results in temp space may be deleted without postrender actions or skip-cleanup. Order encode→copy/upload, verify output, then cleanup. Separate job retries from in-place interactive edits.

## Web/mobile delivery

[airbnb/lottie-web](https://github.com/airbnb/lottie-web) renders Bodymovin exports of supported AE animation. It is a player/export ecosystem, not a general AE editing skill or a replacement for aerender. Decide Lottie before production when possible; test supported features for chosen web SVG/canvas or native player version. Effects, expressions, 3D, fonts and masks may differ or require conversion; not every AE comp is exportable faithfully.

Compare reference AE frames with target-player output and test actual phone playback, asset loading, loop boundaries, reduced motion and performance. A valid JSON file alone is insufficient acceptance.

## Research upkeep

Before updating a skill: reproduce a concrete failure or identify missing reference coverage; record source and date; change only the relevant section; run focused logic and handoff checks; record what needs AE runtime testing. Never represent a remembered solution as a verified host result.
