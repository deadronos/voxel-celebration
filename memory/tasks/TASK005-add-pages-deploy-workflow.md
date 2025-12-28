# [TASK005] - Add GitHub Pages deploy workflow

**Status:** Completed  
**Added:** 2025-12-27  
**Completed:** 2025-12-27

## Original Request

Add a GitHub Actions workflow to build and deploy the site to GitHub Pages, and adjust Vite base so the site works at <https://deadronos.github.io/voxel-celebration/>.

## Acceptance criteria

- A workflow exists at `.github/workflows/deploy-pages.yml` which builds (`npm run build`) and deploys the `dist/` output to Pages using official, supported Actions (`actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`).
- `vite.config.ts` is configured so production builds use base `'/voxel-celebration/'` and the dev server keeps `/`.
- Local `npm run build` succeeds and produces `dist/`.
- The workflow triggers when a tag matching `v*` is pushed (e.g., `v1.0.0`).
- README updated with a short `Deployment` section describing the workflow and Pages URL.

## Implementation notes

- Used GitHub's recommended actions: `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, and `actions/deploy-pages@v4`.

- Used GitHub's recommended actions: `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, and `actions/deploy-pages@v4`.
- Added a `concurrency` group to prevent overlapping deployments.
- Set job-level permissions: `pages: write` and `id-token: write` for the deploy job as recommended.
- `vite.config.ts` now sets `base: mode === 'production' ? '/voxel-celebration/' : '/'`.
- Build and tests were validated locally (`npm run build`, `npm test`).

## Progress log

- 2025-12-27: Researched recommended Pages Actions and implemented workflow.
- 2025-12-27: Updated `vite.config.ts` and README, ran build and tests.
- 2025-12-27: Modified workflow to trigger only on tag pushes matching `v*`.

---

_Status: Completed — ready for review and enabling Pages in repository settings (if not already configured)._
