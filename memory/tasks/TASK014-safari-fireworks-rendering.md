# TASK014 - Fix missing fireworks explosions in Safari/WebKit

**Status:** Completed
**Added:** 2026-08-01
**Updated:** 2026-08-01

## Original Request

Deployed site renders rocket explosions in Chrome/other browsers, but not in
Safari. Debug and fix.

## Root Cause

The fireworks particle mesh used a custom `THREE.ShaderMaterial` that performed
the particle physics on the GPU (custom instanced attributes:
`aStartPosition`, `aVelocity`, `aColor`, `aStartTime`, `aDuration`,
`aBaseScale`) and always drew all 8000 instances, with dead particles collapsed
to zero-scale degenerate triangles.

When the scene is rendered through the post-processing pipeline
(`EffectComposer` + Bloom), WebKit's Metal backend drops those custom-shader
instanced draws: the whole particle mesh (trails and explosions) silently
disappears while the rest of the scene — including the standard-material
instanced rocket mesh — renders normally. Without the composer the particles
rendered, which is why Chrome (and the isolated harness) looked fine.

## Fix

Reworked the particle path in `src/components/FireworksManager.tsx`:

1. **CPU simulation** — particle state (start position, velocity, color,
   duration, base scale) is stored in typed arrays and advanced per frame on
   the CPU, using the same physics/scale math the shader used.
2. **Standard material** — the particle mesh now uses a shared
   `THREE.MeshBasicMaterial` (`toneMapped: false`), with per-instance
   transforms written into `instanceMatrix` and colors into `instanceColor`
   (`setMatrixAt`/`setColorAt`), exactly like the rocket mesh that already
   rendered correctly on Safari.
3. **Compact draw** — live particles are packed to a contiguous prefix each
   frame and `mesh.count` is set to that count, so the draw contains only
   non-degenerate, visible instances (also a per-frame draw-call win over the
   old always-8000-instance draw).

## Verification

- Reproduced with Playwright WebKit (Safari engine): with the old shader the
  explosion produced no visible pixels through the composer; with the fix the
  sky-region bright-pixel count spikes from a ~900 baseline to ~12,900 during
  bursts.
- Confirmed the same build still renders bursts in Chromium.
- `npm run test` (90 tests), `npm run lint`, `npm run typecheck`, and
  `npm run format:check` all pass.
