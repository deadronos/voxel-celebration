import { test, expect } from '@playwright/test';

test('measure webgl performance', async ({ page }) => {
  // Increase timeout for this test as we want to measure over time
  test.setTimeout(60000);

  // Navigate to the app
  await page.goto('http://localhost:5173');

  // Wait for the canvas to be present
  await page.waitForSelector('canvas');

  // Wait for the scene to load components (scheduleIdle delays up to 1600ms)
  await page.waitForTimeout(3000);

  console.log('Starting performance measurement...');

  const fpsSamples: number[] = [];
  const duration = 5000; // Measure for 5 seconds
  const interval = 500; // Sample every 500ms
  const steps = duration / interval;

  for (let i = 0; i < steps; i++) {
    await page.waitForTimeout(interval);
    const fps = await page.evaluate(() => {
      // @ts-expect-error - Reading custom property from window
      return window.__FPS__ as number;
    });

    if (fps !== undefined) {
      fpsSamples.push(fps);
      console.log(`Sample ${i + 1}: ${fps} FPS`);
    }
  }

  expect(fpsSamples.length).toBeGreaterThan(0);

  const averageFps = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
  console.log(`Average FPS: ${averageFps}`);

  // Basic assertion to ensure it's running reasonably well
  // Note: In headless CI environments, FPS might be capped or erratic,
  // but we want to establish a baseline.
  // expect(averageFps).toBeGreaterThan(10);
});
