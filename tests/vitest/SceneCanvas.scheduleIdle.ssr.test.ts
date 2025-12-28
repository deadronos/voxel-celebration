// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import React from 'react';

// Prevent the real R3F implementation from loading in the Node environment.
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  useThree: () => ({ gl: { domElement: null } }),
}));

describe('scheduleIdle (SSR)', () => {
  it('runs the callback immediately when window is undefined', async () => {
    const { scheduleIdle } = await import('@/SceneCanvas');

    let called = 0;
    const cancel = scheduleIdle(() => {
      called += 1;
    }, 123);

    expect(called).toBe(1);
    expect(typeof cancel).toBe('function');
    expect(() => cancel()).not.toThrow();
  });
});
