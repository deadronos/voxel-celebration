# DES005: TDD Adoption (Red → Green → Refactor)

## Goal

Adopt a lightweight Test-Driven Development (TDD) practice across the repository to improve correctness, design quality, and long-term maintainability by encouraging test-first development for new features, bug fixes, and significant refactors.

## Scope

- Applies to: new features, bug fixes, and significant refactors that affect behavior, contracts, or performance-sensitive code.
- Excludes: minor documentation edits, trivial non-functional chores, and experiments/prototypes (exceptions documented in the task).

## Requirements (EARS style)

- WHEN a new feature is requested, THE DEVELOPER SHALL add a failing test that expresses the acceptance criteria before implementing the feature.  
  Acceptance: The failing test demonstrates the acceptance criterion locally or would fail on `main` until implemented.

- WHEN a bug is reported, THE DEVELOPER SHALL add a reproducible failing test that captures the bug before applying the fix.  
  Acceptance: The test fails with the bug present and passes after the fix.

- WHEN a refactor is planned, THE DEVELOPER SHALL ensure tests exist that cover the current behavior and add tests for any new behavior before making large, behavior-changing refactors.  
  Acceptance: Tests remain green and code coverage does not regress significantly without explanation.

- WHEN behavior or public contract changes are required, THE DEVELOPER SHALL update tests to reflect the new contract and include acceptance tests that express the expected change.  
  Acceptance: Tests clearly encode the new contract and are reviewed as part of the PR.

## Process (Red → Green → Refactor)

1. Red — Add a failing test that captures the minimal acceptance criteria. Keep the test small and focused (unit, integration, or E2E depending on scope).
2. Commit the failing test with a clear message, e.g. `test: add failing test for <feature/bug>`.
3. Green — Implement the smallest change necessary to make the test pass. Commit: `feat: implement <feature> (make tests pass)`.
4. Refactor — Clean up code, extract helpers, improve naming and structure. Keep tests green. Commit: `refactor: <what changed>`.
5. PR — In the PR description, document the Red/Green/Refactor steps and point to the relevant commits or explain exceptions.

> Note: Keep commits small and focused. Separate the failing-test commit (Red) from implementation (Green) and refactor commits wherever practical — this helps reviewers and preserves the logic of the TDD cycle.

## Enforcement & Automation

- PR Checklist: Add a "TDD" section to the PR template; require the developer to confirm either: (a) a failing test was added first, or (b) a succinct explanation why TDD was not feasible for this change.
- Code review: Reviewers shall verify tests capture acceptance criteria and request the Red/Green/Refactor explanation if it is not present.
- Optional CI: Add a non-blocking check that warns when `src/` changes have no test changes in `tests/` (team decision before making it blocking).

## Pilot Plan

- Candidate: `DynamicResScaler` component (see TASK010 for details).  
  - Red: Add failing tests that express expected behaviors (props for `minDpr`/`maxDpr`, and boundary guarantees).  
  - Green: Implement minimal support for props and pass tests.  
  - Refactor: Extract DPR decision math to a small pure function with unit tests, improve naming and add comments.

- Success metrics: pilot uses TDD; tests added for the feature; coverage for target module increases; CI remains stable.

## Rollout & Training

- Create `.github/instructions/tdd.instructions.md` as a short how-to and examples file.  
- Run a 1-hour pairing session to demonstrate TDD on the pilot PR.  
- Update PR template and `memory/tasks/_index.md` to include the adopt-TDD task and status.

## Risks & Mitigations

- Risk: TDD can slow initial velocity — mitigate with training, pairing, and starting with low-risk pilots.  
- Risk: Legacy code may be hard to test — mitigate with incremental refactors, test harnesses, and test doubles.

## Acceptance Criteria

- This design file is added to `memory/designs` (DES005).  
- A task file (TASK010) is created and the pilot PR is opened.  
- At least one feature is implemented and merged following Red → Green → Refactor (pilot proof of concept).

---

*Design created 2025-12-28.*
