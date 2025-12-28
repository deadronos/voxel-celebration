# TASK011 - Hotpath Performance Optimizations (Fireworks SoA + Render Loop Tuning)

**Status:** Completed  
**Added:** 2025-12-28  
**Updated:** 2025-12-28

## Original Request

“Look at recent additions and optimize performance: instanced rendering, caching/reuse/pooling, and reduce allocations in hot paths. Identify current hotpaths and optimize them further.”

## Summary

This task retroactively documents the performance pass focused on per-frame loops and the heaviest GPU effects.

Key outcomes:

- Fireworks moved from object-per-particle to packed typed buffers (SoA) with swap-remove compaction.
- Per-frame instanced mesh updates now write directly into typed attribute arrays and use `updateRanges`.
- Snowfall caches its position attribute/array once and updates via a stride loop.
- Aurora updates `uTime` directly via the uniforms object (no per-frame material lookup).
- Ice lake reflector resolution now scales with DPR and uses cheaper blur to reduce GPU pressure.

Design record: `memory/designs/DES006-runtime-performance-optimizations.md`.

## Thought Process

The dominant sources of runtime cost were:

1. CPU time in hot loops (fireworks particle simulation + instanced updates).
2. GC/allocations caused by explosion particle creation and per-particle object graphs.
3. GPU cost of extra render passes (reflector + blur).

The most impactful changes were the ones that reduce work per particle and remove allocations in steady state.

## Implementation Plan

- Identify active per-frame hotpaths (`useFrame`) and potential allocation sites.
- Replace fireworks particle storage with fixed-capacity typed arrays (SoA).
- Generate explosions directly into typed buffers (avoid per-particle allocations).
- Update instanced mesh attributes via direct typed-array writes + `updateRanges`.
- Apply smaller optimizations to other per-frame loops (snowfall + aurora).
- Tune the ice reflector quality based on DPR.
- Update/extend tests to match the new particle pipeline.

## Progress Tracking

**Overall Status:** Completed — 100%

| ID  | Description                                   | Status   | Updated    | Notes |
| --- | --------------------------------------------- | -------- | ---------- | ----- |
| 11.1 | Profile hotpaths and allocation sites         | Complete | 2025-12-28 | Fireworks, snow, aurora, reflector |
| 11.2 | Implement SoA buffers + explosion writer      | Complete | 2025-12-28 | `writeExplosionParticles` |
| 11.3 | Refactor `FireworksManager` to SoA pipeline   | Complete | 2025-12-28 | Swap-remove compaction |
| 11.4 | Optimize snowfall/aurora per-frame updates    | Complete | 2025-12-28 | Cached attrs + direct uniforms |
| 11.5 | Tune ice reflector resolution/blur by DPR     | Complete | 2025-12-28 | Reduced GPU cost |
| 11.6 | Update tests + validate                        | Complete | 2025-12-28 | Vitest + lint + typecheck |

## Progress Log

### 2025-12-28

- Implemented fireworks SoA simulation + in-place explosion writer.
- Refactored `FireworksManager` update loop to typed buffers + direct instanced attribute writes.
- Optimized snowfall attribute access and aurora uniform updates.
- Tuned ice lake reflector resolution/blur for better GPU performance.
- Updated tests to cover the new writer and pipeline.
- Added design documentation in `DES006`.

