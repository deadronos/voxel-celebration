import React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { act } from 'react';

// SceneCanvas's children are normally rendered by the R3F reconciler (not into the DOM).
// For focused unit tests, mock R3F's Canvas/useThree so the scene JSX renders in the DOM,
// enabling interaction and event dispatch (e.g., WebGL context lost).
vi.mock('@react-three/fiber', async () => {
  const ReactModule = await import('react');

  type ThreeState = { gl: { domElement: HTMLCanvasElement | null } };
  const ThreeContext = ReactModule.createContext<ThreeState>({ gl: { domElement: null } });

  const Canvas = ({ children }: { children?: React.ReactNode }) => {
    const hostRef = ReactModule.useRef<HTMLDivElement | null>(null);
    const domElement = ReactModule.useMemo(() => document.createElement('canvas'), []);

    ReactModule.useLayoutEffect(() => {
      hostRef.current?.appendChild(domElement);
      return () => {
        domElement.remove();
      };
    }, [domElement]);

    return (
      <ThreeContext.Provider value={{ gl: { domElement } }}>
        <div>
          <div ref={hostRef} />
          {children}
        </div>
      </ThreeContext.Provider>
    );
  };

  const useThree = <T,>(selector: (state: ThreeState) => T): T => {
    const state = ReactModule.useContext(ThreeContext);
    return selector(state);
  };

  return { Canvas, useThree };
});

// Keep SceneCanvas tests scoped to SceneCanvas behavior: stub out the scene's child modules.
// Use relative specifiers matching the on-disk paths so mocks apply to SceneCanvas's
// relative imports (e.g. import('./SceneWorld')).
vi.mock('../../src/components/DynamicResScaler', () => ({ DynamicResScaler: () => null }));

vi.mock('../../src/SceneWorld', () => ({
  default: ({
    onShootRocket,
  }: {
    onShootRocket: (start: THREE.Vector3, color: string) => void;
  }) => (
    <div data-testid="scene-world">
      <button
        type="button"
        onClick={() => {
          onShootRocket(new THREE.Vector3(1, 2, 3), '#ff00ff');
        }}
      >
        Shoot
      </button>
    </div>
  ),
}));

vi.mock('../../src/SceneAtmosphere', () => ({
  default: () => <div data-testid="scene-atmosphere" />,
}));
vi.mock('../../src/SceneLanterns', () => ({ default: () => <div data-testid="scene-lanterns" /> }));
vi.mock('../../src/ScenePostProcessing', () => ({
  default: () => <div data-testid="scene-post" />,
}));
vi.mock('../../src/SceneControls', () => ({ default: () => <div data-testid="scene-controls" /> }));

vi.mock('../../src/components/FireworksManager', () => ({
  FireworksManager: ({
    rockets,
    removeRocket,
  }: {
    rockets: Array<{ id: string; targetHeight: number }>;
    removeRocket: (id: string) => void;
  }) => (
    <div data-testid="fireworks">
      <div data-testid="rocket-count">{rockets.length}</div>
      <button
        type="button"
        onClick={() => {
          const first = rockets[0];
          if (first) removeRocket(first.id);
        }}
      >
        Remove
      </button>
      {rockets.map((r) => (
        <div key={r.id} data-testid="rocket">
          {r.targetHeight}
        </div>
      ))}
    </div>
  ),
}));

import SceneCanvas from '@/SceneCanvas';

const setIdleCallbackCapture = (callbacks: Array<() => void>) => {
  (
    window as Window & { requestIdleCallback?: typeof window.requestIdleCallback }
  ).requestIdleCallback = vi.fn((cb: IdleRequestCallback) => {
    callbacks.push(cb as unknown as () => void);
    return 1;
  });
  (window as Window & { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback =
    vi.fn();
};

const unsetIdleCallback = () => {
  (
    window as Window & { requestIdleCallback?: typeof window.requestIdleCallback }
  ).requestIdleCallback = undefined;
  (window as Window & { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback =
    undefined;
};

describe('SceneCanvas', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('schedules staged loading work via requestIdleCallback', async () => {
    const callbacks: Array<() => void> = [];
    setIdleCallbackCapture(callbacks);

    render(<SceneCanvas />);

    await waitFor(() => {
      expect(window.requestIdleCallback).toHaveBeenCalled();
    });

    expect(window.requestIdleCallback).toHaveBeenCalledTimes(6);
    expect(callbacks).toHaveLength(6);
  });

  it('falls back to setTimeout scheduling when requestIdleCallback is unavailable', () => {
    unsetIdleCallback();
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
    const callbacks: Array<() => void> = [];
    setIdleCallbackCapture(callbacks);
    const { container } = render(<SceneCanvas />);

    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('shows and hides an overlay when the WebGL context is lost/restored', async () => {
    const callbacks: Array<() => void> = [];
    setIdleCallbackCapture(callbacks);

    const { container, queryByText } = render(<SceneCanvas />);
    const canvas = container.querySelector('canvas');
    if (!canvas) throw new Error('Expected a canvas element');

    expect(queryByText(/WebGL context lost/i)).toBeNull();

    // Ensure listeners have been attached.
    await waitFor(() => {
      expect(window.requestIdleCallback).toHaveBeenCalled();
    });

    fireEvent(canvas, new Event('webglcontextlost', { cancelable: true, bubbles: true }));

    await waitFor(() => {
      expect(queryByText(/WebGL context lost/i)).toBeTruthy();
    });

    fireEvent(canvas, new Event('webglcontextrestored', { bubbles: true }));

    await waitFor(() => {
      expect(queryByText(/WebGL context lost/i)).toBeNull();
    });
  });

  it('adds and removes rockets (happy path + remove-on-empty edge case)', async () => {
    const callbacks: Array<() => void> = [];
    setIdleCallbackCapture(callbacks);
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.123).mockReturnValueOnce(0);

    const { getByRole, getByTestId, queryAllByTestId } = render(<SceneCanvas />);

    await waitFor(() => {
      expect(callbacks).toHaveLength(6);
    });

    // Enable staged features without executing the prefetch callback (index 5).
    callbacks.slice(0, 5).forEach((cb) => cb());

    await waitFor(() => {
      expect(getByTestId('scene-world')).toBeTruthy();
      expect(getByTestId('fireworks')).toBeTruthy();
    });

    // Edge case: removing with no rockets should be a no-op.
    getByRole('button', { name: 'Remove' }).click();
    expect(getByTestId('rocket-count')).toHaveTextContent('0');

    // Happy path: add a rocket.
    getByRole('button', { name: 'Shoot' }).click();
    await waitFor(() => {
      expect(getByTestId('rocket-count')).toHaveTextContent('1');
    });
    expect(queryAllByTestId('rocket')).toHaveLength(1);
    expect(queryAllByTestId('rocket')[0]).toHaveTextContent('8');

    // Happy path: remove the rocket.
    getByRole('button', { name: 'Remove' }).click();
    await waitFor(() => {
      expect(getByTestId('rocket-count')).toHaveTextContent('0');
    });
  });

  it('prefetches lazy modules in idle time', async () => {
    const callbacks: Array<() => void> = [];
    setIdleCallbackCapture(callbacks);

    render(<SceneCanvas />);

    await waitFor(() => {
      expect(callbacks).toHaveLength(6);
    });

    // Index 5 is the prefetch callback scheduled in the second useEffect.
    await act(async () => {
      callbacks[5]?.();
      // Let any microtasks from dynamic imports flush.
      await Promise.resolve();
    });
  });
});
