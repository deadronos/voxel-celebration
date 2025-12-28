# TASK010: Adopt TDD (Red → Green → Refactor)

**Status:** In Progress  
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
- [ ] **Instruction Edits** — Update `nodejs-javascript-vitest.instructions.md` and `spec-driven-workflow-v1.instructions.md` to explicitly mention Red→Green→Refactor and test-first guidance.
- [ ] **PR Template** — Add TDD checklist entry to PR template and minor code-review guidance (verify failing test commit or explanation).
- [ ] **Pilot (DynamicResScaler)** — Implement a failing test, make it pass, then refactor and merge. (See sub-steps below.)
- [ ] **Training** — Run a short pairing session and record notes in `memory/progress.md`.
- [ ] **Automation (optional)** — Add optional non-blocking CI step to warn on missing tests when source files change.
- [ ] **Metrics & Retrospective** — Measure pilot success, gather feedback, and update design as needed.

### Pilot: `DynamicResScaler`

- Red: Add failing unit test(s) that capture accepted behavior (e.g., `minDpr`/`maxDpr` props and boundary behavior).  
- Green: Implement minimal code changes to satisfy tests (add props and use them).  
- Refactor: Extract DPR math into a pure helper with unit tests and ensure all tests pass.

## Progress Tracking

**Overall Status:** In Progress - 75% of initial docs created

### Subtasks

- 1.1 **Draft design (`DES005`)** — **Completed** (2025-12-28) — Design added to `memory/designs`
- 1.2 **Create task (`TASK010`)** — **Completed** (2025-12-28) — This file
- 1.3 **Write `tdd.instructions.md`** — **Completed** (2025-12-28) — Short how-to and examples
- 1.4 **Edit existing instruction files** — **Not Started** — Plan and proposed edits ready
- 1.5 **Pilot (DynamicResScaler)** — **Not Started** — Will add failing test, implement, refactor
- 1.6 **PR template and CI automation** — **Not Started** — Optional, team decision needed
- 1.7 **Training & metrics** — **Not Started** — Pairing session proposal

## Progress Log

### 2025-12-28

- Created design file `DES005-tdd-adoption.md`.  
- Created task file `TASK010-adopt-tdd.md`.  
- Drafted `tdd.instructions.md` with examples.  
- Next: update `nodejs-javascript-vitest.instructions.md` and `spec-driven-workflow-v1.instructions.md` to codify TDD guidance and add TASK010 to the tasks index.

---

*Task created by automation on 2025-12-28.*
