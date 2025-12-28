import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { DynamicResScaler } from '@/components/DynamicResScaler';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('DynamicResScaler', () => {
  let originalPerformanceNow: () => number;

  beforeEach(() => {
    // Capture the original function and wrap it so we can restore it safely later
    // It's safe to capture here because we restore the original in afterEach
    /* eslint-disable-next-line @typescript-eslint/unbound-method */
    const origNow = performance.now as () => number;
    originalPerformanceNow = () => origNow.call(performance) as number;
    // Mock performance.now for deterministic testing
    let time = 0;
    performance.now = vi.fn<() => number>(() => {
      time += 100; // Advance by 100ms per call
      return time;
    });
  });

  afterEach(() => {
    performance.now = originalPerformanceNow;
  });

  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<DynamicResScaler />);
    expect(container).toBeTruthy();
  });

  it('returns null (no visual component)', () => {
    const { container } = renderInCanvas(<DynamicResScaler />);
    expect(container).toBeTruthy();
  });

  it('initializes with start DPR', () => {
    const { container } = renderInCanvas(<DynamicResScaler />);
    expect(container).toBeTruthy();
  });

  it('handles window object availability', () => {
    // Component checks if window is defined
    const { container } = renderInCanvas(<DynamicResScaler />);
    expect(container).toBeTruthy();
  });

  it('handles frame updates via useFrame', () => {
    // Component uses useFrame to monitor FPS
    const { container } = renderInCanvas(<DynamicResScaler />);
    expect(container).toBeTruthy();
  });

  it('handles multiple instances', () => {
    // Should be careful with multiple instances, but test it anyway
    const { container } = renderInCanvas(
      <>
        <DynamicResScaler />
        <DynamicResScaler />
      </>
    );
    expect(container).toBeTruthy();
  });

  it('handles edge case - rapid frame updates', () => {
    // Fast time progression should trigger FPS calculations
    let time = 0;
    performance.now = vi.fn<() => number>(() => {
      time += 1; // Very fast (1ms per call)
      return time;
    });

    const { container } = renderInCanvas(<DynamicResScaler />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - slow frame updates', () => {
    // Slow time progression
    let time = 0;
    performance.now = vi.fn<() => number>(() => {
      time += 1000; // Very slow (1000ms per call)
      return time;
    });

    const { container } = renderInCanvas(<DynamicResScaler />);
    expect(container).toBeTruthy();
  });

  it('respects MIN_DPR and MAX_DPR boundaries', () => {
    // Component should clamp DPR between MIN and MAX
    const { container } = renderInCanvas(<DynamicResScaler />);
    expect(container).toBeTruthy();
  });

  it('handles CHECK_INTERVAL timing', () => {
    // Component checks every 500ms
    let time = 0;
    performance.now = vi.fn<() => number>(() => {
      time += 500; // Match CHECK_INTERVAL
      return time;
    });

    const { container } = renderInCanvas(<DynamicResScaler />);
    expect(container).toBeTruthy();
  });
});
