---
description: 'Short, practical testing examples for Vitest and Playwright used in this repo.'
applyTo: '**'
---

# Testing Examples (Vitest + Playwright)

This repository primarily uses:

- **Vitest** for unit and component tests (`tests/vitest/`)
- **Playwright** for end-to-end tests (when/if added)

The examples below are intended as quick copy-and-adapt patterns.

## Vitest: pure function unit test

Prefer extracting “math/decision” logic into small pure functions and testing them directly.

```ts
import { describe, expect, it } from 'vitest';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

describe('clamp', () => {
  it('clamps to range', () => {
    expect(clamp(2, 0, 1)).toBe(1);
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });
});
```

## Vitest: React component test with React Testing Library

Use `@testing-library/react` to test behavior via outputs (DOM, callbacks) rather than internal details.

```tsx
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

function Button({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}>
      Click
    </button>
  );
}

describe('Button', () => {
  it('invokes callback when clicked', async () => {
    const onClick = vi.fn();
    const { getByRole } = render(<Button onClick={onClick} />);

    getByRole('button', { name: 'Click' }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

## Vitest: mocking `@react-three/fiber` hooks (R3F)

When testing R3F helper components that depend on `useFrame`/`useThree`, mock them and drive the frame callback.

Reference implementation pattern: `tests/vitest/DynamicResScaler.test.tsx`.

Key ideas:

- Capture the callback passed to `useFrame` into an array.
- Provide a test `setDpr` spy via `useThree` selector.
- Advance time deterministically with `vi.spyOn(performance, 'now')`.

## Playwright: resilient locators + web-first assertions

Prefer role-based locators and web-first assertions.

```ts
import { test, expect } from '@playwright/test';

test.describe('App smoke', () => {
  test('loads without crashing', async ({ page }) => {
    await page.goto('/');

    // Example: verify the main content exists.
    await expect(page.getByRole('main')).toBeVisible();
  });
});
```

## Playwright: accessibility snapshot (recommended for stable UI structures)

```ts
import { test, expect } from '@playwright/test';

test('main structure is stable', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - main:
  `);
});
```

## Local workflow

```bash
npm test
npm run test:watch
npm run lint
npm run typecheck
```
