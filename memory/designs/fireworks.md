# Fireworks Design — Presets & Performance

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

## Performance guidance

- Default demo should stay around 60 FPS on modern desktop hardware.
- Keep `particleCount` moderate (e.g., 50–200 per explosion) for default presets.
- Consider instancing or GPU particle approaches for more complex effects.

## Acceptance

- Presets are stored in a simple JS/TS config file and consumed by `FireworksManager`.
- Tests exist to ensure presets produce expected particle counts and lifetimes.

---

*This is a living doc — expand with concrete parameter ranges and measured baselines when profiling data is captured.*