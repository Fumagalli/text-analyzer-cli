# M3: Test Coverage — Tasks

**Milestone**: M3 (Test Coverage)  
**Est. Duration**: 1-2 hours  
**Dependencies**: M1 (bug fixes completed), M2 (build script ready)  
**Gate Check**: `npm test ✓ 100% coverage ✓ npm run lint ✓ npm run typecheck ✓`

---

## Task Dependency Graph

```
T3.1: Regression tests (B1-B4)
  ├─ B1: Punctuation cleanup
  ├─ B2: CRLF handling
  ├─ B3: PT-BR punctuation
  └─ B4: NaN validation
        ↓ (these must verify M1 bugs don't resurface)
T3.2: Edge case tests (E1-E4)
  ├─ E1: Empty text
  ├─ E2: Whitespace-only
  ├─ E3: Punctuation-only
  └─ E4: Mixed unicode + CRLF
        ↓ (independent, can run in parallel with T3.1)
T3.3: E2E integration test
  └─ Full file read → process → write
        ↓ (must run after T3.1 + T3.2 to ensure core logic tested)
T3.4: Verify 100% coverage + gate check
  └─ All tests passing + coverage report clean
```

---

## T3.1: Regression Tests for M1 Bug Fixes

**File Modified**: `src/__tests__/index.test.ts`

**Objective**: Verify all M1 bug fixes are working and won't regress

### T3.1a: Punctuation Cleanup Order (B1)

**Acceptance Criteria**:
- ✓ Test `limpaPalavras("hello-world")` returns `"hello"` (hyphen removed)
- ✓ Test `contaPalavras("hello-world")` returns `2` (word count AFTER cleanup)
- ✓ Test hyphenated PT-BR words: `"pós-graduação"` → `"pós-graduação"` (internal hyphen preserved OR converted, consistent)
- ✓ Test punctuation at start/end removed: `"!hello!"` → `"hello"`

**Example Test Case**:
```typescript
describe("Regression: Punctuation Cleanup Order (B1)", () => {
  it("should count words after punctuation cleanup", () => {
    expect(contaPalavras("hello-world")).toBe(2);
    expect(contaPalavras("!hello!")).toBe(1);
  });

  it("should clean hyphenated words", () => {
    expect(limpaPalavras("hello-world")).not.toContain("-");
  });
});
```

**Commit Message**: `test(analyzer): add regression test for punctuation cleanup (B1)`

---

### T3.1b: CRLF Line Ending Support (B2)

**Acceptance Criteria**:
- ✓ Test `extraiParagrafos("Para1\r\nPara2\r\nPara3")` returns 3 paragraphs
- ✓ Test mixed endings: `"Para1\nPara2\r\nPara3"` returns 3 paragraphs
- ✓ Test Windows-style file content is split correctly
- ✓ Compare unix (`\n`) vs windows (`\r\n`) equivalence

**Example Test Case**:
```typescript
describe("Regression: CRLF Line Ending Support (B2)", () => {
  it("should split paragraphs on CRLF line endings", () => {
    const crlf = "Para 1\r\nPara 2\r\nPara 3";
    expect(extraiParagrafos(crlf)).toHaveLength(3);
  });

  it("should handle mixed line endings", () => {
    const mixed = "Para 1\nPara 2\r\nPara 3";
    expect(extraiParagrafos(mixed)).toHaveLength(3);
  });
});
```

**Commit Message**: `test(analyzer): add regression test for CRLF handling (B2)`

---

### T3.1c: PT-BR Punctuation Expansion (B3)

**Acceptance Criteria**:
- ✓ Test em-dash removal: `limpaPalavras("olá—mundo")` removes em-dash
- ✓ Test guillemets removal: `limpaPalavras("«palavra»")` removes guillemets
- ✓ Test combinations: mixed PT-BR punctuation cleaned
- ✓ Test that internal hyphens/apostrophes are preserved (language-specific)

**Example Test Case**:
```typescript
describe("Regression: PT-BR Punctuation Expansion (B3)", () => {
  it("should remove PT-BR em-dash", () => {
    const result = limpaPalavras("olá—mundo");
    expect(result).not.toContain("—");
  });

  it("should remove PT-BR guillemets", () => {
    const result = limpaPalavras("«olá»");
    expect(result).not.toContain("«");
    expect(result).not.toContain("»");
  });

  it("should preserve apostrophes in contractions", () => {
    // e.g., "d'água" or similar
    const result = limpaPalavras("d'água");
    // Either removes apostrophe or preserves it consistently
    expect(result).toBeTruthy();
  });
});
```

