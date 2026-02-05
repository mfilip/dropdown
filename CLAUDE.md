# Claude Directions

Guidelines for AI assistants working on this repository.

## Project Overview

This is a lightweight dropdown positioning library for input/textarea elements. The codebase is intentionally minimal.

**Tech Stack:**
- TypeScript
- tsup (bundler)
- semantic-release (automated releases)

## Directory Structure

```
src/
  index.ts       # Main library - all exports
demo/
  index.html     # Interactive demo
dist/            # Built output (gitignored)
.github/
  workflows/
    ci.yml       # Build/test on PRs
    release.yml  # Semantic release on main
```

## Development Commands

```bash
npm install      # Install dependencies
npm run build    # Build library
npm run dev      # Build with watch mode
npm run demo     # Serve demo at localhost:3000
```

## Making Changes

1. **Keep it minimal** - This library is intentionally small (~4KB). Avoid adding dependencies.
2. **Type everything** - All exports must have TypeScript types.
3. **Test in demo** - Run `npm run demo` and test changes at `/demo/`.

## Commit Message Format

This repo uses **semantic-release** with **Conventional Commits**. Commit messages determine version bumps automatically.

### Commit Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `fix` | Bug fixes | Patch (1.0.0 → 1.0.1) |
| `feat` | New features | Minor (1.0.0 → 1.1.0) |
| `feat!` | Breaking changes | Major (1.0.0 → 2.0.0) |
| `docs` | Documentation only | No release |
| `chore` | Maintenance tasks | No release |
| `refactor` | Code refactoring | No release |
| `style` | Formatting changes | No release |
| `test` | Adding tests | No release |

### Examples

```bash
# Bug fix - triggers patch release
git commit -m "fix: correct dropdown position when parent is scrollable"

# New feature - triggers minor release
git commit -m "feat: add maxHeight option to limit dropdown height"

# Breaking change - triggers major release
git commit -m "feat!: rename computePosition to getPosition"

# Or with body for breaking change
git commit -m "feat: change API signature

BREAKING CHANGE: computePosition now requires options object"

# No release
git commit -m "docs: update README examples"
git commit -m "chore: update dev dependencies"
```

### Scope (Optional)

You can add a scope for clarity:

```bash
git commit -m "fix(position): handle RTL layouts correctly"
git commit -m "feat(auto-update): add animationFrame option"
```

## Pull Request Flow

1. Create feature branch from `main`
2. Make changes with conventional commits
3. Push and create PR
4. CI runs on PR (build + type check)
5. Merge to `main` triggers semantic-release

## Key Functions

- `computePosition(reference, floating, config)` - Calculate dropdown position
- `applyPosition(floating, position)` - Apply styles to element
- `autoUpdate(reference, floating, update, options)` - Handle scroll/resize
- `createDropdown(reference, floating, config)` - High-level API with show/hide

## Adding Features

When adding new options:

1. Add to the appropriate interface (`PositionConfig` or `AutoUpdateOptions`)
2. Implement in the relevant function
3. Update demo to showcase the feature
4. Use a `feat:` commit message
