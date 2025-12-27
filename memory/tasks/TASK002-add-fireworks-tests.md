# [TASK002] - Add unit tests for FireworksManager & rocket lifecycle

**Status:** Completed  
**Added:** 2025-12-27  
**Updated:** 2025-12-27

## Goal

Improve test coverage by adding unit tests for fireworks-related behavior and rocket lifecycle logic so that transient behaviors are deterministic and regression-safe.

## Acceptance criteria

- Tests validate rocket spawn and removal behavior (e.g., `removeRocket` called when rocket lifecycle ends).
- Tests validate particle preset generation (e.g., particle count, lifetime, colors) for one or more presets.
- Tests run in CI and locally with `npm run test`.

## Implementation plan

1. Identify pure logic and helpers used by `FireworksManager` and the rocket lifecycle; extract them into testable units if needed.
2. Add unit tests using Vitest for:
   - Rocket lifecycle (spawn → explode → remove)
   - Particle preset validation (data-driven tests for presets in `memory/designs/fireworks.md`)
3. Add mocks/stubs for time-based code (e.g., fake timers) where needed.
4. Ensure tests are deterministic and quick to run.

---

### Progress Log

- Implemented pure helpers: `createExplosionParticles` and `stepRocketPosition`.
- Added unit tests: `tests/vitest/fireworks.test.ts` and `tests/vitest/rocket.test.ts` and verified they pass locally with `npm run test`.
- Updated `FireworksManager` and `Rocket` to use the pure helpers for testability.

*Follow-ups: Add integration tests to validate `FireworksManager` rendering/instance updates if needed.*
