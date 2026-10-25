---
name: after-effects-windows
description: Use when Adobe After Effects tasks involve JSX or ExtendScript, keyframes, expressions, Windows automation, AE MCP, template rendering, Lottie export, or handoff from phone to desktop.
---

# Portable After Effects

Produce reviewable edits with explicit targets and observable results. Phone/cloud sessions can prepare work; Windows with installed After Effects executes it. Never claim an AE render from a Linux-only check.

## Workflow

1. Establish AE version, composition, selected layers, delivery format, dimensions, fps, duration and assets. Reuse known answers. Inspect only relevant project state. If AE is unavailable, state that and prepare the handoff.
2. Save a project copy before edits. Resolve target comp and layers explicitly; fail on missing or ambiguous targets. An empty selection must not silently mean all layers.
3. Prefer a reviewed existing operation. For JSX use ES3 (`var`, ordinary functions), 1-based layer/item/key indices, matchNames and an IIFE. JSON is not guaranteed; include a reviewed serializer only when needed.
4. Validate scope, property types, keyframes and expression state before mutation. Wrap mutations in `beginUndoGroup` and `endUndoGroup` in `finally`. An undo group is not an atomic transaction or protection for external files. Respect actions already authorized; ask only for unresolved scope or destructive effects.
5. Execute one AE script at a time. Windows `AfterFX.exe -r` may exit before JSX completes. Missing result means unknown execution; inspect AE/dialogs, actual state and receipt before retry. Do not duplicate an uncertain mutation.
6. Read actual results; preview representative frames and full motion. Check missing footage/fonts, expression errors, timing, output settings, color and alpha. Report generated, executed and visually verified separately.
7. Save files and verification status to GitHub. Leave next steps that another session can follow without conversation history.

## Quick reference

|Task|Route|
|---|---|
|Phone preparation / first Windows edit|Manual JSX; see [Windows handoff](https://github.com/love00wisjbs/love00wisjbs/blob/main/ae-codex-workbench/docs/windows-handoff.md)|
|Interactive local AE automation|Optional 23d1 MCP; verify doctor and results locally|
|Template variants / batch video|Nexrender; see [workflow routing](references/workflows.md)|
|Compatible web/mobile animation|Bodymovin/Lottie; verify target renderer|
|Keyframes / easing|Read [corrected rules](references/keyframes.md) first|

## Common mistakes

- Temporal ease arrays follow **propertyValueType**, not `prop.value.length`: TwoD→2, ThreeD→3, all others→1, including spatial Position. Spatial tangents instead use 2/3 coordinates.
- `setValue` on keyed properties throws; use `setValueAtTime` or `setValueAtKey`. Never remove keys implicitly.
- `nearestKeyIndex` is not an exact-time lookup; check `numKeys` then tolerance.
- macOS runner.sh and `/tmp` paths are not Windows integration.
- Existing keys must survive reruns. The bundled [slide example](scripts/slide-selected.jsx) rejects animated inputs and stops on rerun; it is not a general animation replacement tool.

Source provenance and integration limits: [workflows](references/workflows.md). Original code is MIT; referenced upstream code is not bundled. Validation status: [verification](https://github.com/love00wisjbs/love00wisjbs/blob/main/ae-codex-workbench/docs/verification.md).
