## Repository purpose

- Build and deploy a GitHub pages static web site
- Help me learn React and TailwindCSS

## Tech Stack

- Framework: React
- Language: Typescript
- Package Manager: bun
- Runtime: bun (attempt `bun --bun` if incorrect Node version is reported)

## Common commands

- Install deps: `bun install`
- Typecheck: `bun run build`
- Lint: `bun run lint`
- Run tests: `bun test`
- Run tests matching a name: `node --test --test-name-pattern "pattern"`

## Testing Guidelines

- Use TDD: create small, understandable, self-documenting tests for all new component code and present these tests to elicit confirmation of approach from me
- Tests should be deterministic and isolated

### ✅ Always
- Run linting and testing before committing
- List only human authors in git commits

### ⚠️ Ask First
- Adding new dependencies

### 🚫 Never
- Commit secrets or `.env` files
- Force push to main
