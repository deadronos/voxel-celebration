# Product Context — Voxel New Years Celebration

## Why this project exists

This project is an educational and showcase app that demonstrates how to build a small, interactive 3D scene using React and Three.js (React Three Fiber). It’s intended to be approachable for frontend developers who want to learn about 3D rendering patterns, scene composition, and particle systems while also serving as a fun visual demo for portfolio or community sharing.

## Problems it solves

- Low barrier to entry for learning 3D in React (clear structure, small codebase).
- A ready-made example for building interactive particle effects (fireworks, lanterns) with predictable lifecycle and testable logic.
- Demonstrates combining common developer tooling (TypeScript, Vite, Vitest, ESLint) with R3F workflows.

## Target users & personas

- Frontend Engineers: want to learn Three.js patterns in a React environment.
- Educators and Workshop Hosts: need compact demo projects to teach R3F concepts.
- Designers/Artists: want to prototype stylized voxel visuals and lighting.
- Recruiters / Portfolio Viewers: view as a small, polished visual piece.

## User experience goals

- Fast startup and minimal friction to run locally (`npm install`, `npm run dev`).
- Smooth camera controls with sensible defaults (OrbitControls) and safe auto-rotate for demo mode.
- Visually pleasing fireworks and lantern effects with configurable parameters for reuse.
- Clear developer experience: typed props, documented interfaces, and tests where behavior matters.

## Acceptance / Success criteria

- Users can run the demo locally and interact with the scene.
- Core interactions (shoot rocket, spawn lantern) behave reliably and are covered by tests.
- Visual features meet a subjective quality bar (lighting, bloom, particle variety) and are stable across runs.
- Project is easy to fork and extend (well-named components and documented points-of-extension).

---

*Use this file to align feature and design decisions with user needs.*