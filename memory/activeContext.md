# Active Context — Voxel New Years Celebration

## Current focus

- Performance pass: introduce instanced voxel rendering + caching and particle pooling to reduce draw calls and per-frame allocations.
- Backfilling the repository Memory Bank with core documentation files (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`, and `tasks/` entries). This work documents project intent and developer conventions so contributors can onboard quickly.

## Recent changes

- Core scene components are present in `src/` including `House`, `FireworksManager`, `SkyLantern`, and `Environment` (see `src/` for component implementations).
- Project uses TypeScript, Vite, R3F, and Vitest.
- Static voxel scenery now uses instanced meshes with shared geometry/material caching, and fireworks particles use pooling to avoid churn.
- Tailwind CSS is on v4 and now wired through the Vite plugin, using the v4 `@import "tailwindcss";` entrypoint in `src/index.css`.

## Next steps & immediate tasks

- Complete Memory Bank files and create `memory/tasks/TASK001-backfill-memory-bank.md` to track this work (in progress).
- Add a `memory/designs/` placeholder and capture any design decisions for the fireworks system.
- Added targeted unit tests for particle generator and rocket step logic; next: consider integration tests for the full `FireworksManager` rendering lifecycle.
- A minimal CI workflow was added at `.github/workflows/ci.yml` to run `lint`, `format:check`, `typecheck`, and `test` on PRs/pushes to `main`.

## Decisions & rationale

- Keep logic that affects behavior outside of rendering code so it’s easier to unit test and reason about (e.g., rocket lifecycle helpers and configuration objects).
- Prioritize small, testable increments for new features (e.g., new particle presets are configuration-driven).

## Open questions

- Should we add automated visual regression or smoke tests for the default scene preview? (low-priority, add as follow-up task)

---

*Update this file to reflect current work and immediate next actions.*
