# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build, Test, and Lint Commands

```bash
npm run dev           # Start dev server (localhost:3000)
npm run build         # Production build (outputs to dist/)
npm test              # Run all Vitest tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint          # Lint with ESLint
npm run lint:fix      # Auto-fix linting issues
npm run typecheck     # TypeScript type check
npm run format        # Format with Prettier
```

After making code changes, always validate: `npm test && npm run lint && npm run typecheck`

## Architecture Overview

**3D Rendering Stack**: React Three Fiber (R3F) declaratively renders Three.js scenes. The `Canvas` component mounts WebGL context, and React components represent 3D objects.

**Scene Composition** (`SceneCanvas.tsx`):
- Lazy-loaded scene chunks for progressive loading via `requestIdleCallback`
- `SceneWorld` (houses, ground), `SceneAtmosphere` (sky, snow), `SceneLanterns`, `ScenePostProcessing`
- WebGL context loss handling with user feedback

**Fireworks System**:
- `FireworksManager` manages rockets and GPU-based particle explosions
- Custom `FireworksShaderMaterial` renders up to 4000 instanced particles
- Rocket physics in `src/utils/rocket.ts`, particle generation in `src/utils/fireworks.ts`
- Explosion shapes: burst, sphere, ring (randomly selected)

**Data Flow**:
- Houses call `onShootRocket` callback → `SceneCanvas` appends to `rockets` state array
- `FireworksManager` receives rockets, renders them, triggers explosion particles on target height
- Particle pool recycling via ring buffer cursor

**Performance Patterns**:
- Instanced mesh for particles (avoid per-particle draw calls)
- Shared geometry cache (`src/utils/threeCache.ts`)
- `DynamicResScaler` adjusts render resolution based on FPS
- Scene chunks load progressively during idle time

## Key File Locations

- `src/SceneCanvas.tsx` - Main scene orchestration, rocket state management
- `src/components/FireworksManager.tsx` - GPU particle system, rocket renderer
- `src/utils/fireworks.ts` - Particle creation functions (AoS and SoA variants)
- `src/utils/rocket.ts` - Rocket position stepping logic
- `src/types.ts` - Core type definitions (RocketData, ParticleData)
- `memory/` - Project memory bank with designs, tasks, and progress tracking

## Path Alias

`@/*` maps to `src/*` (e.g., `import { RocketData } from '@/types'`)

## Testing Notes

Tests use jsdom with comprehensive WebGL mocking (see `tests/vitest/setup.ts`). The setup mocks `requestIdleCallback` to run synchronously inside `act()` for testing lazy-loaded components.

## Memory Bank

The `/memory` folder maintains project context across sessions. Before starting non-trivial work, review:
- `memory/systemPatterns.md` - Architecture and design patterns
- `memory/activeContext.md` - Current work focus
- `memory/tasks/_index.md` - Task tracking
