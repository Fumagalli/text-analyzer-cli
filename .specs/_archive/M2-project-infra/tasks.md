# Project Infrastructure Tasks

**Design**: `.specs/features/project-infra/design.md`  
**Status**: Draft  
**Last Updated**: 2026-04-10

---

## Execution Plan

### Phase 1: Foundation (Sequential)

Remove orphan artifacts before making changes to package.json.

```
T1 (Remove orphans)
```

### Phase 2: Configuration (Sequential)

Package.json and tsconfig.json changes must complete before path refactoring test can validate.

```
T1 → T2 (Update tsconfig) → T3 (Update package.json)
```

### Phase 3: Code Refactor (Sequential)

Refactor paths after build script is ready (need tsc to verify types during development).

```
T3 → T4 (Refactor paths to path.join())
```

### Phase 4: Verification (Gate)

Test complete build + runtime.

```
T4 → GATE (npm run build, npm test, npm lint, npm typecheck)
```

---

## Task Breakdown

### T1: Remove Orphan Files

**What**: Delete typescript-eslint-eslint-plugin-6.21.0.tgz and verify package-lock.json cleanup

**Where**: 
- `PrimeiraBiblioteca/typescript-eslint-eslint-plugin-6.21.0.tgz` (DELETE)
- `PrimeiraBiblioteca/package-lock.json` (verify state; delete if orphaned at root)

**Depends on**: None

**Reuses**: None

**Requirement ID**: INFRA-04, INFRA-05

**Tools**: 
- Filesystem: rm command or delete operations

**Done when**:
- [ ] typescript-eslint-eslint-plugin-6.21.0.tgz no longer exists
- [ ] Root package-lock.json removed (if orphaned)
- [ ] npm install runs without errors
- [ ] npm test passes (25/25 tests) — no package breakage

**Tests**: None (manual verification + npm install check)

**Gate**: `npm install && npm test`

---

### T2: Update TypeScript Configuration

**What**: Add `"outDir": "dist"` to tsconfig.json compilerOptions

**Where**: `PrimeiraBiblioteca/tsconfig.json`

**Depends on**: T1

**Reuses**: None

**Requirement ID**: INFRA-06

**Tools**: 
- Filesystem: edit file

**Done when**:
- [ ] tsconfig.json has `"outDir": "dist"` in compilerOptions
- [ ] No other tsconfig fields changed
- [ ] npm run typecheck passes (validates tsconfig syntax)

**Tests**: None (typecheck validation)

**Gate**: `npm run typecheck`

---

### T3: Update package.json

**What**: Add engines field, build script, and bin field to package.json

**Where**: `PrimeiraBiblioteca/package.json`

**Depends on**: T2

**Reuses**: Existing package.json structure

**Requirement ID**: INFRA-06, INFRA-07, INFRA-08, INFRA-09

**Tools**: 
- Filesystem: edit file

**Done when**:
- [ ] `"engines": { "node": ">=18" }` added at root level
- [ ] `"build": "tsc"` added to scripts object
- [ ] `"bin": { "text-analyzer-cli": "dist/cli.js" }` added at root level
- [ ] npm run typecheck passes
- [ ] npm install passes without errors

**Tests**: 
- Manual validation: `npm run build` creates dist/cli.js without errors
- Manual: `node dist/cli.js --help` displays command info

**Gate**: `npm install && npm run typecheck && npm run build`

---

### T4: Refactor Paths to path.join()

**What**: Replace string interpolation with path.join() in criaESalvaArquivo() function

**Where**: `src/cli.ts` function `criaESalvaArquivo()`

**Depends on**: T3

**Reuses**: `path.join()` from Node.js path module (already imported)

**Requirement ID**: INFRA-10

**Tools**: 
- Filesystem: edit file

**Done when**:
- [ ] Line in criaESalvaArquivo changed from `const arquivoNovo = \`${endereco}/resultado.txt\`;` to `const arquivoNovo = path.join(endereco, 'resultado.txt');`
- [ ] No other lines modified
- [ ] npm run typecheck passes
- [ ] npm test passes (25/25 tests pass)
- [ ] npm run lint passes
- [ ] npm run build produces dist/cli.js with no errors

**Tests**: unit + existing CLI tests verify functionality unchanged

**Gate**: `npm run typecheck && npm test && npm run lint && npm run build`

---

## Pre-Approval Validation

### Granularity Check ✓

| Task | Atomic? | Scope |
|------|---------|-------|
| T1: Remove orphans | ✓ | Single action: delete 1-2 files |
| T2: Update tsconfig | ✓ | Single modification: add 1 field |
| T3: Update package.json | ✓ | Single modification: add 3 fields (can be one commit) |
| T4: Refactor paths | ✓ | Single location: one string interpolation → path.join() |

**Result**: ✓ All tasks are atomic (one change, one file, one purpose)

---

### Diagram-Definition Cross-Check ✓

| Task | Depends on | Task Order in Diagram | Match? |
|------|-----------|----------------------|--------|
| T1 | None | First | ✓ |
| T2 | T1 | After T1 | ✓ |
| T3 | T2 | After T2 | ✓ |
| T4 | T3 | After T3 | ✓ |

**Result**: ✓ Execution plan diagram matches task dependencies

---

**Status**: ✓ Ready for Execution
