# DES004: Page Load Optimization

**Status:** Accepted  
**Date:** 2025-12-28

## Context

Initial page load was dominated by Three.js/R3F/postprocessing bundles and GPU-heavy scene setup, delaying first paint and increasing the risk of WebGL context loss on lower-end devices.

## Goals

- Render the HTML/CSS shell immediately while heavy 3D bundles load.
- Stage expensive 3D work so the GPU is not saturated during startup.
- Preserve visual quality once the scene is fully hydrated.
- Add a user-visible fallback for WebGL context loss.

## Decisions

1. **Code-split the scene** into lazy-loaded chunks:
   - `SceneWorld`, `SceneAtmosphere`, `SceneLanterns`, `ScenePostProcessing`, `SceneControls`, and `FireworksManager`.
2. **Staged hydration**:
   - Mount a minimal first-paint ground immediately.
   - Enable chunks in a timed, idle-friendly sequence (world → atmosphere → lanterns → fireworks → postprocessing).
3. **Idle prefetch** of chunk modules after the initial render to reduce interaction stalls.
4. **GPU pressure reduction**:
   - Start with conservative DPR (`dpr=1`) and allow `DynamicResScaler` to ramp up.
   - Defer Bloom/postprocessing until later in the hydration sequence.
5. **WebGL context loss handling**:
   - Listen for `webglcontextlost` and present a user-visible overlay recommending reload.

## Trade-offs

- Slightly more complexity in scene orchestration.
- Postprocessing is delayed by design; visuals settle in after hydration completes.
- A small delay before fireworks/lanterns appear is acceptable to improve overall startup smoothness.

## Validation

- Verify initial HTML fallback renders before the 3D bundles load.
- Confirm progressive hydration steps in the browser (no long main-thread stalls).
- Verify that context loss displays a clear overlay.
- Ensure the full scene becomes visually identical after hydration completes.

## Follow-ups

- Consider a low-end “safe mode” (disable shadows/postprocessing) on repeated context loss.
- Tune star/particle counts for low-tier devices if context loss persists.
