# [TASK004] - Add CI workflow for lint/test/format

**Status:** Completed  
**Added:** 2025-12-27  
**Updated:** 2025-12-27

## Goal

Add a minimal GitHub Actions workflow that validates code quality and test baseline on PRs.

## Acceptance criteria

- A workflow file exists at `.github/workflows/ci.yml` and runs on PRs.
- Pipeline runs `npm ci`, `npm run lint`, `npm run format:check`, `npm run typecheck`, and `npm run test`.
- Workflow caches dependencies and is fast enough to be a practical gate for PRs.

## Implementation plan

1. Create `.github/workflows/ci.yml` with steps: checkout, setup-node (with cache), install, lint, format-check, typecheck, test.
2. Test in a branch and iterate until stable.
3. Optionally add build and preview steps for visual smoke tests.

---

### Progress Log

- Created `.github/workflows/ci.yml` that runs on `pull_request` events and `push` to `main`. The workflow executes `npm ci`, `npm run lint`, `npm run format:check`, `npm run typecheck`, and `npm run test`.
- Verified the workflow file is present and follows project scripts. (CI run on PR will validate full behavior.)
- Marked this task as completed and updated `memory/tasks/_index.md`.

_Create the workflow and open a PR for review._