**Commit Message**: `test(analyzer): add regression test for PT-BR punctuation (B3)`

---

### T3.1d: NaN Validation in CLI (B4)

**Acceptance Criteria**:
- ✓ Test `validaEntrada({ arquivo: "test.txt", minPalavras: NaN })` rejects
- ✓ Test negative numbers: `validaEntrada({ arquivo: "test.txt", minPalavras: -5 })` rejects
- ✓ Test non-integer floats: `validaEntrada({ arquivo: "test.txt", minPalavras: 3.14 })` rejects
- ✓ Test valid positive integers accept: `validaEntrada({ arquivo: "test.txt", minPalavras: 5 })` resolves

**Example Test Case**:
```typescript
describe("Regression: NaN Validation in CLI (B4)", () => {
  it("should reject NaN values", async () => {
    await expect(
      validaEntrada({ arquivo: "test.txt", minPalavras: NaN })
    ).rejects.toThrow();
  });

  it("should reject negative numbers", async () => {
    await expect(
      validaEntrada({ arquivo: "test.txt", minPalavras: -5 })
    ).rejects.toThrow();
  });

  it("should accept valid positive integers", async () => {
    // Mock fs.promises.access to resolve
    const result = await validaEntrada({ arquivo: "test.txt", minPalavras: 5 });
    expect(result).toBeDefined();
  });
});
```

**Commit Message**: `test(analyzer): add regression test for NaN validation (B4)`

---

## T3.2: Edge Case Tests

**File Modified**: `src/__tests__/index.test.ts` (same file as T3.1)

**Objective**: Ensure boundary conditions handled gracefully

### T3.2a: Empty Text (E1)

**Acceptance Criteria**:
- ✓ `contaPalavras("")` returns `0` (not null/undefined/error)
- ✓ `extraiParagrafos("")` returns `[]` (empty array, not null)
- ✓ `verificaPalavrasDuplicadas("")` returns appropriate empty result
- ✓ No crashes or unhandled exceptions

**Example Test Case**:
```typescript
describe("Edge Case: Empty Text (E1)", () => {
  it("should handle empty string in contaPalavras", () => {
    expect(contaPalavras("")).toBe(0);
  });

  it("should handle empty string in extraiParagrafos", () => {
    expect(extraiParagrafos("")).toEqual([]);
  });

  it("should not crash on empty verification", () => {
    expect(() => verificaPalavrasDuplicadas("")).not.toThrow();
  });
});
```

**Commit Message**: `test(analyzer): add edge case test for empty text (E1)`

---

### T3.2b: Whitespace-Only Text (E2)

**Acceptance Criteria**:
- ✓ `contaPalavras("   \n\n  \t  ")` returns `0` (not treating whitespace as words)
- ✓ `extraiParagrafos("   \n  \n   ")` returns `[]` or minimal results
- ✓ Handles tabs, spaces, multiple newlines
- ✓ No false counts

**Example Test Case**:
```typescript
describe("Edge Case: Whitespace-Only Text (E2)", () => {
  it("should not count whitespace as words", () => {
    expect(contaPalavras("   \n\n  \t  ")).toBe(0);
  });

  it("should not create empty paragraphs", () => {
    const result = extraiParagrafos("   \n  \n   ");
    expect(result.every(p => p.trim().length > 0)).toBe(true);
  });
});
```

**Commit Message**: `test(analyzer): add edge case test for whitespace-only (E2)`

---

### T3.2c: Punctuation-Only Text (E3)

**Acceptance Criteria**:
- ✓ `contaPalavras("!!! ??? ....")` returns `0` (after cleanup, no words)
- ✓ `limpaPalavras("!@#$%")` returns empty or non-word
- ✓ Handles all standard + PT-BR punctuation marks
- ✓ Results consistent with cleanup rules

**Example Test Case**:
```typescript
describe("Edge Case: Punctuation-Only Text (E3)", () => {
  it("should return 0 for punctuation-only text", () => {
    expect(contaPalavras("!!! ??? ....")).toBe(0);
    expect(contaPalavras("—«»")).toBe(0);
  });

  it("should clean to empty string", () => {
    expect(limpaPalavras("!@#$%")).toBe("");
  });
});
```

**Commit Message**: `test(analyzer): add edge case test for punctuation-only (E3)`

---

### T3.2d: Mixed Unicode + CRLF + Irregular Spacing (E4)

**Acceptance Criteria**:
- ✓ Handles unicode characters (accents, diacritics): `"Résumé"`, `"Ñoño"`, `"日本"`
- ✓ Combines CRLF + irregular spacing: `"Text\r\n  \t  More\nText"`
- ✓ Counts words correctly despite irregularities
- ✓ No crashes on complex input

