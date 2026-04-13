# Bug Fixes Tasks

**Design**: `.specs/features/bug-fixes/design.md`
**Status**: Draft

---

## Execution Plan

### Phase 1: Core Logic Fixes (Sequential)

Tasks that must be done first, in order — each builds on the previous.

```
T1 → T2 → T3
```

### Phase 2: CLI Validation (After T3)

Depends on core logic being correct.

```
T3 → T4
```

### Phase 3: Tests (After T4)

Tests verify all fixes.

```
T4 → T5
```

---

## Task Breakdown

### T1: Fix word count order — length check after cleanup

**What**: Move `limpaPalavras` call before length check, skip empty strings after cleanup
**Where**: `src/index.ts` — function `verificaPalavrasDuplicadas`
**Depends on**: None
**Reuses**: Existing `limpaPalavras` function (unchanged)
**Requirement**: BUG-01, BUG-02, BUG-03, BUG-04

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `limpaPalavras` is called BEFORE length check in `verificaPalavrasDuplicadas`
- [ ] Empty strings after `limpaPalavras` are skipped (`if (!palavraLimpa) return`)
- [ ] Length check uses `palavraLimpa.length` instead of `palavra.length`
- [ ] Existing `contaPalavras` tests still pass
- [ ] Gate check passes: `cd PrimeiraBiblioteca && npx vitest run`

**Tests**: unit
**Gate**: quick

**Commit**: `fix(analyzer): move length check after punctuation cleanup`

---

### T2: Fix paragraph and word splitting

**What**: Replace `split('\n')` with `split(/\r?\n/)`, replace `split(' ')` with `split(/\s+/)`, filter empty paragraphs
**Where**: `src/index.ts` — functions `extraiParagrafos` and `verificaPalavrasDuplicadas`
**Depends on**: T1
**Reuses**: Existing split logic pattern
**Requirement**: SPLIT-01, SPLIT-02, SPLIT-03, SPLIT-04

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `extraiParagrafos` uses `split(/\r?\n/)` instead of `split('\n')`
- [ ] Empty paragraphs are filtered (no empty strings in result array)
- [ ] `verificaPalavrasDuplicadas` uses `split(/\s+/)` instead of `split(' ')`
- [ ] Empty tokens after splitting are not produced (handled by `/\s+/` regex)
- [ ] Existing tests still pass
- [ ] Gate check passes: `cd PrimeiraBiblioteca && npx vitest run`

**Tests**: unit
**Gate**: quick

**Commit**: `fix(analyzer): support CRLF line endings and whitespace splitting`

---

### T3: Expand punctuation regex for PT-BR

**What**: Add unicode punctuation characters common in Portuguese text to `limpaPalavras` regex
**Where**: `src/index.ts` — function `limpaPalavras`
**Depends on**: T2
**Reuses**: Existing regex pattern
**Requirement**: PTBR-01, PTBR-02, PTBR-03, PTBR-04, PTBR-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Regex includes `\u2014` (em-dash `—`), `\u2013` (en-dash `–`), `\u2026` (ellipsis `…`)
- [ ] Regex includes `\u201C`/`\u201D` (curly double quotes `""`), `\u2018`/`\u2019` (curly single quotes `''`)
- [ ] Regex includes `[`, `]`, `\`, `^`
- [ ] Accented characters (á, é, ã, ç, etc.) are NOT removed
- [ ] Existing tests still pass
- [ ] Gate check passes: `cd PrimeiraBiblioteca && npx vitest run`

**Tests**: unit
**Gate**: quick

**Commit**: `fix(analyzer): expand punctuation regex for PT-BR characters`

---

### T4: Add numeric option validation to CLI

**What**: Create `validaInteiroPositivo` function and use it to validate `--min-chars` and `--min-count`
**Where**: `src/cli.ts` — new function before `buildProgram`, modify action handler
**Depends on**: T3
**Reuses**: Error display pattern from existing `validaEntrada`
**Requirement**: VAL-01, VAL-02, VAL-03, VAL-04

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `validaInteiroPositivo(valor, nome)` function exists and is exported
- [ ] Function uses `parseInt(valor, 10)` with explicit radix
- [ ] `NaN` result logs error with `chalk.red` and calls `process.exit(1)`
- [ ] Values `<= 0` log error with `chalk.red` and call `process.exit(1)`
- [ ] Valid positive integers are returned as numbers
- [ ] Action handler calls `validaInteiroPositivo` for both `minChars` and `minCount`
- [ ] Existing CLI tests still pass (they use valid numeric values)
- [ ] Gate check passes: `cd PrimeiraBiblioteca && npx vitest run`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(cli): add validation for numeric options min-chars and min-count`

