# Voxel Celebration 🎆

**Voxel Celebration** is an interactive 3D voxel-style New Year's celebration demo built with **React**, **TypeScript**, and **Three.js** (via React Three Fiber).

The demo showcases a cozy voxel village, dynamic fireworks, floating sky lanterns, and particle/post-processing effects — designed to be easy to extend and perform well in real time.

---

## Highlights ✅

- Configurable fireworks system (rockets, bursts, colors, timing)
- Sky lanterns that float and glow
- Voxel houses and environment components
- Particle systems and post-processing for cinematic visuals
- Performance-minded (instancing, memoization, efficient updates)

---

## Tech stack 🔧

- React + TypeScript
- Three.js + React Three Fiber (@react-three/fiber)
- @react-three/drei and postprocessing helpers
- Vite for dev server and build
- Vitest for unit tests
- ESLint + Prettier for code style

---

## Quick start ⚡

**Prerequisites:** Node.js (18+ recommended)

1. Install dependencies

```bash
npm install
```

1. Run the dev server

```bash
npm run dev
# then open http://localhost:5173
```

1. Build & preview

```bash
npm run build
npm run preview
```

1. Tests / lint / typecheck / format

```bash
npm test
npm run lint
npm run typecheck
npm run format
```

---

## Project layout 📁

- `src/` — application source
  - `App.tsx`, `main.tsx` — entry
  - `components/` — scene components (e.g., `FireworksManager.tsx`, `SkyLantern.tsx`, `Environment.tsx`, `House.tsx`, `VoxelUtils.tsx`)
  - `utils/` — fireworks & rocket logic (`fireworks.ts`, `rocket.ts`)
- `tests/vitest/` — unit tests (`fireworks.test.ts`, `rocket.test.ts`)
- `memory/` — project memory bank (requirements, designs, tasks, progress)

---

## Development notes 💡

- To change fireworks behaviour, edit `src/utils/fireworks.ts` and `src/components/FireworksManager.tsx`.
- Keep visual changes performant: prefer instancing for repeated geometry and minimize per-frame allocations.
- Add tests for deterministic logic in `tests/vitest/` when modifying particle/rocket behaviour.

---

## Deployment 🚀

- This repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` that builds the site via `npm run build`, uploads the generated `dist/` artifact with `actions/upload-pages-artifact@v3`, and deploys it using `actions/deploy-pages@v4`.
- The workflow **runs when a tag matching `v*`** (for example `v1.0.0`) is pushed to the repository — a tag push will trigger a build and deployment.
- Make sure your repository Pages settings allow deployments from GitHub Actions (the action will create a Pages deployment). If you prefer, you can protect the `github-pages` environment in repository settings.
- After a successful deployment the site should be available at: `https://deadronos.github.io/voxel-celebration/` (production builds use the repo-path base).
- The `vite` config is set so production builds will use the base `'/voxel-celebration/'` (the dev server still uses `/`).

---

## Contributing 🤝

1. Open an issue describing the feature or bug.
2. Create a PR with a clear description and add tests for logic changes.
3. Ensure `npm test`, `npm run lint`, and `npm run typecheck` pass locally before requesting review.
4. Update `memory/` with designs or task notes for non-trivial changes.

---

## License & credits

See `LICENSE` (if present) for license details. The project is inspired by voxel art and fireworks simulations.

---

If you'd like, I can also add an example screenshot or short demo GIF to the README — tell me what you'd prefer to show! 🎇
