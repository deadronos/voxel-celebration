# TASK013 - Address Post-Upgrade Review Findings

**Status:** Completed
**Added:** 2026-08-01
**Updated:** 2026-08-01

## Original Request

Review the merged dependency-upgrade PR (TASK012) for logical errors / code quality, then address the findings.

## Findings Addressed

1. **Shadow rendering regression (three 0.185)** — `PCFSoftShadowMap` is deprecated in three 0.185 and silently falls back to hard `PCFShadowMap` shadows. `SceneCanvas` used `<Canvas shadows>` (boolean), so soft shadows were lost. Changed to `shadows="variance"` (VSMShadowMap) to preserve soft shadows; the deprecation warning no longer appears and the scene renders cleanly.
2. **Dead patch-package config** — `patch-package` and `patches/three+0.182.0.patch` were unused (no `postinstall` script) and targeted three 0.182.0, whose patched code no longer exists in 0.185.1. Removed `patch-package` from devDependencies and deleted the patch file.
3. **Node version inconsistency** — `deploy-pages.yml` still ran Node 20 while `ci.yml` uses Node 22 (required by jsdom 30 / vite 8 engines). Aligned deploy workflow to Node 22.
4. **Missing engines field** — added `"engines": { "node": ">=22.22.2" }` to `package.json` to document the minimum Node version and prevent silent engine mismatches.
5. **Vestigial CDN import map** — the `index.html` import map pointed at esm.sh while Vite bundles all three/R3F imports from `node_modules`; it was inert in both dev and production. Removed it.
6. **stats-gl override** — the `stats-gl@3.8.0` override was undocumented and is unnecessary: drei's declared range (`^2.2.8`) resolves to `2.4.2`, nothing imports `stats-gl` directly, and `npm audit` stays at 0. Removed the override.
7. **@types/node mismatch** — CI runs Node 22 but types targeted Node 26; aligned `@types/node` to `^22` (22.20.1) to match the runtime used in CI.

## Not Addressed (upstream)

- `THREE.Clock` deprecation warning originates from `@react-three/fiber@9.7.0` internals (`new THREE.Clock()` in its events module); not fixable in this repo. Tracked as an upstream item.

## Validation

- `npm run test` — 25 files / 90 tests passed
- `npm run lint` / `npm run typecheck` — clean
- `npm run build` — success
- `npm run format:check` — clean
- `npm audit` — 0 vulnerabilities
- Browser smoke test: canvas + WebGL2 mount, no console errors, `PCFSoftShadowMap` warning gone

## Progress Log

### 2026-08-01

- Applied all follow-up changes on `codex/address-review-findings`, validated locally, opened PR, passed CI, and merged.
