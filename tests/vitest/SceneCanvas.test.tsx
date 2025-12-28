import React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SceneCanvas from '@/SceneCanvas';

const setIdleCallback = (enabled: boolean) => {
  if (enabled) {
    (window as Window & { requestIdleCallback?: typeof window.requestIdleCallback }).requestIdleCallback = vi.fn(
      (callback: (deadline: { timeRemaining: () => number; didTimeout: boolean }) => void) => {
        callback({ timeRemaining: () => 0, didTimeout: false });
        return 1;
      }
    );
    (window as Window & { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback = vi.fn();
  } else {
    (window as Window & { requestIdleCallback?: typeof window.requestIdleCallback }).requestIdleCallback = undefined;
    (window as Window & { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback = undefined;
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

  it('falls back to setTimeout scheduling when requestIdleCallback is unavailable', async () => {
    setIdleCallback(false);
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

    const { unmount } = render(<SceneCanvas />);

    await waitFor(() => {
      expect(setTimeoutSpy).toHaveBeenCalled();
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('renders a WebGL canvas', () => {
    setIdleCallback(true);
    const { container } = render(<SceneCanvas />);

    expect(container.querySelector('canvas')).toBeTruthy();
  });
});
