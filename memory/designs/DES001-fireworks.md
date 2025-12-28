# DES001: Fireworks Design — Presets & Performance

## Goals

- Provide a small set of explosion presets that balance visual variety and runtime performance.
- Keep presets as data/config so they are easy to tune and test.

## Preset fields (recommended)

- `name` (string)
- `particleCount` (number)
- `spread` (number) — explosion spread radius
- `speed` (number) — initial velocity multiplier
- `colors` (array) — colors used for this explosion
- `lifetime` (seconds) — how long particles persist
- `trail` (boolean) — whether particles leave a trail (costly)

## Current implementation

- The code exposes a pure helper `createExplosionParticles(position, color, opts?)` in `src/utils/fireworks.ts`. It generates `count` particles (default: `Math.floor(50 + rand() * 50)`) and accepts an optional `random` function and `out`/`pool` arrays for pooling.
- The runtime path in `FireworksManager` uses typed-buffer simulation (SoA) and fills explosions via `writeExplosionParticles(...)` to avoid per-explosion allocations while keeping tests and preset work ergonomic.
- There is no preset configuration file yet; see TASK006 for the planned preset config + tests.

## Performance guidance

- Default demo should stay around 60 FPS on modern desktop hardware.
- Keep `particleCount` moderate (e.g., 50–200 per explosion) for default presets.
- Consider instancing or GPU particle approaches for more complex effects.

## Acceptance

- Presets are stored in a simple JS/TS config file and consumed by `FireworksManager`.
- Tests exist to ensure presets produce expected particle counts and lifetimes.

## Next steps

- Add a `src/config/fireworksPresets.ts` to define named presets (e.g., `small`, `default`, `grand`) with explicit `particleCount`, `colors`, and other fields. Use those presets in `FireworksManager` and expose them via props or a scene control.
- Add unit tests to validate preset outputs (counts, lifetimes) and ensure the `createExplosionParticles` helper respects count overrides.

---

_This is a living doc — expand with concrete parameter ranges and measured baselines when profiling data is captured._
