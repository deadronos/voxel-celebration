# System Patterns — Voxel New Years Celebration

This document captures the high-level architecture, component responsibilities, and recurring design patterns used in the codebase.

## High-level architecture

- **Frontend-only, single-page app** built with React + Vite.
- **Rendering**: `@react-three/fiber` (R3F) mounts a `Canvas` and renders the 3D scene. React components represent scene objects.
- **Core rendering and logic separation**: visual representation (mesh, material) is separated from lifecycle/state logic (e.g., rocket manager maintains rocket list and passes props to renderers).
- **Main orchestration**: `App.tsx`/`Scene` manages high-level state (rockets array) and composes the scene from smaller components.

## Key components & responsibilities

- `App.tsx` / `Scene`
  - Composes the global canvas, lighting, fog, and scene groups.
  - Houses top-level state (e.g., `rockets`) and callbacks to add/remove rockets.

- `components/Environment`
  - Implements ground, trees, street lights, and other static props.

- `components/House`
  - Voxel-based house component with configurable size and `onShootRocket` callback.
  - Houses can spawn rockets via the provided callback (decouples UI and rocket manager).

- `components/FireworksManager`
  - Receives `rockets` + `removeRocket` and runs the render/update lifecycle of explosion particles.
  - Encapsulates particle spawning and animations so other components don’t need to manage the lifecycle.

- `components/SkyLantern`
  - Lightweight floating object with simple behavior and lifecycle.

- Utilities
  - `VoxelUtils.tsx`, constants, and small helpers centralize repeated code.

## Design patterns used

- **Manager pattern**: centralized manager (e.g., `FireworksManager`) coordinates create/update/destroy logic for transient objects like rockets and particles.
- **Props + callback flow**: upward data flow for events (house calls `onShootRocket` → `Scene` appends to rockets array); `FireworksManager` uses callbacks to notify when rockets complete and can be removed.
- **Small, focused components**: single responsibility for each component (render + lightweight behavior), aiding reuse and testing.
- **Separation of concerns**: rendering code kept in R3F components, logic kept in hooks and manager components where appropriate.

## Testability & Observability

- Logic-heavy functions should be pure where possible and covered by unit tests (e.g., rocket lifecycle helpers).
- Visual assertions for complex render behavior should use snapshot-like expectations or abstracted deterministic helpers (i.e., test the particle generator config rather than pixel matching).

## Extension points

- `FireworksManager` configuration for different explosions/particle presets.
- `House` props to expose more interaction hooks.
- A plugin-like registry for scene decorations or event probes.

---

_Keep this file updated as architecture evolves and when major design decisions are made._
