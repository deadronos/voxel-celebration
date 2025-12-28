import React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SceneCanvas from '@/SceneCanvas';

const setIdleCallback = (enabled: boolean) => {
  if (enabled) {
    (
      window as Window & { requestIdleCallback?: typeof window.requestIdleCallback }
    ).requestIdleCallback = vi.fn(
      (callback: (deadline: { timeRemaining: () => number; didTimeout: boolean }) => void) => {
        // Do not execute the callback automatically.
        // SceneCanvas schedules dynamic imports in an idle callback; executing it here can
        // leave pending module-runner requests when the worker shuts down (unhandled).
        void callback;
        return 1;
      }
    );
    (window as Window & { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback =
      vi.fn();
  } else {
    (
      window as Window & { requestIdleCallback?: typeof window.requestIdleCallback }
    ).requestIdleCallback = undefined;
    (window as Window & { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback =
      undefined;
  }
};

describe('SceneCanvas', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('schedules staged loading work via requestIdleCallback', async () => {
    setIdleCallback(true);

    render(<SceneCanvas />);

    await waitFor(() => {
      expect(window.requestIdleCallback).toHaveBeenCalled();
    });

    expect(window.requestIdleCallback).toHaveBeenCalledTimes(6);
  });

  it('falls back to setTimeout scheduling when requestIdleCallback is unavailable', () => {
    setIdleCallback(false);
    const setTimeoutSpy = vi
      .spyOn(window, 'setTimeout')
      .mockImplementation(
        ((_handler: TimerHandler, _timeout?: number, ..._args: unknown[]) =>
          1) as unknown as typeof window.setTimeout
      );
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

    const { unmount } = render(<SceneCanvas />);

    expect(setTimeoutSpy).toHaveBeenCalled();

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('renders a WebGL canvas', () => {
    setIdleCallback(true);
    const { container } = render(<SceneCanvas />);

    expect(container.querySelector('canvas')).toBeTruthy();
  });
});
