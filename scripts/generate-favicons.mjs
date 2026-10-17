#!/usr/bin/env node
/**
 * Rasterises `public/favicon.svg` into the PNG fallbacks using the Chromium that
 * Playwright already installs, so no extra image tooling is required.
 *
 * Usage: node scripts/generate-favicons.mjs
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(projectRoot, 'public');
const svg = readFileSync(path.join(publicDir, 'favicon.svg'), 'utf8');

// Opaque background so the PNGs are full-bleed: iOS masks its own corners, and
// the favicon fallback avoids transparent-corner artefacts on older browsers.
const background = '#050510';

const targets = [
  { file: 'favicon-32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
];

const browser = await chromium.launch();
try {
  for (const { file, size } of targets) {
    const page = await browser.newPage({
      viewport: { width: size, height: size },
      deviceScaleFactor: 1,
    });

    await page.setContent(
      '<!doctype html><meta charset="utf-8">' +
        `<style>html,body{margin:0;height:100%;background:${background}}` +
        'svg{display:block;width:100%;height:100%}</style>' +
        svg
    );

    await page.screenshot({ path: path.join(publicDir, file) });
    await page.close();

    console.log(`wrote public/${file} (${size}x${size})`);
  }
} finally {
  await browser.close();
}