**Example Test Case**:
```typescript
describe("Edge Case: Mixed Unicode + CRLF + Spacing (E4)", () => {
  it("should handle unicode characters", () => {
    expect(contaPalavras("Résumé Ñoño")).toBeGreaterThan(0);
  });

  it("should handle mixed line endings and spacing", () => {
    const text = "Text\r\n  \t  More\nText";
    const paras = extraiParagrafos(text);
    expect(paras.length).toBeGreaterThan(0);
  });

  it("should not crash on complex real-world input", () => {
    const complex = "Olá!   \r\n\r\n«Test»—new\nLine";
    expect(() => contaPalavras(complex)).not.toThrow();
  });
});
```

**Commit Message**: `test(analyzer): add edge case test for mixed unicode (E4)`

---

## T3.3: End-to-End Integration Test

**File Modified**: `src/__tests__/cli.test.ts`

**Objective**: Verify complete file-to-file pipeline (file read → process → write)

### T3.3a: Full Pipeline with File I/O

**Acceptance Criteria**:
- ✓ Create temp input file with known content
- ✓ Execute `criaESalvaArquivo` with file path + options
- ✓ Verify output file is created (file exists on disk)
- ✓ Read output file and verify content:
  - Contains analysis results (word count, paragraphs, etc.)
  - Matches expected format (e.g., `"Contagem de palavras: 5"`)
  - Properly formatted (no garbage data)
- ✓ Clean up temp files afterwards
- ✓ Test works with default output filename + custom filename

**Example Test Case**:
```typescript
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import path from "path";

describe("E2E: File Operations Pipeline", () => {
  const inputFile = path.join(__dirname, "test-e2e-input.txt");
  const outputFile = path.join(__dirname, "test-e2e-output.txt");

  afterEach(() => {
    // Cleanup
    if (existsSync(inputFile)) unlinkSync(inputFile);
    if (existsSync(outputFile)) unlinkSync(outputFile);
  });

  it("should read file, process, and write results", async () => {
    // Setup: Create input file
    const inputContent = "Hello world\nThis is a test";
    writeFileSync(inputFile, inputContent);

    // Execute: Process file
    await criaESalvaArquivo({
      arquivo: inputFile,
      minPalavras: 1,
      saida: outputFile,
    });

    // Verify: Output file exists
    expect(existsSync(outputFile)).toBe(true);

    // Verify: Content is correct
    const output = readFileSync(outputFile, "utf-8");
    expect(output).toContain("Contagem de palavras");
    expect(output).toMatch(/\d+/); // Contains numbers
    expect(output.length).toBeGreaterThan(10); // Not empty/minimal
  });

  it("should handle large files gracefully", async () => {
    // Setup: Large input
    const largeContent = Array(1000)
      .fill("word")
      .join(" ");
    writeFileSync(inputFile, largeContent);

    // Execute
    await criaESalvaArquivo({
      arquivo: inputFile,
      minPalavras: 1,
      saida: outputFile,
    });

    // Verify: Completed without timeout/error
    expect(existsSync(outputFile)).toBe(true);
    const output = readFileSync(outputFile, "utf-8");
    expect(output).toBeTruthy();
  });
});
```

**Commit Message**: `test(cli): add end-to-end integration test for file operations`

---

## T3.4: Verify 100% Coverage + Gate Check

**File Modified**: None (verification task)

**Objective**: Run test suite, verify metrics, ensure all gates pass

### T3.4a: Coverage Report Verification

**Acceptance Criteria**:
- ✓ Run `npm test` → **ALL tests pass** (expected: 30+ tests)
- ✓ Coverage report shows:
  - `src/index.ts`: **100%** lines, branches, functions
  - `src/cli.ts`: **100%** lines, branches, functions
  - `src/helpers.ts`: **100%** lines, branches, functions
  - `src/erros/funcoesErro.ts`: **100%** lines, branches, functions
- ✓ No uncovered lines reported
- ✓ All conditional branches tested (e.g., if/else paths)

**Command**:
```bash
npm test

# Expected output:
# ✓ 30+ tests passed
# Coverage summary:
#   Statements: 100%
#   Branches: 100%
#   Functions: 100%
#   Lines: 100%
```

**If coverage < 100%**:
- Identify uncovered lines: `npm test -- --coverage --reporter=text-summary`
- Iterate on tests to cover remaining branches
- Repeat `T3.2` or `T3.3` as needed

---

### T3.4b: Quality Gate Checks

