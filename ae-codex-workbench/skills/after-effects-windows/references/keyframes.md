# Corrected keyframe reference

Evidence inspected 2026-10-25. Community API guide, not Adobe runtime certification:
- [Property API](https://github.com/docsforadobe/after-effects-scripting-guide/blob/master/docs/property/property.md)
- [KeyframeEase](https://github.com/docsforadobe/after-effects-scripting-guide/blob/master/docs/other/keyframeease.md)
- [Upstream rule inspected](https://github.com/aedev-tools/adobe-agent-skills/blob/main/skills/after-effects/rules/keyframes-animation.md)

## Corrections to upstream

|Claim in inspected upstream rule|Correct rule|
|---|---|
|2D/3D Position needs 2/3 ease objects|`TwoD_SPATIAL` / `ThreeD_SPATIAL` take ONE KeyframeEase per incoming/outgoing array. Only nonspatial `TwoD` / `ThreeD` require 2/3.|
|Infer ease count from value array length|Wrong for spatial properties and COLOR. Inspect `propertyValueType`; alternatively read existing `keyInTemporalEase(k).length` on a valid key.|
|Influence is 0–100|Constructor and influence attribute specify 0.1–100 inclusive.|
|setValue silently deletes keys|It throws on a property containing keys. To change a key use setValueAtKey or setValueAtTime. Removing keys is a separate explicit operation.|
|Roving on first/last keys throws|Endpoints cannot rove; attempts are ignored and keyRoving stays false. Nonspatial roving throws.|
|Use 3-coordinate tangents for the 2D slide example|Spatial tangent arrays must match spatial dimension: TwoD_SPATIAL→2, ThreeD_SPATIAL→3.|

The corrections apply to this package; the upstream repository was not modified and no upstream issue was sent.

## Type table

|Type|Temporal ease count|Spatial tangent coordinates|
|---|---:|---:|
|OneD / separated axis|1|Unsupported|
|TwoD|2|Unsupported|
|ThreeD|3|Unsupported|
|TwoD_SPATIAL|1|2|
|ThreeD_SPATIAL|1|3|
|COLOR|1|Unsupported|

Count rules do not imply every value type supports interpolation. Check `canVaryOverTime`, relevant type and `isInterpolationTypeValid()` before attempting animation.

Temporal ease controls speed over time. Spatial tangents control path shape. Deliberately disable spatial auto-Bezier/continuity before setting manual tangents; do not reset a user's path while merely adjusting timing. Separated Position follows individual scalar properties via `getSeparationFollower()`; do not toggle separation to work around an error.

Validate indices as integers 1..numKeys. Do not call nearestKeyIndex on empty animation. Re-query indices after insertion at earlier times; delete keys descending. Copying keyframe values and temporal ease alone is not a lossless copy: account for spatial tangents, continuous/auto-Bezier, roving, selection, interpolation and supported attributes.

Minimal original implementation: [ease-core.js](../scripts/ease-core.js). It validates influence and key index, checks Bezier support and constructs correct temporal arrays. Tests simulate the property contract, not AE itself.
