# M3: Test Coverage — Design Document

**Milestone Goal**: Achieve 100% code coverage on critical paths + comprehensive regression tests for all M1 bug fixes

**Success Criteria**:
- 100% coverage on `src/index.ts`, `src/cli.ts`, `src/helpers.ts`, `src/erros/funcoesErro.ts`
- All M1 regression tests passing (punctuation cleanup, NaN validation, CRLF handling, PT-BR punctuation)
- End-to-end integration test verifies actual file writes (not just console output)
- Edge case suite covers: empty text, whitespace-only, punctuation-only scenarios
- All tests pass with `npm test` + coverage report generated

---

## Architecture: Test Strategy

### Testing Pyramid (Atomic Strategy)

```
Level 3: E2E Integration Tests (1-2 tests)
├─ File read → process → write verification
├─ Actual file I/O, not mocked
└─ Validates entire CLI pipeline

Level 2: Unit Tests with Regression Coverage (8-10 tests)
├─ M1 Bug regressions (4 tests)
├─ Edge cases (4 tests)
├─ Error handling (2 tests)
└─ Focus: Hidden assumptions + boundary conditions

Level 1: Existing Unit Tests (12 tests — maintained)
├─ Core logic: contaPalavras, extraiParagrafos, verificaPalavrasDuplicadas
├─ CLI: validaEntrada, processaArquivo, criaESalvaArquivo
├─ Error handling: trataErros
└─ Assertion: These remain unchanged, used as foundation
```

### Why This Architecture?

| Layer | Why | Coverage Impact | Maintenance |
|-------|-----|-----------------|-------------|
| **E2E** | Validates user workflows (file operations) | Catches integration bugs | Low (stable CLI boundary) |
| **Regression** | Proves M1 bugs don't resurface | Validates fix effectiveness | Medium (tied to bug lifecycle) |
| **Edge Cases** | Finds hidden assumptions | Boundary condition safety | Medium (grows with features) |
| **Existing** | Foundation + regression prevention | Core logic baseline | Low (stable tests) |

---

## Coverage Map: What to Test

### Regression Tests (M1 Bugs → Test Cases)

#### B1: Punctuation Cleanup Order
**Bug**: Word count included internal punctuation (e.g., `"hello-world"` = 1 word instead of 2 after cleanup)
**Test**: 
```typescript
// Before cleanup: "hello-world" → counted as 1 word
// After cleanup: "hello world" → counted as 2 words
const result = contaPalavras("hello-world");
expect(result).toBe(2); // proves cleanup happens before count
```

**File**: `src/__tests__/index.test.ts` (add to suite)

---

#### B2: CRLF Line Ending Support
**Bug**: Paragraphs not split correctly on Windows CRLF (`\r\n`) line endings
**Test**:
```typescript
// Windows file with CRLF endings
const textWithCRLF = "Para 1\r\nPara 2\r\nPara 3";
const result = extraiParagrafos(textWithCRLF);
expect(result).toHaveLength(3);
```

**File**: `src/__tests__/index.test.ts` (add to suite)

---

#### B3: PT-BR Punctuation Expansion
**Bug**: Portuguese-specific punctuation not cleaned (e.g., em-dashes `—`, guillemets `«»`)
**Test**:
```typescript
// PT-BR text with special punctuation
const text = "Olá — como vai? «Tudo bem»!";
const result = limpaPalavras("Olá—como"); // should remove em-dash
expect(result).toBe("olá-como"); // internal hyphen only
```

**File**: `src/__tests__/index.test.ts` (add to suite)

---

#### B4: NaN Validation in CLI
**Bug**: CLI accepts invalid numeric inputs (NaN, negative numbers, non-integers)
**Test**:
```typescript
// Invalid inputs should reject
await expect(validaEntrada({
  arquivo: "test.txt",
  minPalavras: NaN
})).rejects.toThrow("Número inválido");

await expect(validaEntrada({
  arquivo: "test.txt",
  minPalavras: -5
})).rejects.toThrow("Número inválido");
```

