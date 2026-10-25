---
name: after-effects-windows
description: Use when Adobe After Effects tasks involve storyboards, motion design, JSX, ExtendScript, keyframes, expressions, Windows, AE MCP, Nexrender, Lottie, or phone-to-desktop handoff.
---

# Portable After Effects

Phone/cloud prepares files; installed desktop AE executes them. Report generation, execution and visual verification separately.

## Workflow

1. Reuse known requirements: AE version, target comp/layers, format, dimensions, fps, duration, assets. Query relevant state only.
2. Save a project copy. Reject missing/ambiguous targets; empty selection never means all layers. Validate scope, property types, keys and expressions before writes; preserve existing animation. Respect existing authorization.
3. Prefer reviewed operations. JSX uses ES3 (`var`), matchNames, 1-based indices and an IIFE; JSON needs a serializer. Close `beginUndoGroup` with `endUndoGroup` in `finally`; undo is not a transaction or filesystem rollback.
4. Serialize AE scripts. `AfterFX.exe -r` can exit before completion: missing receipt means unknown execution. Inspect AE/dialogs, results and actual state before retrying.
5. Preview frames and full motion; check footage/fonts, expressions, timing, output settings, color and alpha. Save results and next steps to GitHub.

## Quick reference

|Task|Read / use|
|---|---|
|Storyboards / visual rhythm|Read [creative choices, parallelism and review](references/motion-art.md)|
|Keyframes / easing|Read [corrected API rules](references/keyframes.md) before coding|
|Interactive / batch / web|Read [MCP, Nexrender, Lottie routing and sources](references/workflows.md)|
|First edit|AE menu → Run Script File: [slide example](scripts/slide-selected.jsx); rejects animated inputs and reruns|
|Windows setup|[Handoff](https://github.com/love00wisjbs/love00wisjbs/blob/main/ae-codex-workbench/docs/windows-handoff.md); macOS runner.sh is not Windows support|

## Key traps

- Temporal ease count follows propertyValueType: TwoD→2, ThreeD→3, others→1, including spatial Position. Spatial tangents use 2/3 coordinates.
- Keyed `setValue` throws; use `setValueAtTime`/`setValueAtKey`. Never implicitly delete keys.
- Before `nearestKeyIndex`, check numKeys; verify time tolerance afterward.

Original code: MIT. Runtime limits and pending checks: [verification](https://github.com/love00wisjbs/love00wisjbs/blob/main/ae-codex-workbench/docs/verification.md).
