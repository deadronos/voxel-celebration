# [TASK004] - Add CI workflow for lint/test/format

**Status:** Not Started  
**Added:** 2025-12-27

## Goal

Add a minimal GitHub Actions workflow that validates code quality and test baseline on PRs.

## Acceptance criteria

- A workflow file exists at `.github/workflows/ci.yml` and runs on PRs.
- Pipeline runs `npm ci`, `npm run lint`, `npm run format:check`, and `npm run test`.
- Workflow caches `node_modules` and is fast enough to be a practical gate for PRs.

## Implementation plan

1. Create `.github/workflows/ci.yml` with steps: checkout, setup-node, cache, install, lint, format-check, test.
2. Test in a branch and iterate until stable.
3. Optionally add build and preview steps for visual smoke tests.

---

_Create the workflow and open a PR for review._