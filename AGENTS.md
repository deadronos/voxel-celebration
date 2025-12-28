# AI Agents Guide for Voxel New Years Celebration

This document provides guidance for AI agents working on the Voxel New Years Celebration project.

## Quick Start for Agents

When working on this repository:

1. **Read the Copilot Instructions**: Start with [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for project-specific guidance
2. **Review Memory Bank**: Check the `/memory` folder for project context and current state
3. **Use Specialized Instructions**: Find detailed instructions in `.github/instructions/`
4. **Consider Subagents**: Leverage specialized agents in `.github/agents/` for specific tasks

## Project Context

This is a React + Three.js project showcasing an interactive 3D voxel-style New Year's celebration scene with fireworks and sky lanterns.

**Tech Stack**: React 19, Three.js, React Three Fiber, TypeScript, Vite, Vitest

## Memory Bank (`/memory` folder)

The memory bank maintains project context across sessions. Key files:

### Core Memory Files

- **`projectbrief.md`** - Project scope, goals, and acceptance criteria
- **`productContext.md`** - Why this exists, problems it solves, user needs
- **`activeContext.md`** - Current work focus and recent changes
- **`systemPatterns.md`** - Architecture and design patterns in use
- **`techContext.md`** - Technologies, setup, and constraints
- **`progress.md`** - What works, what's left, known issues
- **`tasks/`** - Individual task tracking with unique IDs
- **`designs/`** - Design specifications and decisions

### Using the Memory Bank

1. Review relevant files before starting work
2. Update `activeContext.md` with your current focus
3. Track tasks in the `tasks/` folder
4. Document architectural decisions in `systemPatterns.md`
5. Update `progress.md` with completed work

## Copilot Instructions

The main copilot instructions file is located at:

**[`.github/copilot-instructions.md`](.github/copilot-instructions.md)**

This file contains:

- Project overview and technology stack
- Development workflow and commands
- Code style and standards
- React and Three.js patterns
- Quality standards and validation steps

## Useful Instructions (`.github/instructions/`)

Find specialized guidance for different aspects of development:

### Language & Framework Specific

- **`reactjs.instructions.md`** - React 19 patterns and best practices
- **`typescript-5-es2022.instructions.md`** - TypeScript development guidelines
- **`nodejs-javascript-vitest.instructions.md`** - Node.js and Vitest testing

### Process & Patterns

- **`memory-bank.instructions.md`** - How to use the memory bank system
- **`spec-driven-workflow-v1.instructions.md`** - Specification-driven development
- **`taming-copilot.instructions.md`** - Controlling AI behavior
- **`tasksync.instructions.md`** - Task synchronization protocol

### Quality & Security

- **`performance-optimization.instructions.md`** - Performance best practices
- **`code-review-generic.instructions.md`** - Code review standards
- **`ai-prompt-engineering-safety-best-practices.instructions.md`** - AI safety

### DevOps & Tools

- **`github-actions-ci-cd-best-practices.instructions.md`** - CI/CD patterns
- **`playwright-typescript.instructions.md`** - E2E testing with Playwright
- **`markdown.instructions.md`** - Markdown documentation standards

### Other

- **`powershell.instructions.md`** - PowerShell scripting
- **`prompt.instructions.md`** - Prompt file guidelines

## Available Subagents (`.github/agents/`)

Consider delegating to specialized agents for specific tasks:

### Planning & Architecture

- **`planning-subagent.agent.md`** - Task planning and breakdown
- **`specification.agent.md`** - Requirements specification
- **`implementation-plan.agent.md`** - Implementation planning
- **`Conductor.agent.md`** - Orchestrating multiple agents

### Development

- **`expert-react-frontend-engineer.agent.md`** - React and frontend development
- **`implement-subagent.agent.md`** - Code implementation
- **`software-engineer-agent-v1.agent.md`** - General software engineering

### Quality & Review

- **`code-review-subagent.agent.md`** - Code review and quality checks
- **`debug.agent.md`** - Debugging assistance
- **`se-responsible-ai-code.agent.md`** - Responsible AI practices
- **`critical-thinking.agent.md`** - Critical analysis

### Specialized Roles

- **`se-technical-writer.agent.md`** - Documentation writing
- **`se-ux-ui-designer.agent.md`** - UX/UI design guidance
- **`se-system-architecture-reviewer.agent.md`** - Architecture review
- **`janitor.agent.md`** - Code cleanup and refactoring

### Advanced Agents

- **`4.1-Beast.agent.md`** - Advanced problem solving
- **`gpt-5-beast-mode.agent.md`** - Enhanced reasoning
- **`Thinking-Beast-Mode.agent.md`** - Deep analytical thinking
- **`gemini-king-mode.agent.md`** - Comprehensive analysis
- **`context7.agent.md`** - Extended context handling

### Creative

- **`simple-app-idea-generator.agent.md`** - Feature ideation

## Validation Steps

After making any code changes, **ALWAYS** run these commands to validate:

```bash
npm run test      # Run all tests with Vitest
npm run lint      # Check code quality with ESLint
npm run typecheck # Verify TypeScript types
```

All three must pass before considering your changes complete.

### Additional Validation

- Review changes against project goals in `memory/projectbrief.md`
- Ensure changes align with patterns in `memory/systemPatterns.md`
- Update relevant memory bank files with new context
- Test the app visually with `npm run dev` if UI changes were made

## Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Start development server (localhost:5173)
npm run build     # Build for production
npm run preview   # Preview production build
npm test          # Run tests
npm run test:watch # Run tests in watch mode
npm run lint      # Lint code
npm run lint:fix  # Auto-fix linting issues
npm run typecheck # Type check TypeScript
npm run format    # Format code with Prettier
npm run format:check # Check formatting
```

## Project Structure

```
voxel-celebration/
├── .github/
│   ├── agents/              # Specialized AI agents
│   ├── instructions/        # Detailed instruction files
│   ├── prompts/            # Prompt templates
│   ├── skills/             # Reusable skills
│   └── copilot-instructions.md  # Main copilot guidance
├── memory/                 # Memory bank (project context)
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── activeContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   ├── progress.md
│   ├── tasks/
│   └── designs/
├── src/                    # Source code
│   ├── components/        # React Three Fiber components
│   ├── utils/            # Utility functions
│   └── main.tsx          # Entry point
├── tests/                 # Test files
└── AGENTS.md              # This file
```

## Best Practices for Agents

1. **Context First**: Always review memory bank files before starting work
2. **Minimal Changes**: Make the smallest changes necessary to achieve the goal
3. **Test Driven**: Write or update tests for new functionality
4. **Document Decisions**: Update memory bank with architectural decisions
5. **Validate Everything**: Run test, lint, and typecheck before finishing
6. **Use Subagents**: Delegate to specialized agents when appropriate
7. **Follow Patterns**: Match existing code patterns and conventions
8. **Performance Aware**: Consider 3D rendering performance impact
9. **Type Safe**: Maintain strict TypeScript typing
10. **Incremental Progress**: Make small commits with clear messages

## Getting Help

1. **Project Context**: Check `/memory` folder
2. **How-To Guides**: Review `.github/instructions/`
3. **Specialized Help**: Use agents in `.github/agents/`
4. **Main Guidance**: Read `.github/copilot-instructions.md`
5. **Setup Issues**: See `README.md`

## Contributing as an Agent

When you complete work:

1. Ensure all validation passes (test, lint, typecheck)
2. Update relevant memory bank files
3. Document any new patterns or decisions
4. Create clear commit messages
5. Update task status in `memory/tasks/`

---

**Remember**: The goal is maintainable, performant, and delightful 3D experiences. Keep code clean, tests passing, and the scene running smoothly at 60fps!