**Acceptance Criteria**:
- ✓ `npm run lint` → **No errors** (ESLint passes)
- ✓ `npm run typecheck` → **No errors** (TypeScript passes)
- ✓ `npm run build` → **Compiles successfully** (dist/ created)
- ✓ `git status` → **No uncommitted changes** (all tests committed)

**Commands**:
```bash
npm run lint      # ✓ PASS
npm run typecheck # ✓ PASS
npm run build     # ✓ PASS
git status        # ✓ On branch main, nothing to commit
```

---

### T3.4c: Regression Test Validation

**Acceptance Criteria**:
- ✓ All 4 regression tests pass:
  - B1 (Punctuation cleanup): ✓ PASS
  - B2 (CRLF handling): ✓ PASS
  - B3 (PT-BR punctuation): ✓ PASS
  - B4 (NaN validation): ✓ PASS
- ✓ All 4 edge case tests pass:
  - E1 (Empty text): ✓ PASS
  - E2 (Whitespace-only): ✓ PASS
  - E3 (Punctuation-only): ✓ PASS
  - E4 (Mixed unicode+CRLF): ✓ PASS
- ✓ E2E test passes:
  - File read → process → write: ✓ PASS

**Command**:
```bash
npm test -- --reporter=verbose | grep -E "(PASS|FAIL|B[1-4]|E[1-4]|E2E)"
# All should show ✓ PASS
```

---

## Execution Checklist

### Before Starting
- [ ] M1 bug fixes are implemented and verified working
- [ ] M2 infrastructure is in place (build script, package.json)
- [ ] Current test suite passes: `npm test`
- [ ] No uncommitted changes: `git status`

### During Execution
- [ ] T3.1a (B1 regression): Implement + verify
  - [ ] Commit: `test(analyzer): add regression test for punctuation cleanup (B1)`
- [ ] T3.1b (B2 regression): Implement + verify
  - [ ] Commit: `test(analyzer): add regression test for CRLF handling (B2)`
- [ ] T3.1c (B3 regression): Implement + verify
  - [ ] Commit: `test(analyzer): add regression test for PT-BR punctuation (B3)`
- [ ] T3.1d (B4 regression): Implement + verify
  - [ ] Commit: `test(analyzer): add regression test for NaN validation (B4)`
- [ ] T3.2a (E1 edge case): Implement + verify
  - [ ] Commit: `test(analyzer): add edge case test for empty text (E1)`
- [ ] T3.2b (E2 edge case): Implement + verify
  - [ ] Commit: `test(analyzer): add edge case test for whitespace-only (E2)`
- [ ] T3.2c (E3 edge case): Implement + verify
  - [ ] Commit: `test(analyzer): add edge case test for punctuation-only (E3)`
- [ ] T3.2d (E4 edge case): Implement + verify
  - [ ] Commit: `test(analyzer): add edge case test for mixed unicode (E4)`
- [ ] T3.3a (E2E integration): Implement + verify
  - [ ] Commit: `test(cli): add end-to-end integration test for file operations`
- [ ] T3.4a (Coverage verification): Check metrics
  - [ ] 100% coverage confirmed
- [ ] T3.4b (Quality gates): Run lint + typecheck + build
  - [ ] All gates pass
- [ ] T3.4c (Regression validation): Verify all tests pass
  - [ ] All 12 new tests passing

### After Completion
- [ ] `npm test` passes with 100% coverage
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] `git log` shows all commits (8 test commits + 1 verification)
- [ ] Update PROGRESS.md with completion status
- [ ] Ready for M4

---

## Atomic Commits (Trace Every Change)

After each sub-task, commit with semantic message:

```bash
# After T3.1a
git add src/__tests__/
git commit -m "test(analyzer): add regression test for punctuation cleanup (B1)"

# After T3.1b
git add src/__tests__/
git commit -m "test(analyzer): add regression test for CRLF handling (B2)"

# ... (repeat for T3.1c, T3.1d, T3.2a-d, T3.3a)
```

Each commit is **one logical change** + tests passing.

---

## Success Indicators

✅ **Task complete when**:
1. All 4 regression tests passing (B1-B4)
2. All 4 edge case tests passing (E1-E4)
3. E2E integration test passing
4. Coverage report: **100% on all 4 files**
5. `npm run build` successful
6. `npm run lint` + `npm run typecheck` passing
7. 9 atomic commits in git history
8. PROGRESS.md updated

✅ **Portfolio impact**: "100% test coverage with comprehensive regression + edge case + E2E tests"

---

**Milestone Status**: Ready to execute  
**Duration**: 1-2 hours  
**Next**: M4 (Portfolio Ready) after verification
