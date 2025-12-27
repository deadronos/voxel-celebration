# GitHub Copilot Instructions for Voxel New Years Celebration

## Project Overview

This is an interactive 3D voxel-style New Year's celebration demo built with React, Three.js, and React Three Fiber. The project showcases a village scene with fireworks, sky lanterns, and other festive effects.

## Technology Stack

- **Frontend Framework**: React 19.2.3
- **3D Rendering**: Three.js with React Three Fiber (@react-three/fiber)
- **3D Utilities**: @react-three/drei, @react-three/postprocessing
- **Build Tool**: Vite
- **Language**: TypeScript 5.9+ targeting ES2022
- **Testing**: Vitest
- **Linting**: ESLint with TypeScript, React, and accessibility plugins
- **Formatting**: Prettier

## Development Workflow

### Key Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests with Vitest
- `npm run lint` - Lint code with ESLint
- `npm run typecheck` - Type check with TypeScript
- `npm run format` - Format code with Prettier

### Before Completing Any Task

After making code changes, always validate by running:

1. `npm run test` - Ensure all tests pass
2. `npm run lint` - Ensure no linting errors
3. `npm run typecheck` - Ensure no TypeScript errors

## Code Style and Standards

### TypeScript

- Target ES2022 with modern features
- Use strict type checking
- Prefer functional components with hooks
- Use proper typing for React Three Fiber components
- Path aliases: `@/*` maps to `./src/*`

### React and Three.js Patterns

- Use React Three Fiber's declarative approach
- Leverage hooks: `useFrame`, `useThree`, `useState`, `useRef`
- Keep components focused and modular
- Document complex 3D logic and particle systems
- Follow React 19 best practices

### Component Structure

- **Environment Components**: Ground, sky, lighting, atmosphere
- **Interactive Elements**: Fireworks, sky lanterns, particles
- **Scene Management**: Camera controls, post-processing effects
- **Utilities**: Math helpers, type definitions, constants

## Memory Bank

This project uses a memory bank system located in `/memory` folder to maintain context across sessions:

### Core Files

- `projectbrief.md` - Project scope and goals
- `productContext.md` - Why this exists and user needs
- `activeContext.md` - Current work focus
- `systemPatterns.md` - Architecture and design patterns
- `techContext.md` - Technologies and setup
- `progress.md` - Current status and known issues
- `tasks/` - Individual task tracking with unique IDs
- `designs/` - Design specifications

### Using the Memory Bank

When working on features or fixes:

1. Review relevant memory bank files for context
2. Update `activeContext.md` with current work
3. Track tasks in `tasks/` folder
4. Document significant patterns in `systemPatterns.md`
5. Update `progress.md` with accomplishments

## Additional Resources

### Instructions

Find detailed instructions in `.github/instructions/`:

- `reactjs.instructions.md` - React development patterns
- `typescript-5-es2022.instructions.md` - TypeScript guidelines
- `nodejs-javascript-vitest.instructions.md` - Testing with Vitest
- `memory-bank.instructions.md` - Memory bank usage
- `performance-optimization.instructions.md` - Performance best practices
- And more specialized instructions for specific domains

### Subagents

Consider using specialized agents in `.github/agents/` for specific tasks:

- `expert-react-frontend-engineer.agent.md` - React/frontend expertise
- `code-review-subagent.agent.md` - Code review assistance
- `planning-subagent.agent.md` - Task planning
- `implement-subagent.agent.md` - Implementation assistance
- `debug.agent.md` - Debugging help
- `se-technical-writer.agent.md` - Documentation
- And many more specialized agents

## Project-Specific Guidelines

### Performance

- Optimize particle systems and effects for 60fps
- Use instancing for repeated geometry
- Leverage memoization and React optimization patterns
- Monitor bundle size and lazy-load when appropriate

### Testing

- Write unit tests for utility functions and logic
- Test particle lifecycle and behavior deterministically
- Mock Three.js objects when needed
- Focus on testable business logic

### Accessibility

- Provide alternative experiences where possible
- Consider performance on different hardware
- Document controls and interactions

## Getting Help

1. Check existing instructions in `.github/instructions/`
2. Review memory bank context in `/memory`
3. Consult specialized agents in `.github/agents/`
4. Review the README.md for setup and running instructions

## Quality Standards

- All code must pass linting (`npm run lint`)
- All tests must pass (`npm run test`)
- Type checking must pass (`npm run typecheck`)
- Follow existing code patterns and conventions
- Document complex 3D math or particle behavior
- Keep components small and focused
