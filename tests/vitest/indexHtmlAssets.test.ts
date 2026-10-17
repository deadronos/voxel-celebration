import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const publicDir = path.join(projectRoot, 'public');

const html = readFileSync(path.join(projectRoot, 'index.html'), 'utf8');

/**
 * Root-absolute asset references, e.g. href="/favicon.svg" or src="/src/main.tsx".
 * Vite resolves these against the `public/` directory (or the project root) and
 * rewrites them with the configured base at build time, so a reference with no
 * matching file silently 404s in production.
 */
const rootAbsoluteRefs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((match) => match[1]);

const resolvesToAFile = (ref: string) =>
  existsSync(path.join(publicDir, ref)) || existsSync(path.join(projectRoot, ref));

describe('index.html asset references', () => {
  it('resolves every root-absolute reference to a real file', () => {
    const unresolved = rootAbsoluteRefs.filter((ref) => !resolvesToAFile(ref));

    expect(unresolved).toEqual([]);
  });

  it('points the favicon at an existing SVG icon', () => {
    const iconRef = /<link[^>]*rel="icon"[^>]*href="([^"]+)"/.exec(html)?.[1];

    expect(iconRef).toBeDefined();
    expect(iconRef).toMatch(/\.svg$/);
    expect(iconRef && resolvesToAFile(iconRef)).toBe(true);
  });
});

type WebManifest = { icons?: { src: string }[] };

const readManifest = (): WebManifest =>
  JSON.parse(readFileSync(path.join(publicDir, 'site.webmanifest'), 'utf8')) as WebManifest;

const manifestIconSources = () => (readManifest().icons ?? []).map((icon) => icon.src);

describe('site.webmanifest', () => {
  it('references icon files that sit next to it in public/', () => {
    expect(manifestIconSources().length).toBeGreaterThan(0);

    const missing = manifestIconSources().filter((src) => !existsSync(path.join(publicDir, src)));

    expect(missing).toEqual([]);
  });

  it('keeps icon paths relative, because Vite does not rewrite files in public/', () => {
    // A root-absolute path here would survive the build untouched and 404 under
    // the deployed base path, unlike references in index.html which Vite rewrites.
    const rootAbsolute = manifestIconSources().filter((src) => src.startsWith('/'));

    expect(rootAbsolute).toEqual([]);
  });
});
