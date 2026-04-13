# Tasks: Refactor Codebase from Portuguese to English

**Feature:** refactor-to-english  
**Total Tasks:** 7  
**Status:** Ready to execute  
**Estimated Time:** 45-60 minutes  
**Last Updated:** 2026-04-13

---

## Task Breakdown

### [  ] T1: Refactor src/index.ts

**What:** Rename interface + 4 functions + update variables + JSDoc  
**Where:** src/index.ts (full file)  
**Depends on:** None  
**Reuses:** None  

**Changes Required:**
1. Interface: `ContagemParagrafo` → `WordCountMap`
2. Functions:
   - `contaPalavras` → `countWords` (public)
   - `extraiParagrafos` → `extractParagraphs` (public)
   - `verificaPalavrasDuplicadas` → `analyzeWordFrequency` (private)
   - `limpaPalavras` → `cleanWord` (private)
3. Variables: `texto→text`, `paragrafo→paragraph`, `palavra→word`, `resultado→result`, `contagem→count`, `listaPalavras→wordList`, `paragrafos→paragraphs`
4. JSDoc: All comments to English

**Done When:**
- ✅ All function signatures renamed
- ✅ All variables renamed
- ✅ All JSDoc in English
- ✅ No broken TypeScript syntax

**Verification:** 
```bash
cd PrimeiraBiblioteca && npm run typecheck
```
Expected: 0 errors

**Tests:** Manual review (imports not broken in index.ts itself)

**Gate:** TypeScript check passes ✓

---

### [  ] T2: Refactor src/helpers.ts

**What:** Rename 2 functions + update variables + JSDoc  
**Where:** src/helpers.ts (full file)  
**Depends on:** T1 (uses index.ts exports)  
**Reuses:** T1 exports  

**Changes Required:**
1. Functions:
   - `filtraOcorrencias` → `filterOccurrences` (private)
   - `montaSaidaArquivo` → `buildOutputFormat` (exported)
2. Variables: `paragrafo→paragraph`, `chave→key`, `linhas→lines`, `listaPalavras→wordList`
3. JSDoc: All comments to English
4. **Preserve:** Output string `"palavras duplicadas no parágrafo"` (PT-BR)

**Done When:**
- ✅ All function names renamed
- ✅ All variables renamed
- ✅ JSDoc in English
- ✅ Messages still PT-BR
- ✅ Imports from index.ts use new names

**Verification:**
```bash
cd PrimeiraBiblioteca && npm run typecheck
```
Expected: 0 errors

**Tests:** Manual review (import from index.ts correct)

**Gate:** TypeScript check passes ✓

---

### [  ] T3: Refactor src/cli.ts

**What:** Rename 4 functions + update variables + JSDoc (keep messages PT-BR)  
**Where:** src/cli.ts (full file)  
**Depends on:** T1 + T2 (uses exports from both)  
**Reuses:** T1 exports + T2 exports  

**Changes Required:**
1. Functions:
   - `validaInteiroPositivo` → `validatePositiveInteger`
   - `validaEntrada` → `validateInput`
   - `processaArquivo` → `processFile`
   - `criaESalvaArquivo` → `createAndSaveFile`
   - `buildProgram` already English ✓ (skip)
2. Variables: `valor→value`, `nome→name`, `texto→text`, `destino→destination`, `caminhoTexto→textPath`, `caminhoDestino→destinationPath`, `arquivoNovo→newFile`, `conteudo→content`, `textoPalavras→wordOutput`, `statsTexto→textStats`, `statsDestino→destinationStats`
3. JSDoc: All comments to English
4. **Preserve:** All error messages, help text, console logs (PT-BR)

**Done When:**
- ✅ All function names renamed
- ✅ All variables renamed
- ✅ JSDoc in English
- ✅ CLI behavior identical
- ✅ All messages still PT-BR
- ✅ Imports use new names from T1+T2

**Verification:**
```bash
cd PrimeiraBiblioteca && npm run typecheck
```
Expected: 0 errors

