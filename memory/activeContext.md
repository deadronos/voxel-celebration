# Active Context — Voxel New Years Celebration

## Current focus

- Safari/WebKit renders the deployed scene but rocket explosions were
  invisible. Fixed by replacing the GPU-driven custom `ShaderMaterial` particle
  system with a CPU-simulated instanced mesh using `MeshBasicMaterial`
  (`instanceMatrix`/`instanceColor`) and compact draw counts. See
  `memory/tasks/TASK014-safari-fireworks-rendering.md`.
- Review follow-ups from the dependency upgrade: soft shadows restored via VSM (three 0.185 deprecation), dead patch-package config removed, deploy workflow aligned to Node 22, engines field added, vestigial CDN import map removed, `@types/node` aligned with CI runtime. See `memory/tasks/TASK013-address-review-findings.md`.
- Remaining upstream item: `THREE.Clock` deprecation warning from `@react-three/fiber` internals (not fixable in this repo).
- Held versions: ESLint stays on 9.39.5 (latest 9.x) and TypeScript on 6.0.3 (latest 6.x) because the latest `eslint-plugin-react`/`eslint-plugin-jsx-a11y` and `@typescript-eslint` do not yet support ESLint 10 / TypeScript 7.
- Future work: revisit ESLint 10 and TypeScript 7 once plugin ecosystem support lands.

## Recent changes

- `SceneCanvas` now uses VSM (`shadows="variance"`) to keep soft shadows under three 0.185.
- Removed `patch-package`, `patches/three+0.182.0.patch`, and the `stats-gl` override; removed the inert CDN import map from `index.html`.
- Added `engines.node >=22.22.2`; aligned `deploy-pages.yml` to Node 22 and `@types/node` to ^22.
- Upgraded all direct dependencies to latest stable (2026-08-01): `three` 0.185.1, `@react-three/fiber` 9.7.0, `vite` 8.2.0, `vitest` 4.1.10, `jsdom` 30.0.1, `@testing-library/jest-dom` 7.0.0, `prettier` 3.9.6, `eslint` 9.39.5, `typescript` 6.0.3, and others.
- Applied `npm audit fix` (0 vulnerabilities), re-formatted `Snowfall.tsx` for Prettier 3.9.6, and aligned the `index.html` CDN import map with installed versions.
- Completed a real-browser smoke test (canvas + WebGL2 mounted, no console errors).
- Refreshed direct dependencies to the latest compatible versions available in March 2026, including Tailwind v4 tooling, Three.js, Vitest, JSDOM, TypeScript ESLint, and Node type definitions. Vite and `@vitejs/plugin-react` were intentionally held on their current compatible major because the latest Tailwind Vite plugin still peers only through Vite 7.
- Updated the lockfile with `npm install` and adjusted the `App` unit test mock so Suspense fallback assertions still pass under the newer Vitest/JSDOM stack.
- Core scene components are present in `src/` including `House`, `FireworksManager`, `SkyLantern`, and `Environment` (see `src/` for component implementations).
- Project uses TypeScript, Vite, R3F, and Vitest.
- Static voxel scenery now uses instanced meshes with shared geometry/material caching, and fireworks particles use pooling to avoid churn.
- Tailwind CSS is on v4 and now wired through the Vite plugin, using the v4 `@import "tailwindcss";` entrypoint in `src/index.css`.
- The 3D scene is now code-split and lazy-loaded (`SceneCanvas`), so initial HTML/CSS renders before heavy Three.js bundles.
- Added staged scene hydration (world, atmosphere, lanterns, fireworks, postprocessing) plus WebGL context loss handling and a lower initial DPR to reduce GPU pressure.
- Added SceneCanvas tests that exercise idle scheduling, WebGL context loss handling, and rocket add/remove behavior.
- Fireworks now uses a packed struct-of-arrays simulation (typed buffers) and writes matrices/colors directly into instanced attributes to minimize per-frame overhead and GC churn.
- Ice lake reflections now scale reflector resolution with DPR and use a cheaper blur for better GPU performance.

## Next steps & immediate tasks

- Re-evaluate ESLint 10 / TypeScript 7 upgrade when `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, and `@typescript-eslint` add support.
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

_Update this file to reflect current work and immediate next actions._