---

### T5: Add regression and edge case tests

**What**: Add tests for all bug fixes and edge cases documented in the spec
**Where**: `src/__tests__/index.test.ts`, `src/__tests__/cli.test.ts`, `src/__tests__/funcoesErro.test.ts`
**Depends on**: T4
**Reuses**: Existing test patterns and mocking strategies
**Requirement**: All requirement IDs (BUG-*, VAL-*, SPLIT-*, PTBR-*)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `index.test.ts` — tests for punctuation in words (`"hello!"`, `"a."`, `"..."`)
- [ ] `index.test.ts` — test that empty strings don't generate keys
- [ ] `index.test.ts` — tests for CRLF (`\r\n`) and CR (`\r`) paragraph splitting
- [ ] `index.test.ts` — tests for tab and multi-space splitting
- [ ] `index.test.ts` — test for empty text input
- [ ] `index.test.ts` — tests for PT-BR punctuation characters (curly quotes, em-dash, ellipsis)
- [ ] `index.test.ts` — test for accented characters preservation (á, é, ã, ç)
- [ ] `cli.test.ts` — test for `--min-chars abc` (error and exit)
- [ ] `cli.test.ts` — test for `--min-chars -1` and `--min-chars 0`
- [ ] `cli.test.ts` — test for `validaInteiroPositivo` function directly
- [ ] `funcoesErro.test.ts` — test for unmapped error code
- [ ] All existing tests still pass (no deletions or weakenings)
- [ ] Gate check passes: `cd PrimeiraBiblioteca && npx vitest run`
- [ ] Test count increases (no silent deletions)

**Tests**: unit
**Gate**: full

**Commit**: `test: add regression and edge case tests for bug fixes`

---

## Parallel Execution Map

```
Phase 1 (Sequential):
  T1 ──→ T2 ──→ T3

Phase 2 (Sequential):
  T3 ──→ T4

Phase 3 (Sequential):
  T4 ──→ T5
```

All tasks are sequential because each builds on the previous. No parallel execution is possible.

---

## Task Granularity Check

| Task | Scope | Status |
|------|-------|--------|
| T1: Fix word count order | 1 function change | ✅ Granular |
| T2: Fix splitting | 2 regex changes | ✅ Granular |
| T3: Expand PT-BR regex | 1 regex change | ✅ Granular |
| T4: Add numeric validation | 1 new function + 2 call sites | ✅ Granular |
| T5: Add regression tests | Multiple test files | ✅ Granular (test-only task) |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
|------|----------------------|---------------|--------|
| T1 | None | No incoming arrow | ✅ Match |
| T2 | T1 | Arrow T1 → T2 | ✅ Match |
| T3 | T2 | Arrow T2 → T3 | ✅ Match |
| T4 | T3 | Arrow T3 → T4 | ✅ Match |
| T5 | T4 | Arrow T4 → T5 | ✅ Match |

---

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
|------|-----------------------------|-----------------|-----------|--------|
| T1 | Core logic (`index.ts`) | unit | unit | ✅ OK |
| T2 | Core logic (`index.ts`) | unit | unit | ✅ OK |
| T3 | Core logic (`index.ts`) | unit | unit | ✅ OK |
| T4 | CLI (`cli.ts`) | unit | unit | ✅ OK |
| T5 | Test files only | unit | unit | ✅ OK |