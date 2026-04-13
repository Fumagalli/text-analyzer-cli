# text-analyzer-cli: Agent Instructions

> Instruções para qualquer agente trabalhando neste projeto. Siga este padrão.

## 📊 Project Status

**Current State**: ✅ PRODUCTION-READY (M5 Complete)
- Refactored from Portuguese to English (2026-04-13)
- 125/125 tests passing
- 100% code coverage
- All gates: ✅ PASSING

**Mode**: MAINTENANCE + ENHANCEMENT
- Bug fixes: Implement and patch
- New features: Follow feature spec template
- Refactors: Test thoroughly, atomic commits

## 🗂️ Key Documentation (READ IN THIS ORDER)

### Project Foundation
1. **Vision & Goals**: `.specs/project/PROJECT.md`
2. **Architectural Decisions**: `.specs/project/STATE.md`
3. **Roadmap**: `.specs/project/ROADMAP.md`

### Development Guide
4. **Workflow Pattern**: `/WORKFLOW.md` (in parent directory)
5. **Development Facts**: `/memories/repo/text-analyzer-cli-facts.md`

### Feature Templates
6. **Feature Template**: `.specs/features/TEMPLATE/`
7. **Last Completed**: `.specs/features/refactor-to-english/` (reference)
8. **Old Features**: `.specs/_archive/` (historical reference)

## 🚀 Starting New Work

### For Bug Fixes
```
1. Describe bug in .specs/features/bug-fix-[name]/FEATURE-SPEC.md
2. Design solution in DESIGN.md
3. List tasks in TASKS.md
4. Implement atomically: src/ changes → test → commit
5. Update /memories/repo/ with learnings
```

### For New Features
```
1. Copy .specs/features/TEMPLATE/ → .specs/features/[feature-name]/
2. Write requirements in FEATURE-SPEC.md
3. Write design in DESIGN.md (architecture, dependencies)
4. Write tasks in TASKS.md (atomic steps)
5. Execute: implement → test → commit
6. Update /memories/repo/ and STATE.md
```

### For Refactors
```
1. Same as bug fixes but scope: "refactor(scope): description"
2. MUST: Maintain 100% test coverage
3. MUST: All tests pass before commit
4. Document decision in STATE.md if architectural
```

## ✅ Quality Gates (EVERY COMMIT)

**MUST PASS**:
```bash
npm test           # All tests passing
npm run lint       # Zero code errors
npm run typecheck  # Zero type errors
npm run build      # Compiles to dist/
```

**MUST BE TRUE**:
- Commit message follows pattern: `type(scope): description`
- All changes are atomic (one logical unit per commit)
- Test coverage stays ≥95%
- No hardcoded paths (use path.join)

## 📝 Git Commit Conventions

### Format
```
type(scope): description

- What changed
- Why it changed
- Any edge cases handled

Fixes: #ISSUE or Relates-to: #CONTEXT
```

### Types
- `fix` — Bug fixes
- `feat` — New features
- `refactor` — Code restructuring
- `test` — Test additions
- `docs` — Documentation
- `chore` — Build, deps, config

### Scopes
- `analyzer` — Core logic (index.ts)
- `cli` — CLI interface (cli.ts)
- `helpers` — Output helpers (helpers.ts)
- `errors` — Error handling
- `project` — Config, setup
- `tests` — Test infrastructure

### Examples
```
✅ GOOD:
fix(analyzer): handle CRLF line endings in paragraph extraction

- Split regex now uses /\r?\n/ for Windows + Unix compatibility
- Prevents counting empty lines from CRLF as paragraphs
- Fixes regression in multi-OS scenarios

test(analyzer): add CRLF edge case regression test

Relates-to: #WINDOWS-COMPAT
```

```
❌ BAD:
- "fix bug" (no scope)
- "FIXED EVERYTHING" (not descriptive)
- "test" (no description)
- Multi-scopes: "fix(cli,analyzer): ..." (one at a time)
```

## 📋 File Structure Reference

```
PrimeiraBiblioteca/
├── src/                          # TypeScript source
│   ├── cli.ts                    # CLI entry + file I/O
│   ├── index.ts                  # Core analyzer logic
│   ├── helpers.ts                # Output formatting
│   ├── erros/funcoesErro.ts       # Error mapping
│   └── __tests__/                # 125 unit + E2E tests
│
├── dist/                         # Compiled output (npm run build)
├── coverage/                     # Coverage reports (local only, in .gitignore)
├── node_modules/                 # Dependencies (auto, in .gitignore)
│
├── .specs/                       # Feature specifications
│   ├── project/                  # ✅ Permanent project records
│   │   ├── PROJECT.md            # Vision + goals
│   │   ├── STATE.md              # Decisions + architecture
│   │   └── ROADMAP.md            # Feature roadmap (M0-M5+)
│   │
│   ├── features/                 # ✅ Active + reference features
│   │   ├── refactor-to-english/  # ✅ Last completed (M5)
│   │   ├── TEMPLATE/             # 📋 Copy for new features
│   │   └── [new-feature]/        # Create here (when needed)
│   │
│   └── _archive/                 # 📚 Historical reference (old M1-M4)
│       ├── M1-bug-fixes/
│       ├── M2-project-infra/
│       ├── M3-test-coverage/
│       └── M4-portfolio-ready/
│
├── .git/                         # Git history (17 atomic commits)
├── .gitignore                    # Includes: node_modules/, coverage/, dist/
├── package.json                  # Dependencies + scripts
├── package-lock.json             # Dependency lock
├── tsconfig.json                 # TypeScript config (outDir: dist, rootDir: src)
├── eslint.config.js              # Linting rules
├── .prettierrc / .prettierignore  # Code formatting
├── README.md                     # User documentation (portfolio-ready)
├── LICENSE                       # MIT license
│
└── docs/                         # 📚 Optional: Examples + guides
    └── examples/
        ├── input/                # Example text files
        └── output/               # Example outputs
```

## 🔄 Between-Session Workflow

### On Session Start
```
1. Read this file (.claude/instructions.md)
2. Check /memories/repo/PROGRESS.md if exists
   - If not exists → Project is complete (you're maintaining)
3. If working on task → Read .specs/features/[name]/DESIGN.md
4. If new feature → Copy TEMPLATE/ and start spec
5. Implement → Test → Commit → Update /memories/repo/
```

### On Session End
```
1. Verify all tests pass: npm test ✓
2. Make final commit if changes exist
3. Update /memories/repo/DECISIONS.md with any decisions
4. Note in PROGRESS.md: "Session complete - [summary]"
```

## 🆘 Troubleshooting

### Tests Failing
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Run with verbose output
npm test -- --reporter=verbose

# Run single test
npm test -- cli.test.ts
```

### Linting Issues
```bash
# Auto-fix formatting
npm run lint:fix
npm run format

# Check specific file
npx eslint src/index.ts
```

### Type Errors
```bash
# Check without emitting
npm run typecheck

# Check build
npm run build  # Shows all errors
```

### Git Issues
```bash
# See commit history
git log --oneline

# See what changed
git diff HEAD~1

# Undo last commit (keep changes)
git reset --soft HEAD~1

# See full history
git log --oneline --all
```

## 📞 Key Contacts

**Original Author**: Fumagalli  
**GitHub Repo**: github.com/Fumagalli/text-analyzer-cli  
**License**: MIT

---

**Last Updated**: 2026-04-13  
**Version**: 1.0 (Post-Refactor M5)
