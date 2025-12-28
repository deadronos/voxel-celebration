# DES006: Runtime Performance Optimizations (Hotpaths)

**Status:** Accepted  
**Date:** 2025-12-28

## Context

The scene includes several per-frame update loops (fireworks, snowfall, shader time) and a GPU-heavy reflector pass (ice lake). The most visible performance risks are:

- GC churn from per-particle object allocation in fireworks/explosions.
- CPU overhead from per-instance update APIs (`setMatrixAt`/`setColorAt`) in tight loops.
- GPU pressure from high-resolution reflection + blur.

This design captures the decisions taken to keep the demo smooth (~60fps) while preserving the “maximalist celebration” visuals.

## Goals

- Minimize per-frame allocations (near-zero GC in steady state).
- Keep particle update loops CPU-light and cache-friendly.
- Reduce GPU cost for expensive full-screen/extra-pass effects without removing them.
- Preserve the existing, testable helpers where reasonable (avoid breaking the testing story).

## Current Hotpaths

1. **Fireworks particle simulation + instance updates**
   - Per-frame physics + instanced matrix/color updates for up to `MAX_PARTICLES`.
2. **Snowfall**
   - Per-frame update of a position buffer (`SNOW_COUNT` points).
3. **Ice lake reflections**
   - `MeshReflectorMaterial` incurs an additional render target + blur work each frame.

## Decisions

### 1) Fireworks simulation: fixed-capacity SoA (typed buffers)

Replace `ParticleData[]` (AoS object graph with `Vector3`/`Color`) with a fixed-capacity struct-of-arrays (SoA):

- `position`, `velocity`, `color`: `Float32Array(MAX_PARTICLES * 3)` (stride 3)
- `scale`, `life`, `decay`: `Float32Array(MAX_PARTICLES)`
- Maintain `particleCount` and compact the active set using **swap-remove**.

Rationale:

- Stable, predictable memory footprint.
- No per-particle object allocations at spawn time.
- Better cache locality in tight loops.

### 2) Fireworks spawning: write explosions directly into buffers

Introduce `writeExplosionParticles(...)` which fills the SoA buffers in-place and returns the number of particles written (clamped to remaining capacity).

Rationale:

- Avoids allocating `ParticleData` objects on each explosion.
- Keeps explosion generation deterministic/testable (accepts an optional `random`).

Note:

- `createExplosionParticles(...)` remains available for existing tests and for future configuration/preset work (see TASK006).

### 3) Rendering: direct instanced attribute writes

Instead of calling `mesh.setMatrixAt`/`mesh.setColorAt` in a hot loop:

- Write directly into `mesh.instanceMatrix.array` and `mesh.instanceColor.array`.
- Use `DynamicDrawUsage` and `updateRanges` to avoid uploading untouched parts of the buffer.
- Keep the updated data contiguous (`[0..count)`) due to swap-remove compaction, which fits `updateRanges` well.

Rationale:

- Lower per-instance overhead; avoids extra object/matrix plumbing.
- Tighter control over what data is uploaded each frame.

### 4) Snowfall: cache attribute handles once

Cache the `position` `BufferAttribute` and its `Float32Array` once on mount; update it with a stride loop.

Rationale:

- Less per-frame property chasing, fewer multiplications, and predictable memory access.

### 5) Ice lake reflections: tune quality by DPR

Scale reflector resolution with DPR (clamped) and reduce blur settings.

Rationale:

- Reflection passes are expensive; this yields a meaningful GPU win with minimal aesthetic loss.

## Trade-offs

- SoA + manual compaction is more complex and less ergonomic than object-per-particle.
- Debuggability is slightly reduced (arrays vs. objects).
- Keeping both `createExplosionParticles` and `writeExplosionParticles` duplicates some logic, but preserves compatibility and supports future preset/config work.

## Validation

- Unit tests cover buffer writer behavior (determinism + capacity clamping).
- `FireworksManager` tests validate rocket explosion triggers particle creation and the update loop culls dead/below-ground particles.
- Manual smoke: observe that multiple explosions do not introduce frame hitches from GC.

## Follow-ups (optional)

- Consider moving color variation to a small deterministic tweak (or fixed palettes) to improve predictability.
- If we need significantly more particles, explore GPU-driven particles (custom shader + buffer textures / transform feedback / compute-like approaches).
- Consolidate the explosion-shape logic to avoid drift between `createExplosionParticles` and `writeExplosionParticles`.