**Tests:** Manual review (all imports correct)

**Gate:** TypeScript check passes ✓

---

### [  ] T4: Update src/__tests__/index.test.ts

**What:** Update imports + function calls in test bodies  
**Where:** src/__tests__/index.test.ts (full file)  
**Depends on:** T1 (index.ts exports finalized)  
**Reuses:** T1 exports  

**Changes Required:**
1. Import statement:
   ```typescript
   // OLD: import { contaPalavras, extraiParagrafos } from '../index.js';
   // NEW: import { countWords, extractParagraphs } from '../index.js';
   ```
2. All test calls:
   - `contaPalavras(...)` → `countWords(...)`
   - `extraiParagrafos(...)` → `extractParagraphs(...)`
3. Keep: describe/it blocks, assertions (readable as-is)

**Done When:**
- ✅ Imports match new function names
- ✅ All function calls use new names
- ✅ Test descriptions clear and unchanged

**Verification:** 
```bash
cd PrimeiraBiblioteca && npm run typecheck
```
Expected: 0 errors (imports resolve)

**Tests:** Check test file parses (syntax valid)

**Gate:** No syntax/import errors ✓

---

### [  ] T5a: Update src/__tests__/cli.test.ts — Part 1 (Imports + First 20 Calls)

**What:** Update import statements + first ~20 function calls in cli.test.ts  
**Where:** src/__tests__/cli.test.ts (lines 1-200 approximately)  
**Depends on:** T3 (cli.ts exports finalized) + T2 (helpers.ts exports)  
**Reuses:** T3 + T2 exports  

**Changes Required:**
1. Import statements: use new function names
   ```typescript
   // OLD: import { buildProgram, validaEntrada, processaArquivo } from '../cli.js';
   // NEW: import { buildProgram, validateInput, processFile } from '../cli.js';
   ```
2. First batch of function calls (~line 1-200):
   - `validaEntrada(...)` → `validateInput(...)`
   - `processaArquivo(...)` → `processFile(...)`
   - Apply to ~20 test cases

**Done When:**
- ✅ Imports at top of file refactored
- ✅ First half of function calls updated
- ✅ Message assertions unchanged

**Verification:**
```bash
cd PrimeiraBiblioteca && npm run typecheck
```
Expected: 0 errors

**Tests:** Check file parses (partial syntax valid)

**Gate:** No syntax/import errors in first half ✓

---

### [  ] T5b: Update src/__tests__/cli.test.ts — Part 2 (Remaining Calls + Smoke Tests)

**What:** Update remaining ~20 function calls + E2E tests  
**Where:** src/__tests__/cli.test.ts (lines 200+ remainder)  
**Depends on:** T5a (first half complete)  
**Reuses:** T5a context  

**Changes Required:**
1. Remaining function calls (~line 200+):
   - `validaEntrada(...)` → `validateInput(...)`
   - `processaArquivo(...)` → `processFile(...)`
   - `criaESalvaArquivo(...)` → `createAndSaveFile(...)`
   - Apply to remaining ~20 test cases
2. Keep: assertions for PT-BR messages
   ```typescript
   // KEEP: .toContain('palavras duplicadas no parágrafo')
   // KEEP: .toContain('arquivo criado')
   ```

**Done When:**
- ✅ All remaining function calls refactored
- ✅ Message assertions unchanged (still check for PT-BR text)
- ✅ File complete and syntactically valid

**Verification:**
```bash
cd PrimeiraBiblioteca && npm run typecheck
```
Expected: 0 errors

**Tests:** Full cli.test.ts parses

**Gate:** No syntax/import errors ✓ Full file valid ✓

---

### [  ] T6: Verify src/__tests__/funcoesErro.test.ts

**What:** Check for PT-BR function name references (isolated from other tests)  
**Where:** src/__tests__/funcoesErro.test.ts (full file)  
**Depends on:** T1-T3 (source finalized)  
**Reuses:** None (tests error handler, independent)  

