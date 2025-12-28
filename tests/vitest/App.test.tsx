import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import App from '@/App';

describe('App', () => {
  it('renders without crashing - happy path', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders header with title', () => {
    const { getAllByText } = render(<App />);
    const titleElements = getAllByText('Happy New Year');
    expect(titleElements.length).toBeGreaterThan(0);
  });

  it('renders subtitle', () => {
    const { getAllByText } = render(<App />);
    const subtitleElements = getAllByText('Voxel Celebration');
    expect(subtitleElements.length).toBeGreaterThan(0);
  });

  it('displays loading fallback initially', () => {
    const { getAllByText } = render(<App />);
    const loadingElements = getAllByText('Loading scene...');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders with Suspense wrapper', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders main container div', () => {
    const { container } = render(<App />);
    const mainDiv = container.querySelector('.w-full.h-full.relative');
    expect(mainDiv).toBeTruthy();
  });

  it('renders header with correct styling classes', () => {
    const { container } = render(<App />);
    const header = container.querySelector('.text-4xl');
    expect(header).toBeTruthy();
  });

  it('header is positioned absolutely at top', () => {
    const { container } = render(<App />);
    const headerContainer = container.querySelector('.absolute.top-5');
    expect(headerContainer).toBeTruthy();
  });

  it('header is centered horizontally', () => {
    const { container } = render(<App />);
    const headerContainer = container.querySelector('.text-center');
    expect(headerContainer).toBeTruthy();
  });

  it('header is pointer-events-none (non-interactive)', () => {
    const { container } = render(<App />);
    const headerContainer = container.querySelector('.pointer-events-none');
    expect(headerContainer).toBeTruthy();
  });

  it('handles multiple renders without errors', () => {
    const { rerender } = render(<App />);
    expect(() => rerender(<App />)).not.toThrow();
  });
});
