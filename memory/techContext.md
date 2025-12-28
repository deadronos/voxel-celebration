# Tech Context — Voxel New Years Celebration

## Primary technologies

- **Framework**: React (v19.x)
- **3D**: Three.js (via `@react-three/fiber`) and `@react-three/drei`
- **Bundler / Dev Server**: Vite
- **Language**: TypeScript
- **Testing**: Vitest (unit tests)
- **Linting/Formatting**: ESLint, Prettier
- **Postprocessing**: `@react-three/postprocessing` (Bloom, etc.)

## Dev environment

- Node.js (recommended LTS, e.g., 18+ or the version compatible with dependencies from `package.json`).
- Standard dev commands:
  - `npm install` — install dependencies
  - `npm run dev` — start local dev server (Vite)
  - `npm run build` — build production bundle
  - `npm run preview` — preview production bundle locally
  - `npm run test` — run vitest tests
  - `npm run lint` / `npm run lint:fix` — linting
  - `npm run format` / `npm run format:check` — formatting

## Testing strategy

- Use Vitest for unit tests and small integration tests of logic that can run without a browser (e.g., helpers, deterministic parts of rocket lifecycle).
- For scene-level checks, prefer deterministic helpers and snapshot-like assertions rather than brittle pixel tests.
- Playwright or Puppeteer could be added for visual and accessibility smoke tests if needed.

## Performance & profiling

- Keep scene complexity reasonable (limit particle/mesh counts). Use instancing or batched particles when needed.
- Use browser profiling tools and React DevTools/three.js performance helpers to locate bottlenecks.

## Build and CI suggestions

- Run `lint`, `format:check`, and `test` in CI.
- Add a basic Lighthouse/trace or visual smoke check for the built preview if automated visual regression is desired.

## Environment / Secrets

- `README.md` references a `GEMINI_API_KEY` for AI Studio view; this is optional for running the 3D demo locally and should be stored in `.env.local` when needed.

## Recommended conventions

- Keep components focused and typed.
- Favor small, pure helper functions for logic that is easier to test outside the renderer.

---

_Update this file if dependencies or commands change._
