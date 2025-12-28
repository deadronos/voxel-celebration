# TASK010: Adopt TDD (Red → Green → Refactor)

**Status:** Completed  
**Added:** 2025-12-28  
**Updated:** 2025-12-28

## Original Request

Adopt Test-Driven Development (TDD) practices across the repository; create a design, task plan, short instruction document, and run a pilot (DynamicResScaler) demonstrating Red → Green → Refactor.

## Thought Process

The repository already has a strong testing culture (Vitest, Playwright) and a spec-driven workflow; however, it lacks an explicit TDD policy or quick how-to for contributors. A lightweight, pragmatic approach (encouragement + short docs + pilot + small automation) will make adoption feasible without heavy ceremony.

## Implementation Plan (subtasks)

- [x] **DES005** — Create TDD design doc (`memory/designs/DES005-tdd-adoption.md`).
- [x] **Add Task** — Create this task file (`TASK010-adopt-tdd.md`).
- [x] **Docs** — Create `.github/instructions/tdd.instructions.md` (short how-to and examples).
- [x] **Instruction Edits** — Update `nodejs-javascript-vitest.instructions.md` and `spec-driven-workflow-v1.instructions.md` to explicitly mention Red→Green→Refactor and test-first guidance.
- [x] **Pilot (DynamicResScaler)** — Implement a failing test, make it pass, then refactor.
- [x] **Examples** — Add a short helper/examples doc for Vitest/Playwright.
- [x] **Retrospective** — Add a short retrospective entry in `memory/progress.md`.

### Pilot: `DynamicResScaler`

- Red: Add failing unit test(s) that capture accepted behavior (e.g., `minDpr`/`maxDpr` props and boundary behavior).  
- Green: Implement minimal code changes to satisfy tests (add props and use them).  
- Refactor: Extract DPR math into a pure helper with unit tests and ensure all tests pass.

## Progress Tracking

**Overall Status:** Completed - TDD docs + pilot + retrospective

### Subtasks

- 1.1 **Draft design (`DES005`)** — **Completed** (2025-12-28) — Design added to `memory/designs`
- 1.2 **Create task (`TASK010`)** — **Completed** (2025-12-28) — This file
- 1.3 **Write `tdd.instructions.md`** — **Completed** (2025-12-28) — Short how-to and examples
- 1.4 **Edit existing instruction files** — **Completed** (2025-12-28) — Codified Red → Green → Refactor guidance
- 1.5 **Pilot (DynamicResScaler)** — **Completed** — Red + Green + Refactor (helper + unit tests)
- 1.6 **Examples doc** — **Completed** (2025-12-28) — Added Vitest/Playwright patterns
- 1.7 **Retrospective entry** — **Completed** (2025-12-28) — Added to `memory/progress.md`

## Progress Log

### 2025-12-28

- Created design file `DES005-tdd-adoption.md`.  
- Created task file `TASK010-adopt-tdd.md`.  
- Drafted `tdd.instructions.md` with examples.  
- Added failing TDD pilot tests for `DynamicResScaler` (Red step).
- Updated TDD guidance in instruction files and added TASK010 to the tasks index.
- Implemented Green step for `DynamicResScaler` (minDpr/maxDpr clamping) and verified tests pass locally.
- Completed Refactor step: extracted DPR math to `computeNextDpr` helper and added unit tests; all DynamicResScaler tests pass.
- Added testing examples doc for Vitest/Playwright and recorded a short retrospective entry.

## Follow-ups (optional)

- Add a PR template checklist for TDD (verify failing test or explanation).
- Add a non-blocking CI warning when `src/` changes land without test updates.
- Run a short pairing session to onboard contributors to the flow.

---

*Task created by automation on 2025-12-28.*