**Changes Required:**
1. Scan file for any references to old PT-BR function names from index/cli/helpers
2. If found: update imports/calls to new names
3. If none found: file is already compatible (skip)

**Expected:** File likely has no references (error handler is isolated), but verify to be sure.

**Done When:**
- ✅ No PT-BR function name references
- ✅ File compatible with refactored codebase

**Verification:** Manual code review

**Tests:** (none — isolated component)

**Gate:** No old PT-BR function names ✓

---

### [  ] T7: Gate Checks + Build + Commit

**What:** Run full test suite + build + atomic commit  
**Where:** PrimeiraBiblioteca/ (project root)  
**Depends on:** T1-T6 (all changes complete)  
**Reuses:** All refactored code  

**Commands & Expectations:**

```bash
# 1. Type checking
npm run typecheck
# Expected: "✓ No errors" or similar (0 errors)

# 2. Linting
npm run lint
# Expected: "✓ All files valid" or similar (0 errors)

# 3. Full test suite
npm test
# Expected: "✓ 125 passing" (all tests pass)

# 4. Build
npm run build
# Expected: dist/cli.js generated, no errors

# 5. Git status
git status
# Expected: "working tree clean" (no uncommitted changes)
```

**Smoke Test (manual verification):**
```bash
# Test help display
node dist/cli.js --help
# Expected: Help text with PT-BR option descriptions

# Test CLI execution
node dist/cli.js --texto ../arquivos/texto-aprendizado.txt --destino ./resultados
# Expected: "arquivo criado" message (PT-BR)

# Verify output
cat ./resultados/resultado.txt
# Expected: "palavras duplicadas no parágrafo" (PT-BR)
```

**Commit (mark complete when done):**
```bash
# Stage spec + all refactored source files together
git add .specs/features/refactor-to-english/
git add src/
git add src/__tests__/

git commit -m "refactor: standardize codebase to English

- Renamed 11 functions from Portuguese to English
- Renamed approximately 30 variables across 3 source files
- Updated all JSDoc comments to English
- Updated 3 test files (125 tests) with new function names
- User-facing messages remain in Portuguese (console logs, errors, help text)
- All 125 tests passing, zero TypeScript/ESLint errors
- Build successfully generates dist/cli.js
- Includes refactor spec (.specs/) for traceability

Motivation: Improve code consistency, portfolio readiness, and GitHub presentation
Behavior: Zero functional changes — CLI output and test coverage identical

[Spec: .specs/features/refactor-to-english/tasks.md]"
```

**Done When:**
- ✅ All 4 gates pass (typecheck, lint, test, build)
- ✅ Smoke test passes (CLI works, messages in PT-BR)
- ✅ Atomic commit created with detailed message
- ✅ Git log shows refactor commit

**Verification:**
```bash
git log --oneline -1
# Expected: Shows refactor commit message
npm test 2>&1 | tail -5
# Expected: "✓ 125 passing"
```

**Gate:** All gates pass ✓ Build succeeds ✓ Tests pass ✓ Commit created ✓

## Spec Commit Decision

**Decision:** Commit `.specs/` directory as part of T7 atomic commit  
**Rationale (TLC Pattern — Tracking Decisions):**
- **Traceability**: The spec documents *the exact plan* that was implemented
- **Historical context**: Future you/team can see the design e intenções behind each refactor step
- **Verification**: Spec + commit message form a complete record linking planning → execution
- **Portfolio**: Clean specs show professional project discipline

**When committed:**
- Timestamp in git history associates spec with exact implementation date
- Enables `git log --oneline -1` to surface refactor commit + spec together
- Supports `git blame` on spec to understand when/why decisions changed

