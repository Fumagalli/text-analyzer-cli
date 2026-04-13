# Feature: Refactor Codebase from Portuguese to English

**Status:** Specified  
**Created:** 2026-04-13  
**Owner:** Team  
**Priority:** Medium (Quality-of-life + Portfolio improvement)  

---

## Vision

Standardize codebase to English while preserving Portuguese user-facing messages. Creates consistency (code in English, UX in Portuguese) and improves portfolio readiness for GitHub and npm.

---

## Requirements

### REQ-001: Function Names in English
All public and private function names must be converted to English. No Portuguese names in function signatures.

**Scope:**
- 9 public functions
- 4 private functions

**Acceptance Criteria:**
- `contaPalavras` → `countWords`
- `extraiParagrafos` → `extractParagraphs`
- `verificaPalavrasDuplicadas` → `analyzeWordFrequency`
- `limpaPalavras` → `cleanWord`
- `filtraOcorrencias` → `filterOccurrences`
- `montaSaidaArquivo` → `buildOutputFormat`
- `validaInteiroPositivo` → `validatePositiveInteger`
- `validaEntrada` → `validateInput`
- `processaArquivo` → `processFile`
- `criaESalvaArquivo` → `createAndSaveFile`

**Traceable:** T1-T3 tasks

---

### REQ-002: Variable Names in English
All variables, parameters, and local identifiers must be English.

**Scope:** ~30 variables across 3 source files

**Examples:**
- `texto` → `text`
- `palavra` → `word`
- `resultado` → `result`
- `paragrafo` → `paragraph`
- `caminhoTexto` → `textPath`

**Traceable:** T1-T3 tasks

---

### REQ-003: Type & Interface Names in English
All TypeScript interfaces and types must be English.

**Scope:** 1 interface

**Changes:**
- `ContagemParagrafo` → `WordCountMap`

**Traceable:** T1 task

---

### REQ-004: JSDoc Comments in English
All code comments and documentation strings must be English.

**Scope:** All public function JSDoc blocks and inline comments

**Traceable:** T1-T3 tasks

---

### REQ-005: User Messages Stay Portuguese
Console outputs, error messages, help descriptions, and user-facing strings remain Portuguese.

**Scope:** Do NOT change:
- `console.log("arquivo criado com sucesso")`
- `"palavras duplicadas no parágrafo"`
- CLI help text and option descriptions
- All error messages

**Traceable:** All tasks (verification point)

---

### REQ-006: 100% Test Coverage Maintained
All 125 tests must pass post-refactor with identical behavior.

**Scope:** 3 test files (CONFIRMED after codebase analysis)
- `src/__tests__/index.test.ts` (~100+ calls to `contaPalavras`, `montaSaidaArquivo`)
- `src/__tests__/cli.test.ts` (~400+ lines, ~40+ calls to `validaEntrada`, `processaArquivo`, etc)
- `src/__tests__/funcoesErro.test.ts` (~50 lines, calls to `trataErros` — isolated, minimal impact)

**Acceptance:**
- `npm test` → 125/125 passing (identical count to pre-refactor)
- `npm run typecheck` → 0 errors
- `npm run lint` → 0 errors

**Traceable:** T7 task

---

### REQ-007: Build Succeeds
TypeScript compilation to dist/ must work without errors.

**Acceptance:**
- `npm run build` → dist/cli.js generated
- `node dist/cli.js --help` → displays correctly
- ESLint acceptance: No naming convention restrictions in `eslint.config.js`
  - Current rules: `no-unused-vars`, `eqeqeq`, `prefer-const`, `prettier`
  - No `naming-convention` rule that would reject English camelCase names

**Traceable:** T7 task

---

### REQ-008: Atomic Single Commit
All changes in one refactor commit with full message.

**Acceptance:**
- Single commit: `refactor: standardize codebase to English`
- Message includes: what changed, why, test verification
- .git history preserved

**Traceable:** T7 task

---

## Out of Scope

The following items are explicitly **NOT** included in this refactor:

### What Will NOT Change
- `.git` history and commit messages (existing commits stay as-is)
- Branch names (no renaming of git branches)
- Documentation files (README.md, WORKFLOW.md, etc. — remain Portuguese or bilingual)
- Configuration files naming (eslint.config.js, tsconfig.json, etc.)
- User-facing CLI messages (help text, error messages, console output — remain Portuguese)
- Test file names (remain as-is: `*.test.ts`)
- Package names or export names already in English (e.g., `buildProgram`, `regex`)
- External dependencies or library naming
- Environment variables or build artifacts naming

### What WILL Change
- ✅ Source code identifiers only: functions, variables, types, interfaces, internal comments (JSDoc)
- ✅ Test file contents (function call sites, import statements)
- ✅ Comments and documentation within code (inline JSDoc)

---

## Assumptions

1. No downstream consumers yet (not published to npm) — breaking change acceptable
2. Git history preserved (no amending, clean linear history)
3. Interface exports remain stable (only names change)
4. Tests are the source of truth for behavior validation

---

## Success Criteria

✅ All 8 requirements met  
✅ Pre-refactor test count == post-refactor test count (125)  
✅ Smoke test: `node dist/cli.js --texto test.txt --destino ./out` works  
✅ Output file contains Portuguese message: `"palavras duplicadas no parágrafo"`  
✅ Code passes linter, type checker, and tests  
✅ Commit message is detailed and traceable
