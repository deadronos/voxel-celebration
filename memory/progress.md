# Progress — Voxel New Years Celebration

**What works (current state):**

- Project builds and runs locally (`npm install`, `npm run dev`).
- Scene is implemented with core components: `House`, `FireworksManager`, `SkyLantern`, and `Environment` (see `src/`).
- Static voxel scenery uses instanced meshes with shared geometry/material caching to reduce draw calls.
- Fireworks particles reuse objects via pooling and avoid per-frame allocation in the update loop.
- The 3D scene is code-split and lazy-loaded to improve initial page render time.
- Scene hydration is staged (first-paint ground/sky, then world, atmosphere, lanterns, fireworks, postprocessing) with idle prefetching to keep startup smooth.
- WebGL context loss handling and a lower initial DPR help reduce GPU pressure during load.
- Basic unit tests exist (Vitest) — `tests/vitest/constants.test.ts` verifies shared constants.
- SceneCanvas coverage now exercises idle scheduling, context loss overlay behavior, and rocket add/remove flows.
- Linting and formatting scripts are present (`eslint`, `prettier`).
- Tailwind CSS is configured locally via the Tailwind v4 Vite plugin, using the `@import "tailwindcss";` entrypoint in `src/index.css`.
- TDD adoption kickstarted: design doc + task plan added, plus a working Red → Green → Refactor pilot on `DynamicResScaler`.

**What's left to build / next priorities:**

1. **Test coverage**: Added unit tests for explosion particle generator and rocket step logic; extend to integration tests (see `memory/tasks/TASK002-add-fireworks-tests.md`).
2. **Design docs**: Fireworks design doc created at `memory/designs/fireworks.md` (see `memory/tasks/TASK003-fireworks-design.md` if further work is needed).
3. **CI**: A minimal CI workflow was added at `.github/workflows/ci.yml` (runs on PRs and pushes to `main`) to execute `lint`, `format:check`, `typecheck`, and `test`. Follow-up: consider adding visual smoke tests and pipeline caching improvements.
4. **Performance tests / baselines**: Add a light performance checklist and guidance for profiling R3F scenes.
5. **Developer docs**: Expand CONTRIBUTING.md or add short onboarding notes about local debugging and test runs.

**Known issues / constraints:**

- `npm run lint` currently fails due to `@ts-ignore` and unsafe access warnings in `src/components/AuroraSky.tsx`.
- Visual tests are not present—visual regression would be a future improvement.
- Some rendering behavior (particles) may be non-deterministic which makes snapshot testing more difficult; write deterministic helpers where possible.

**Overall status:** _Active_ — core demo working, documentation being backfilled, tests to expand.

## Retrospective — 2025-12-28 (TDD Pilot)

- What went well: adding failing tests first made the `DynamicResScaler` change straightforward, and extracting DPR math into a pure helper improved testability without changing behavior.
- What to improve: follow-ups should add a PR checklist + optional CI warning to make test-first habits consistent for all contributors.
- Next: keep using the Red → Green → Refactor pattern for the next small feature/bugfix to build team muscle memory.

---

_Update this file as progress is made and tasks are completed._