**Contingency**: If spec becomes outdated post-merge, update via new commit (don't rewrite history)

---

## Dependency Graph (Updated)

```
T1: src/index.ts
    ↓
    ├─→ T2: src/helpers.ts (independent of T1 changes)
    │   ↓
    │   └─→ T3: src/cli.ts (uses T1 + T2 exports)
    │       ├─→ T4: index.test.ts (uses T1 exports)
    │       ├─→ T5a: cli.test.ts Part 1 (uses T3 + T2 exports)
    │       │   └─→ T5b: cli.test.ts Part 2 (continuation + E2E)
    │       └─→ T6: funcoesErro.test.ts (verify compat)
    │
    └─→ T4: index.test.ts (uses T1 exports)

All → T7: Gate checks + commit

Critical Path: T1 → T2 → T3 → T5a → T5b → T7 (6 sequential steps)
Optimal: T4 and T6 can run after their dependencies complete
```

---

## Status Tracking (Updated)

| Task | Status | Files | Lines | Focus |
|------|--------|-------|-------|-------|
| T1 | [  ] | src/index.ts | ~60 | 4 func + 1 interface + 8 vars + JSDoc |
| T2 | [  ] | src/helpers.ts | ~30 | 2 func + 5 vars + JSDoc |
| T3 | [  ] | src/cli.ts | ~170 | 4 func + 12 vars + JSDoc |
| T4 | [  ] | src/__tests__/index.test.ts | ~180 | ~20 calls to countWords, ~20 calls to buildOutputFormat |
| T5a | [  ] | src/__tests__/cli.test.ts | ~200 | import + ~20 calls to validateInput, processFile |
| T5b | [  ] | src/__tests__/cli.test.ts | ~200+ | remaining ~20 calls + E2E tests |
| T6 | [  ] | src/__tests__/funcoesErro.test.ts | ~50 | verify (isolated, minimal changes) |
| T7 | [  ] | (all files) | - | gates + commit + verification |

---

## Success Criteria (All Must Pass)

- ✅ T1-T6: All changes complete, no syntax errors
- ✅ T7: All gates pass
  - `npm run typecheck` → 0 errors
  - `npm run lint` → 0 errors
  - `npm test` → 125/125 passing (identical count to pre-refactor)
  - `npm run build` → dist/cli.js generated
- ✅ Smoke test: CLI behavior identical, output still PT-BR
- ✅ Commit: Atomic, detailed message, clean git history
- ✅ No incomplete renames: `grep -r "contaPalavras\|extraiParagrafos\|validaEntrada"` returns no matches

---

## Risk Mitigation

| Risk | Mitigation | Contingency |
|------|-----------|-----------|
| Import mismatches | TypeScript catches at T1-T3 | Review `git diff` and fix import |
| Test failures | Full suite runs at T7 (fail-fast) | Check which test failed, trace to source |
| Message changes | Careful preserve strategy across T1-T3 | Search for PT-BR strings in diff |
| Syntax errors | Manual review after each file | TypeScript compilation required per file |
| Incomplete rename | Grep for old names after commit | `grep -r "contaPalavras"` to find missed refs |

---

## Implementation Readiness Checklist

Before starting T1:
- [ ] Read spec.md (understand requirements)
- [ ] Read design.md (understand approach + import dependencies)
- [ ] Understand mapping table (functions + variables + imports)
- [ ] **Create git backup branch:** `git checkout -b refactor-to-english-backup` (rollback point)
- [ ] **Return to main branch:** `git checkout master` or `git checkout main`
- [ ] Backup current state: `git status` clean
- [ ] Have mapping table accessible during work
- [ ] **Note: .specs/ will be committed with T7** (part of refactor commit)

During tasks:
- [ ] After T1, T2, T3: Run `npm run typecheck` 
- [ ] After T4, T5a, T5b, T6: Run `npm run typecheck`
- [ ] Before T7: Review all changes with `git diff src/`
- [ ] If issues found: revert with `git checkout src/[file].ts` (single file) or `git reset --hard refactor-to-english-backup` (full rollback)

At T7:
- [ ] Run all 4 gates in sequence
- [ ] Verify smoke test passes
- [ ] Run git commit with full message
- [ ] Verify commit created: `git log --oneline -1`
- [ ] Delete backup branch (optional): `git branch -d refactor-to-english-backup`
