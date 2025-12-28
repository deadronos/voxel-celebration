import { vi, beforeAll, afterAll } from 'vitest';
import { act } from 'react';
import { setConsoleFunction } from 'three';

// React 18+/19: enable act() semantics for tests (used by RTL and @react-three/test-renderer)
// https://react.dev/reference/react-dom/test-utils/act
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// Avoid background idle-callback work (SceneCanvas schedules lazy imports in idle time).
// Call idle callbacks synchronously inside act() so suspended resources resolve inside act.
if (typeof window !== 'undefined') {
  (
    window as Window & { requestIdleCallback?: typeof window.requestIdleCallback }
  ).requestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
    act(() => {
      // Simulate an idle deadline
      callback({ didTimeout: false, timeRemaining: () => 9999 });
    });
    return 1;
  });
  (window as Window & { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback =
    vi.fn();
}

// Mock ResizeObserver for jsdom
class ResizeObserverMock implements ResizeObserver {
  observe(_target?: Element | Document | null): void {}
  unobserve(_target?: Element | Document | null): void {}
  disconnect(): void {}
}
// JSDOM doesn't implement ResizeObserver by default; define it explicitly
Object.defineProperty(globalThis, 'ResizeObserver', {
  value: ResizeObserverMock,
  configurable: true,
});

// Mock WebGL context with comprehensive API coverage for Three.js.
// Guard for Node-environment tests where HTMLCanvasElement doesn't exist.
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextType) => {
    if (contextType === 'webgl' || contextType === 'webgl2' || contextType === 'experimental-webgl') {
      return {
        canvas: {},
        drawingBufferWidth: 800,
        drawingBufferHeight: 600,

        // Context attributes
        getContextAttributes: vi.fn().mockReturnValue({
          alpha: true,
          depth: true,
          stencil: false,
          antialias: true,
          premultipliedAlpha: true,
          preserveDrawingBuffer: false,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
        }),

        // Extensions and parameters
        getExtension: vi.fn(),
        getParameter: vi.fn(),
        getSupportedExtensions: vi.fn().mockReturnValue([]),

        // Shader precision
        getShaderPrecisionFormat: vi.fn().mockReturnValue({
          precision: 1,
          rangeMin: 1,
          rangeMax: 1,
        }),

        // Buffer operations
        createBuffer: vi.fn(),
        bindBuffer: vi.fn(),
        bufferData: vi.fn(),
        deleteBuffer: vi.fn(),

        // Texture operations
        createTexture: vi.fn(),
        bindTexture: vi.fn(),
        texImage2D: vi.fn(),
        texParameteri: vi.fn(),
        deleteTexture: vi.fn(),

        // Framebuffer operations
        createFramebuffer: vi.fn(),
        bindFramebuffer: vi.fn(),
        framebufferTexture2D: vi.fn(),
        checkFramebufferStatus: vi.fn().mockReturnValue(36053), // FRAMEBUFFER_COMPLETE
        deleteFramebuffer: vi.fn(),

        // Renderbuffer operations
        createRenderbuffer: vi.fn(),
        bindRenderbuffer: vi.fn(),
        renderbufferStorage: vi.fn(),
        deleteRenderbuffer: vi.fn(),

        // Program and shader operations
        createProgram: vi.fn(),
        createShader: vi.fn(),
        shaderSource: vi.fn(),
        compileShader: vi.fn(),
        attachShader: vi.fn(),
        linkProgram: vi.fn(),
        useProgram: vi.fn(),
        deleteProgram: vi.fn(),
        deleteShader: vi.fn(),
        getShaderParameter: vi.fn().mockReturnValue(true),
        getProgramParameter: vi.fn().mockReturnValue(true),
        getShaderInfoLog: vi.fn().mockReturnValue(''),
        getProgramInfoLog: vi.fn().mockReturnValue(''),

        // Uniform and attribute operations
        getUniformLocation: vi.fn(),
        getAttribLocation: vi.fn(),
        uniform1f: vi.fn(),
        uniform2f: vi.fn(),
        uniform3f: vi.fn(),
        uniform4f: vi.fn(),
        uniform1i: vi.fn(),
        uniformMatrix4fv: vi.fn(),
        vertexAttribPointer: vi.fn(),
        enableVertexAttribArray: vi.fn(),
        disableVertexAttribArray: vi.fn(),

        // Drawing operations
        viewport: vi.fn(),
        clear: vi.fn(),
        clearColor: vi.fn(),
        clearDepth: vi.fn(),
        drawArrays: vi.fn(),
        drawElements: vi.fn(),

        // State management
        enable: vi.fn(),
        disable: vi.fn(),
        blendFunc: vi.fn(),
        blendEquation: vi.fn(),
        depthFunc: vi.fn(),
        depthMask: vi.fn(),
        cullFace: vi.fn(),
        frontFace: vi.fn(),

        // Other essential methods
        flush: vi.fn(),
        finish: vi.fn(),
        getError: vi.fn().mockReturnValue(0), // NO_ERROR
        isContextLost: vi.fn().mockReturnValue(false),
      };
    }
    return null;
  });
}

// Suppress console errors for expected warnings during tests
const originalError = console.error;
const originalWarn = console.warn;
beforeAll(() => {
  console.error = (...args: unknown[]): void => {
    const first = args[0];
    if (
      typeof first === 'string' &&
      (first.includes('Not implemented: HTMLFormElement.prototype.requestSubmit') ||
        first.includes('Could not parse CSS stylesheet'))
    ) {
      return;
    }
    (originalError as (...args: unknown[]) => void).apply(console, args);
  };

  // Intercept console.warn early so we can silence Three.js 'Multiple instances' warnings
  console.warn = (...args: unknown[]): void => {
    const first = args[0];
    if (typeof first === 'string' && first.includes('Multiple instances of Three.js')) {
      return; // ignore noisy, non-actionable warning in tests
    }
    (originalWarn as (...args: unknown[]) => void).apply(console, args);
  };

  // Also use Three.js setConsoleFunction to prevent additional spam where possible
  try {
    setConsoleFunction((level: 'log' | 'warn' | 'error', message: string, ...params: unknown[]) => {
      if (level === 'warn' && typeof message === 'string' && message.includes('Multiple instances of Three.js')) {
        return; // ignore this specific, non-actionable warning in tests
      }
      // Forward to the appropriate console method with safe typing
      if (level === 'log') {
        console.log(message, ...params);
      } else if (level === 'warn') {
        console.warn(message, ...params);
      } else if (level === 'error') {
        console.error(message, ...params);
      }
    });
  } catch {
    // ignore if three does not expose setConsoleFunction (very old versions)
  }
});



afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  try {
    setConsoleFunction(null as unknown as ((...args: unknown[]) => void) | null);
  } catch {
    // ignore
  }
});
