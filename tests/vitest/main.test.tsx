import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('main entrypoint', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('creates a root and renders <App /> into #root', async () => {
    const renderSpy = vi.fn();
    const createRootSpy = vi.fn(() => ({ render: renderSpy }));

    vi.doMock('react-dom/client', () => ({ createRoot: createRootSpy }));
    vi.doMock('@/App', () => ({ default: () => null }));

    await import('@/main');

    const rootEl = document.getElementById('root');
    expect(createRootSpy).toHaveBeenCalledWith(rootEl);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('throws a clear error when #root is missing', async () => {
    document.body.innerHTML = '';

    vi.doMock('react-dom/client', () => ({ createRoot: vi.fn() }));
    vi.doMock('@/App', () => ({ default: () => null }));

    await expect(import('@/main')).rejects.toThrow(/Could not find root element/i);
  });
});
