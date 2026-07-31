# TASK012 - Dependency Upgrade Pass (August 2026)

**Status:** Completed
**Added:** 2026-08-01
**Updated:** 2026-08-01

## Original Request

“Open a new branch and upgrade this to latest dependencies and packages, fix errors until ok, open a PR and then merge.”

## Summary

Refreshed all direct dependencies to their latest stable versions available on 2026-08-01, applied available security fixes, and fixed the resulting formatting incompatibility. The full validation suite (test, lint, typecheck, build, format:check) passes, the production audit is clean, and the app was smoke-tested in a real browser with zero console errors.

## Changes

- Upgraded 20 direct dependencies, including majors: `@testing-library/jest-dom` 6→7, `jsdom` 29→30, and `three` 0.184→0.185.1.
- Minor/patch bumps: `@react-three/fiber` 9.7.0, `@tailwindcss/vite` 4.3.3, `tailwindcss` 4.3.3, `@vitejs/plugin-react` 6.0.5, `vite` 8.2.0, `vitest` 4.1.10, `@typescript-eslint/*` 8.65.0, `prettier` 3.9.6, `react`/`react-dom` 19.2.8, `@playwright/test` 1.62.1, `@types/node` 26.1.2, and others.
- `npm audit fix` cleared 3 transitive vulnerabilities (babel core, brace-expansion, tmp).
- Re-ran Prettier 3.9.6 on `src/components/Snowfall.tsx` (formatting regression from the June upgrade).
- Aligned the CDN import map in `index.html` with installed versions (three ^0.185.1, fiber ^9.7.0) to prevent duplicate three.js copies at runtime.
- ESLint 9.39.5 (latest 9.x) and TypeScript 6.0.3 (latest 6.x) are intentionally held back from major versions:
  - `eslint-plugin-react` 7.37.5 and `eslint-plugin-jsx-a11y` 6.10.2 (both latest) do not yet support ESLint 10.
  - `@typescript-eslint` 8.65.0 (latest) only supports TypeScript <6.1.0, so TypeScript 7 is not yet usable with the linter.

## Validation

- `npm run test` — 25 files / 90 tests passed
- `npm run lint` — clean
- `npm run typecheck` — clean
- `npm run build` — success (vite 8.2.0)
- `npm run format:check` — clean
- `npm audit` — 0 vulnerabilities
- Browser smoke test on `npm run dev` — page renders, WebGL canvas mounts, 0 console errors (only library-internal deprecation warnings from drei/fiber under three 0.185)

## Progress Log

### 2026-08-01

- Created branch `codex/upgrade-dependencies-2026-08`, upgraded deps via npm-check-updates (excluding eslint/typescript), applied audit fixes, and resolved formatting.
- Updated `index.html` import map to match installed versions.
- Opened PR, passed CI, and merged.
