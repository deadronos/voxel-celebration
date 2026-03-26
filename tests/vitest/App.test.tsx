import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

// App renders SceneCanvas inside <Suspense/>. In unit tests we don't need to load the 3D scene,
// and letting the lazy scene resolve can trigger noisy "not wrapped in act" warnings.
const pendingSceneImport = new Promise<never>(() => {});

vi.mock('@/SceneCanvas', () => ({
  default: function SceneCanvasMock() {
    throw pendingSceneImport;
  },
}));

import App, {
  DEFAULT_GREETING,
  MAX_GREETING_LENGTH,
  getGreetingFromSearch,
  sanitizeGreeting,
} from '@/App';

describe('App', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('uses the default greeting when the URL parameter is missing', () => {
    expect(getGreetingFromSearch('')).toBe(DEFAULT_GREETING);
  });

  it('uses the greeting URL parameter when provided', () => {
    expect(getGreetingFromSearch('?greeting=Happy%20Birthday')).toBe('Happy Birthday');
  });

  it('sanitizes greetings by stripping quotes, angle brackets, and control characters', () => {
    expect(sanitizeGreeting(' "Happy <Birthday>\n" ')).toBe('Happy Birthday');
  });

  it('strips invisible bidi and zero-width characters', () => {
    expect(sanitizeGreeting('\u202E\u200BHappy\u2060 Birthday')).toBe('Happy Birthday');
  });

  it('falls back to the default greeting when sanitization removes all content', () => {
    expect(sanitizeGreeting('""')).toBe(DEFAULT_GREETING);
  });

  it('limits overly long greeting text', () => {
    const longGreeting = 'Celebrate '.repeat(20);
    const sanitizedGreeting = sanitizeGreeting(longGreeting);

    expect(longGreeting.length).toBeGreaterThan(MAX_GREETING_LENGTH);
    expect(sanitizedGreeting.length).toBeLessThanOrEqual(MAX_GREETING_LENGTH);
    expect(sanitizedGreeting.startsWith('Celebrate Celebrate')).toBe(true);
  });

  it('renders without crashing - happy path', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders header with title', () => {
    const { getAllByText } = render(<App />);
    const titleElements = getAllByText(DEFAULT_GREETING);
    expect(titleElements.length).toBeGreaterThan(0);
  });

  it('renders a sanitized greeting from the URL parameter', () => {
    window.history.pushState({}, '', '/?greeting=%22Happy%20%3CBirthday%3E%22');

    const { getAllByText } = render(<App />);
    const titleElements = getAllByText('Happy Birthday');

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
