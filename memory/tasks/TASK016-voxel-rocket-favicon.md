# TASK016 - Voxel Rocket Favicon

**Status:** Completed
**Added:** 2026-10-17
**Updated:** 2026-10-17

## Original Request

"can you do voxel/rocket styled svg favicon etc please"

Follow-up to the 404 discovered while verifying the v0.0.5 deployment.

## Problem

`index.html` referenced `/vite.svg`, a leftover from the Vite template, but there was **no `public/` directory** and no such file anywhere in the repo. Vite only rewrites references it can resolve, so the path survived the build untouched and resolved against the domain root instead of the configured base — producing `GET https://deadronos.github.io/vite.svg → 404` plus a console error on every production load.

## Summary

Replaced the dangling reference with a purpose-built voxel rocket icon set, added a `public/` directory, and added a regression test that would have caught the original bug.

## Changes

- **`public/favicon.svg`** — hand-authored voxel rocket: 4px cubes on a 32px grid, night backdrop `#050510` matching the scene, crimson body in three shade steps (light from the right), cream porthole, gold `#ffcc00` exhaust, flanking fins, `shape-rendering="crispEdges"` for pixel-crisp edges.
- **`public/favicon-32.png`**, **`public/apple-touch-icon.png`** (180×180) — opaque, full-bleed PNG fallbacks. iOS masks its own corners, so transparency is deliberately avoided.
- **`public/site.webmanifest`** — name, `theme_color`, and icon entries. Icon `src` values are **relative** on purpose: Vite does not rewrite paths inside `public/`, so root-absolute paths there would 404 under the deployed base.
- **`scripts/generate-favicons.mjs`** — regenerates the PNGs from the SVG using the Chromium that Playwright already installs, so the binaries have reproducible provenance and no extra image tooling is needed.
- **`index.html`** — replaced `/vite.svg` with the SVG icon, a 32px PNG fallback, `apple-touch-icon`, the manifest link, and `<meta name="theme-color">`.
- **`tests/vitest/indexHtmlAssets.test.ts`** — new regression test (written first, failing) asserting that every root-absolute reference in `index.html` resolves to a real file, that the favicon is an existing SVG, and that manifest icons exist and stay relative.

## Design notes

Three concepts were rendered and compared side by side at 16/32/48/96/128px before choosing:

1. Rocket with starfield, shallow nose (24px tall) — rejected: too small at 16px.
2. Bolder rocket, no stars (28px tall) — rejected: the shallow nose made the silhouette read as a _house_, which is confusing in a scene that actually contains red-roofed voxel houses.
3. **Adopted:** bolder rocket with a three-step conical nose (8px → 12px → 16px), which reads unmistakably as a rocket at every size.

## Validation

- `npx vitest run tests/vitest/indexHtmlAssets.test.ts` — 4 tests pass (all 4 failed before the fix, confirming the test catches the bug)
- `npm run test` — 26 files / 94 tests passed (was 25 / 90)
- `npm run lint`, `npm run typecheck`, `npm run format:check` — clean
- `npm run build` — success; verified `dist/index.html` rewrites every icon path to `/voxel-celebration/…`, and all four files are emitted to `dist/`
- Dev server — `/favicon.svg`, `/favicon-32.png`, `/apple-touch-icon.png` and `/site.webmanifest` all return 200 with correct content types
- Visual check of the icon at 16, 32, 48 and 180px in a real browser

## Progress Log

### 2026-10-17

- Wrote the failing regression test, authored and iterated the SVG against real renders, generated the PNGs, wired up `index.html`, and confirmed the base-path rewrite in the production build.
