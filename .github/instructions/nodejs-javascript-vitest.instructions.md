---
description: 'Guidelines for writing Node.js and JavaScript code with Vitest testing'
applyTo: '**/*.js, **/*.mjs, **/*.cjs'
---

# Code Generation Guidelines

## Coding standards

- Use JavaScript with ES2022 features and Node.js (20+) ESM modules
- Use Node.js built-in modules and avoid external dependencies where possible
- Ask the user if you require any additional dependencies before adding them
- Always use async/await for asynchronous code, and use 'node:util' promisify function to avoid callbacks
- Keep the code simple and maintainable
- Use descriptive variable and function names
- Do not add comments unless absolutely necessary, the code should be self-explanatory
- Never use `null`, always use `undefined` for optional values
- Prefer functions over classes

## Testing

- Use Vitest for testing
- Write tests for all new features and bug fixes
- Ensure tests cover edge cases and error handling
- Prefer writing tests first when feasible (TDD: Red → Green → Refactor). When code must be changed to make it testable or to improve maintainability, make small, well-documented refactors in a separate commit **after** adding failing tests; ensure the behavior remains covered by tests.

### Test-Driven Development (TDD)

- Follow the Red → Green → Refactor cycle for features, bug fixes, and refactors:
  - **Red**: add a focused failing test that captures the acceptance criteria (unit, integration, or E2E as appropriate).
  - **Green**: implement the smallest change necessary to make the test pass.
  - **Refactor**: clean up, extract helpers, and improve design while keeping tests green.
- Prefer separate commits for Red, Green, and Refactor to make reviews easy — squash only if project conventions require it.
- Use `npm run test:watch` during local iteration.

## Documentation

- When adding new features or making significant changes, update the README.md file where necessary

## User interactions

- Ask questions if you are unsure about the implementation details, design choices, or need clarification on the requirements
- Always answer in the same language as the question, but use english for the generated content like code, comments or docs
