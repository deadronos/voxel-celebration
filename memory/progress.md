# Progress — Voxel New Years Celebration

**What works (current state):**

- The site ships a voxel rocket favicon (`public/favicon.svg` + PNG fallbacks + `site.webmanifest`); the previously dangling `/vite.svg` reference that 404'd on the deployed Pages site is gone, and `tests/vitest/indexHtmlAssets.test.ts` guards asset references in `index.html` and the manifest.
- Dependencies refreshed to their 2026-10-17 latest (TASK015): Vitest 5.0.5, three 0.186.1, fiber 9.8.2, drei 10.7.9, postprocessing 3.2.0, react 19.3.1, vite 8.3.4, jsdom 30.1.3, prettier 3.9.10, playwright 1.64.1. The runtime baseline is now Node 24 LTS (`engines.node >=24.15.0`, CI + deploy on Node 24, `@types/node` ^24). `npm audit` reports 0 vulnerabilities, `npm ci` reproduces the tree, and the full validation suite plus a real-browser smoke test pass with no source changes required.
- Fireworks explosions (and trails) now render correctly in Safari/WebKit
  through the post-processing pipeline. The particle system was moved from a
  GPU `ShaderMaterial` to a CPU-simulated instanced mesh
  (`MeshBasicMaterial` + `instanceMatrix`/`instanceColor`) that packs only live
  particles into each draw (`mesh.count`), which also cuts the particle draw
  from 8000 instances to the handful that are alive. Verified with Playwright
  WebKit + Chromium; test/lint/typecheck/format all pass.
- Review follow-ups merged: soft shadows via VSM under three 0.185, dead patch-package/stats-gl override removed, `engines` documented, inert CDN import map removed.
- ESLint is held on 9.39.5 and TypeScript on 6.0.3 (latest supported by the current plugin ecosystem); revisit once `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, and `@typescript-eslint` support ESLint 10 / TypeScript 7.
- Project builds and runs locally (`npm install`, `npm run dev`).
- Scene is implemented with core components: `House`, `FireworksManager`, `SkyLantern`, and `Environment` (see `src/`).
- Static voxel scenery uses instanced meshes with shared geometry/material caching to reduce draw calls.
- Fireworks particle simulation uses packed typed buffers (SoA) and updates instanced buffers directly to keep the per-frame loop lean.
- The 3D scene is code-split and lazy-loaded to improve initial page render time.
- Scene hydration is staged (first-paint ground/sky, then world, atmosphere, lanterns, fireworks, postprocessing) with idle prefetching to keep startup smooth.
- WebGL context loss handling and a lower initial DPR help reduce GPU pressure during load.
- Ice lake reflections use a tuned reflector resolution (scaled by DPR) to reduce GPU cost.
- Basic unit tests exist (Vitest) — `tests/vitest/constants.test.ts` verifies shared constants.
- SceneCanvas coverage now exercises idle scheduling, context loss overlay behavior, and rocket add/remove flows.
- Linting and formatting scripts are present (`eslint`, `prettier`).
- Tailwind CSS is configured locally via the Tailwind v4 Vite plugin, using the `@import "tailwindcss";` entrypoint in `src/index.css`.
- Direct dependencies and the `package-lock.json` have been refreshed to the latest compatible versions currently supported by the repo's toolchain, and `npm run test`, `npm run lint`, and `npm run typecheck` pass on that updated stack.
- TDD adoption kickstarted: design doc + task plan added, plus a working Red → Green → Refactor pilot on `DynamicResScaler`.

**What's left to build / next priorities:**

1. **Test coverage**: Added unit tests for explosion particle generator and rocket step logic; extend to integration tests (see `memory/tasks/TASK002-add-fireworks-tests.md`).
2. **Design docs**: Fireworks design doc created at `memory/designs/fireworks.md` (see `memory/tasks/TASK003-fireworks-design.md` if further work is needed).
3. **CI**: A minimal CI workflow was added at `.github/workflows/ci.yml` (runs on PRs and pushes to `main`) to execute `lint`, `format:check`, `typecheck`, and `test`. Follow-up: consider adding visual smoke tests and pipeline caching improvements.
4. **Performance tests / baselines**: Add a light performance checklist and guidance for profiling R3F scenes.
5. **Developer docs**: Expand CONTRIBUTING.md or add short onboarding notes about local debugging and test runs.

**Known issues / constraints:**

- `THREE.Clock` deprecation warning remains, emitted by `@react-three/fiber` internals (still present in 9.8.2); non-fatal and will resolve when fiber migrates to `THREE.Timer`.
- Visual tests are not present—visual regression would be a future improvement.
- Some rendering behavior (particles) may be non-deterministic which makes snapshot testing more difficult; write deterministic helpers where possible.
- `npm audit` is clean after the 2026-10-17 pass (`npm audit fix` cleared `@humanfs/node`, `brace-expansion`, and `fflate` advisories).

**Overall status:** _Active_ — core demo working, documentation being backfilled, tests to expand.

## Retrospective — 2025-12-28 (TDD Pilot)

- What went well: adding failing tests first made the `DynamicResScaler` change straightforward, and extracting DPR math into a pure helper improved testability without changing behavior.
- What to improve: follow-ups should add a PR checklist + optional CI warning to make test-first habits consistent for all contributors.
- Next: keep using the Red → Green → Refactor pattern for the next small feature/bugfix to build team muscle memory.

---

_Update this file as progress is made and tasks are completed._
