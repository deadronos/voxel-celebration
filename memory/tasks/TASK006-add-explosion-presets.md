# [TASK006] - Add explosion presets config and tests

**Status:** Pending  
**Added:** 2025-12-27

## Goal

Add a small set of named explosion presets and tests so `FireworksManager` can offer deterministic, testable visual variants.

## Acceptance criteria

- `src/config/fireworksPresets.ts` exists with at least three presets (`small`, `default`, `grand`) that specify `particleCount`, `colors`, and sensible defaults for `spread`/`speed`/`lifetime`.
- Unit tests validate that presets produce expected counts and that `createExplosionParticles` respects a `count` override when used with preset values.
- Memory/designs/fireworks.md is updated to reference the presets and integration plan.

## Implementation plan

1. Add `src/config/fireworksPresets.ts` with named presets and typed interface.
2. Add unit tests `tests/vitest/presets.test.ts` that use `createExplosionParticles` with preset values to validate particle counts and basic ranges.
3. Add a follow-up task to integrate presets into `FireworksManager` and expose a control or prop to select presets in the scene.

---

_This task is intended to be small and test-first: add the presets and tests first, then integrate into the scene in a follow-up change._
