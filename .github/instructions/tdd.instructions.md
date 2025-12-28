---
description: 'Test-Driven Development (TDD) guidance: Red → Green → Refactor, examples, and PR/review expectations.'
applyTo: '**'
---

# TDD — Test-Driven Development (Red → Green → Refactor)

## Purpose

Provide a short, pragmatic guide to using Test-Driven Development (TDD) in this repository. The goal is to encourage test-first work for new features, bug fixes, and meaningful refactors while keeping the process lightweight and review-friendly.

## When to use TDD

- Strongly encouraged for: features, bug fixes, public API/contract changes, and performance-sensitive code.
- Optional (or skip): documentation-only changes, trivial chores, early experimental prototypes (but prefer to add tests before merging experimental branches if they graduate to `dev`/`main`).

## The Cycle — Red → Green → Refactor

1. Red — add a failing test that captures the smallest acceptance criterion.
2. Commit the failing test (e.g., `test: add failing test for <feature/bug>`).
3. Green — implement the smallest change to make the test pass. Commit `(feat|fix): ...`.
4. Refactor — improve structure and naming while keeping all tests passing. Commit `refactor: ...`.
5. PR — document the sequence (Red/Green/Refactor) and any notable design decisions.

> Tip: Keep each step small. Small, focused commits make reviews fast and make it obvious what changed.

## Examples

### Failing unit test (Red)

```ts
// tests/vitest/example.feature.test.ts
import { render } from '@testing-library/react';
import { it, expect } from 'vitest';
import { MyComponent } from '@/components/MyComponent';

it('shows greeting when name provided', () => {
  // This test should fail initially (Red)
  const { getByText } = render(<MyComponent name="Ava" />);
  expect(getByText('Hello, Ava')).toBeTruthy();
});
```

### Minimal implementation (Green)

```ts
// components/MyComponent.tsx
export function MyComponent({ name }: { name: string }) {
  return <div>{`Hello, ${name}`}</div>;
}
```

### Refactor (Refactor)

- Extract formatting to helper `formatGreeting(name)` and add unit tests for it.

## Commit & PR Conventions

- Prefer separate commits for Red, Green, and Refactor (helps reviewers). Example:
  - `test: add failing test for feature X`  (Red)
  - `feat: implement minimal feature X to satisfy tests` (Green)
  - `refactor: extract helper and add unit tests` (Refactor)
- In the PR description, add a short section documenting the TDD steps with commit references or explanations.
- If TDD was not feasible, include a short explanation in PR (e.g., prototype, exploratory spike) and add tests before merge if the work graduates.

## Reviewer Checklist

- [ ] Does the test(s) capture acceptance criteria and edge cases?
- [ ] Is there evidence of a failing test (commit or test results) prior to the implementation or a reasonable explanation why not?
- [ ] Are tests deterministic and independent?
- [ ] Does the PR include a small, focused refactor commit if code was cleaned up?

## Working tips

- Use `npm run test:watch` while iterating Red → Green → Refactor.
- Prefer unit tests for small logic, integration tests for component interactions, and Playwright for user-level scenarios.
- If you must make code changes to enable testing, keep them minimal and explain them in the PR; add tests first whenever possible.

## Automation suggestions (optional)

- Add a non-blocking GitHub Action that warns when `src/` files were changed but no tests under `tests/` were added (helpful during onboarding; do not block merges until team agrees).

## Exceptions

- Prototypes and early spike branches may skip strict TDD; however, before merging to `dev`/`main`, add tests and convert the PR to follow the TDD flow.

---

*Short TDD guide created 2025-12-28.*