**File**: `src/__tests__/cli.test.ts` (add to suite)

---

### Edge Case Tests (Boundary Conditions)

#### E1: Empty Text
**Scenario**: User provides empty string or file with no content
**Test**:
```typescript
const result = contaPalavras("");
expect(result).toBe(0);

const paras = extraiParagrafos("");
expect(paras).toEqual([]);
```

**Rationale**: Ensure graceful handling; no crashes, no false counts

**File**: `src/__tests__/index.test.ts`

---

#### E2: Whitespace-Only Text
**Scenario**: File contains only spaces, tabs, newlines
**Test**:
```typescript
const result = contaPalavras("   \n\n  \t  ");
expect(result).toBe(0);
```

**Rationale**: Prevent counting empty tokens as words

**File**: `src/__tests__/index.test.ts`

---

#### E3: Punctuation-Only Text
**Scenario**: Text is all punctuation marks
**Test**:
```typescript
const result = contaPalavras("!!! ??? ....");
expect(result).toBe(0); // After cleanup, no words remain
```

**Rationale**: Verify cleanup removes all content correctly

**File**: `src/__tests__/index.test.ts`

---

#### E4: Mixed CRLF + Whitespace + Unicode
**Scenario**: Real-world messy input (Windows + unicode + irregular spacing)
**Test**:
```typescript
const text = "Resumé\r\n  Ñoño   \r\n   ";
const paras = extraiParagrafos(text);
expect(paras.length).toBeLessThanOrEqual(2); // Handles all edge cases
```

**Rationale**: Realistic data validation

**File**: `src/__tests__/index.test.ts`

---

### E2E Integration Test (File Operations)

#### E2E-1: Full Pipeline (File Read → Process → Write)
**Scenario**: User runs `node dist/cli.js --arquivo arquivo.txt --output resultado.txt`

**What to test**:
1. Read file content from disk ✓
2. Process content through analyzer ✓
3. Write result to specified file ✓
4. Verify written file content (not just console output) ✓
5. Verify file readable + correct format

**Test Structure**:
```typescript
it("E2E: executes full pipeline file → process → write", async () => {
  // Setup: Create temp input file
  const inputFile = "./test-input.txt";
  const outputFile = "./test-output.txt";
  writeFileSync(inputFile, "Test content\nAnother line");

  // Execute
  await criaESalvaArquivo({
    arquivo: inputFile,
    minPalavras: 1,
    saida: outputFile,
  });

  // Verify: File written + content correct
  expect(existsSync(outputFile)).toBe(true);
  const written = readFileSync(outputFile, "utf-8");
  expect(written).toContain("Contagem de palavras");
  expect(written).toMatch(/\d+/); // Contains numbers

  // Cleanup
  unlinkSync(inputFile);
  unlinkSync(outputFile);
});
```

**Why separate from unit tests?**
- Unit tests mock I/O (fast, isolated)
- E2E tests verify real file operations (catches integration bugs)
- Both needed for 100% confidence

**File**: `src/__tests__/cli.test.ts` (new dedicated E2E suite)

---

### Error Path Coverage (Existing + Extension)

#### Error Scenarios:
1. **File not found** → `trataErros` should handle gracefully ✓
2. **Invalid file permissions** → Should provide clear error ✓
3. **Invalid CLI arguments** → `validaEntrada` should reject ✓
4. **Numeric overflow** → Should handle large numbers ✓

**File**: `src/__tests__/erros.test.ts` (extend existing)

---

## Coverage Goals by File

### src/index.ts (Core Logic)
- **Target**: 100% line coverage
- **Current Gap** (estimated): Edge cases (empty, whitespace-only)
- **New Tests**: E1, E2, E3, E4, B1, B2, B3
- **Example**: Every branch in `limpaPalavras` tested

