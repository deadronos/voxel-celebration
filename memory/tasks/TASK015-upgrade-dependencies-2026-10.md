# TASK015 - Dependency Upgrade Pass (October 2026)

**Status:** Completed
**Added:** 2026-10-17
**Updated:** 2026-10-17

## Original Request

"Update this to latest packages and dependencies and open a new branch for that, fix errors and until ok and tests ok etc, then open a pr."

## Summary

Refreshed every direct dependency to its latest stable version available on 2026-10-17, including the Vitest 4 → 5 major, and moved the runtime baseline to Node 24 LTS. The full validation suite (test, lint, typecheck, build, format:check, coverage) passes, `npm audit` is clean, `npm ci` reproduces the tree, and the scene was smoke-tested in a real browser (WebGL2 context, fireworks, bloom, zero console errors). No application source changes were required — the upgrade was clean.

## Changes

- Moved the runtime baseline to **Node 24 LTS**: `engines.node` is now `>=24.15.0` (the floor `jsdom` requires on the 24.x line), and both `ci.yml` and `deploy-pages.yml` use `node-version: '24'`.
- **Major upgrades:**
  - `vitest` 4.1.10 → **5.0.5**
  - `@vitest/coverage-v8` 4.1.10 → **5.0.5**
  - `@types/node` 22.20.1 → **24.19.2** (aligned to the Node 24 LTS runtime rather than jumping to 26, so types match the version CI actually runs)
- **Minor/patch bumps:** `three` 0.185.1 → 0.186.1, `@react-three/fiber` 9.7.0 → 9.8.2, `@react-three/drei` 10.7.7 → 10.7.9, `@react-three/postprocessing` 3.0.4 → 3.2.0, `react`/`react-dom` 19.2.8 → 19.3.1, `vite` 8.2.0 → 8.3.4, `@vitejs/plugin-react` 6.0.5 → 6.1.2, `@typescript-eslint/*` 8.65.0 → 8.71.2, `@playwright/test` 1.62.1 → 1.64.1, `jsdom` 30.0.1 → 30.1.3, `prettier` 3.9.6 → 3.9.10, `@eslint/eslintrc` 3.3.6 → 3.3.7, and the `@testing-library/*` trio.
- **GitHub Actions refreshed** (these are dependencies too, and the old majors triggered a "Node.js 20 is deprecated" runner annotation): `actions/checkout` v4 → **v7**, `actions/setup-node` v4 → **v7**, `actions/upload-pages-artifact` v3 → **v5**, `actions/deploy-pages` v4 → **v5**. Checked the release notes for breaking changes — the only behavioral change that could affect us is `setup-node` v7's `NODE_AUTH_TOKEN` handling, which does not apply here (we only use `node-version` + `cache: npm`).
- `npm audit fix` cleared 3 transitive vulnerabilities (`@humanfs/node`, `brace-expansion`, `fflate`); audit now reports 0 vulnerabilities.
- **Held versions (unchanged rationale from TASK012):** ESLint stays on 9.39.5 and TypeScript on 6.0.3 — both are already the newest release in their major line, and the next majors remain blocked upstream:
  - `eslint-plugin-react` 7.37.5 peers `eslint ^…^9.7` and `eslint-plugin-jsx-a11y` 6.10.2 peers `^…^9`, so ESLint 10 is not yet usable.
  - `@typescript-eslint` 8.71.2 peers `typescript >=4.8.4 <6.1.0`, so TypeScript 7 is not yet usable with the linter.
- **Dev-server port unified on 5173** (follow-up flagged in the PR): `vite.config.ts` used 3000 while `README.md`, `AGENTS.md`, `playwright.config.ts`, and `tests/performance.spec.ts` all said 5173. Now consistent, and the repo's Playwright perf spec runs end-to-end for the first time.
- No `src/` changes were needed: lint, typecheck, formatting, and all 90 tests passed against the new stack as-is.

## Validation

- `npm run test` — 25 files / 90 tests passed (vitest 5.0.5)
- `npm run lint` — clean
- `npm run typecheck` — clean
- `npm run format:check` — clean
- `npm run build` — success (vite 8.3.4, 595 modules)
- `npm run test:coverage` — success (92.21% statements / 81.33% branches)
- `npm ci` — clean install from the committed lockfile, 0 vulnerabilities
- `npm audit` — 0 vulnerabilities
- Browser smoke test on `npm run dev` (port 5173) — canvas mounts with a live WebGL 2.0 context, voxel scene + lanterns + snowfall + aurora render, the fireworks and bloom stages hydrate, 0 console errors
- `npx playwright test tests/performance.spec.ts` — 1 passed; confirms the port fix (the spec's `webServer`/`baseURL` at 5173 now resolves) and exercises playwright 1.64.1 + three 0.186.1 in headless Chromium/WebGL

## Known non-blocking warnings (upstream, not actionable here)

- `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` — emitted by `@react-three/fiber` internals (still present in the latest 9.8.2), not by this repo. Already tracked as a known upstream item in `activeContext.md`.
- `[THREE_CJS_DEPRECATED] require("three") is deprecated` during tests — emitted by `@react-three/test-renderer` (CJS consumer) under three 0.186.
- Vitest 5 suggests `pool: 'vmThreads'` or `isolate: false` to reuse the jsdom environment; a performance hint only.

## Out-of-scope observation

~~`vite.config.ts` served the dev server on port **3000** while `README.md`, `AGENTS.md`, `playwright.config.ts`, and `tests/performance.spec.ts` all referenced **5173**.~~ **Fixed on 2026-10-17:** `vite.config.ts` now serves on **5173**, so the documented URL and the Playwright `webServer`/`baseURL` config match reality. `npx playwright test tests/performance.spec.ts` passes end-to-end (it previously could not run, since nothing served the port its config pointed at).

Note: running Playwright leaves an untracked `test-results/` directory that is not covered by `.gitignore` — worth adding if browser tests get wired into CI.

## Progress Log

### 2026-10-17

- Confirmed a green baseline on `main` (90 tests passing) before touching anything.
- Created branch `chore/upgrade-dependencies-2026-10`.
- Bumped `package.json`, aligned both workflows to Node 24 LTS, ran `npm install` + `npm audit fix`.
- Verified every direct dependency is at latest except the two deliberately held majors.
- Ran the full validation suite and a real-browser smoke test; no source fixes were required.
- Updated `memory/activeContext.md`, `memory/progress.md`, and `memory/techContext.md`; opened a PR against `main`.