### src/cli.ts (CLI Handler)
- **Target**: 100% line coverage
- **Current Gap** (estimated): Error paths, E2E validation
- **New Tests**: E2E-1, B4, error scenarios
- **Example**: Every code path in `validaEntrada` exercised

### src/helpers.ts (Utilities)
- **Target**: 100% line coverage
- **Current Gap**: Dependent on index.ts coverage
- **New Tests**: Same as index.ts

### src/erros/funcoesErro.ts (Error Handling)
- **Target**: 100% line coverage
- **Coverage**: All error branches tested
- **New Tests**: Extend error suite

---

## Test File Organization

### Current State
```
src/__tests__/
├── cli.test.ts        (12 tests, covers CLI + main flow)
├── index.test.ts      (implicitly tested via cli.test.ts)
├── funcoesErro.test.ts (error handling)
└── index.test.ts      (direct unit tests for analyzer functions)
```

### After M3
```
src/__tests__/
├── cli.test.ts        (12 + 4 existing + 4 E2E = ~20 tests)
│   ├── Unit: validaEntrada, processaArquivo, criaESalvaArquivo
│   ├── Regression: NaN validation (B4)
│   └── E2E: Full pipeline with file I/O
├── index.test.ts      (8 + 8 regression/edge = ~16 tests)
│   ├── Regression: Punctuation cleanup (B1), CRLF (B2), PT-BR (B3)
│   ├── Edge cases: Empty, whitespace-only, punctuation-only, mixed
│   └── Core logic: contaPalavras, extraiParagrafos, verificaPalavrasDuplicadas
└── funcoesErro.test.ts (extend error path coverage)
```

---

## Gate Checks (Before M4)

### Coverage Requirements
```bash
npm test

# Output must show:
✓ All tests pass (30+ tests)
✓ 100% coverage on:
  - src/index.ts
  - src/cli.ts
  - src/helpers.ts
  - src/erros/funcoesErro.ts
```

### Quality Gates
```bash
npm run lint      # ✓ No linting errors
npm run typecheck # ✓ No TypeScript errors
npm run build     # ✓ Compiles to dist/
```

### Regression Validation
```bash
# After running each regression test, verify:
✓ B1: Punctuation cleanup PASSING
✓ B2: CRLF handling PASSING
✓ B3: PT-BR punctuation PASSING
✓ B4: NaN validation PASSING
```

---

## Dependencies & Assumptions

### Dependencies on Previous Milestones
- **M0**: Git initialized + validaEntrada async ✓ (prerequisite)
- **M1**: All bug fixes implemented (punctuation, CRLF, PT-BR, NaN) — assumed complete
- **M2**: Build script + package.json correct — assumed up-to-date

### Assumptions About Code
- `contaPalavras(text)` returns accurate word count after cleaning
- `extraiParagrafos(text)` splits correctly on `\n` and `\r\n`
- `limpaPalavras(word)` removes punctuation appropriately
- `validaEntrada(opts)` is async and rejects invalid input
- File operations use `fs.promises` (async)

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Coverage gap** | Low | Moderate (hidden bugs) | Test edge cases comprehensively |
| **Flaky E2E tests** | Moderate | Low (caught early) | Use unique temp files per test |
| **Regression tests fail to catch resurface** | Low | High (portfolio damage) | Run all regression tests in CI |
| **Coverage tools miscalculate** | Low | Low (manual verification) | Review coverage report carefully |

---

## Success Metrics

✅ **Achieved when**:
1. `npm test` shows 100% coverage on all 4 critical files
2. All 4 regression tests passing (B1-B4)
3. All 4 edge case tests passing (E1-E4)
4. E2E integration test passing (file I/O verified)
5. Coverage report includes no uncovered lines

✅ **Portfolio readiness**: "100% test coverage" becomes your talking point — shows discipline + quality focus

---

**Status**: Ready for task breakdown  
**Next Step**: M3 Tasks.md (atomic implementation)
