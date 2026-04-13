# Risks: Refactor Codebase from Portuguese to English

**Feature:** refactor-to-english  
**Date:** 2026-04-13  
**Status:** Ready for planning  

---

## Risk Matrix

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|-----------|
| R1 | Broken imports in tests (function rename misses a call site) | **Medium** | **High** | T4-T6 updates ALL test call sites; npm test validates |
| R2 | Inconsistent renaming (some functions renamed, others missed) | **Low** | **High** | Checklist in each task; TypeScript catches most |
| R3 | User messages accidentally translated (PT-BR → English) | **Low** | **High** | Visual diff review; grep for remaining PT-BR after refactor |
| R4 | Functional behavior changes unexpectedly | **Low** | **Critical** | No logic changes; variables are mechanical renames; tests validate 1:1 |
| R5 | TypeScript compilation fails post-refactor | **Low** | **High** | npm run typecheck after each task; gate check |
| R6 | Test count differs post-refactor (125 → X) | **Very Low** | **Medium** | npm test reports count; regression if ≠ 125 |
| R7 | Code coverage drops below 100% | **Very Low** | **Medium** | npm test + coverage report; verify coverage/index.html |
| R8 | CLI smoke test fails (node dist/cli.js breaks) | **Low** | **High** | Manual smoke test in T7; run built CLI with sample input |

---

## Risk Details

### R1: Broken Imports in Tests ⚠️ HIGHEST PRIORITY
**Status:** Medium probability, High impact  

**What can go wrong:**
- Test file updates function call from `contaPalavras` → `countWords`
- But missed ONE call site (grep finds 95 of 96 calls)
- Test fails at runtime: `TypeError: contaPalavras is not a function`

**Why it matters:**
- Tests are 125 critical validations
- Single broken test = entire feature fails gate
- Coverage drops from 100% → 99.x%

**Mitigation:**
1. Search-and-replace uses **global scope** (not line-by-line)
   ```bash
   # WRONG (misses some):
   sed -i 's/contaPalavras/countWords/g' src/__tests__/index.test.ts
   
   # RIGHT (catches all):
   grep -n "contaPalavras" src/__tests__/*.ts  # Show all first
   npm test  # Validate after
   ```
2. After each test file update (T4, T5a, T5b): run `npm test` immediately
3. Diff output before/after to spot missed renames

**Rollback Trigger:**
- `npm test` shows count ≠ 125 OR fails with "is not a function"

---

### R2: Inconsistent Renaming (Some Functions Missed) ⚠️ MEDIUM
**Status:** Low probability, High impact  

**What can go wrong:**
- Feature spec lists 13 functions to rename
- Accidentally rename 12 (miss one: e.g., `limpaPalavras` stayed as-is)
- Code compiles but behavior is half-refactored
- Confusing for future maintainers

**Why it matters:**
- Feature fails acceptance (REQ-001, REQ-002 incomplete)
- Mixed naming convention undermines goal
- Inconsistency in code quality

**Mitigation:**
1. Checklist per task (T1, T2, T3):
   ```markdown
   ### T1 Checklist:
   - [ ] contaPalavras → countWords
   - [ ] extraiParagrafos → extractParagraphs
   - [ ] verificaPalavrasDuplicadas → analyzeWordFrequency
   - [ ] limpaPalavras → cleanWord
   ...additional checks...
   ```
2. Use IDE "Find All References" to verify zero matches for old name
3. npm run typecheck catches if old name still exported

**Rollback Trigger:**
- grep finds old Portuguese names in refactored file

---

### R3: User Messages Accidentally Translated (PT-BR Corrupted) ⚠️ CRITICAL
**Status:** Low probability, Critical impact  

**What can go wrong:**
- Task says "PRESERVE: messages stay PT-BR"
- Developer does global find-replace: `palavra → word`
- Accidentally changes: `"palavras duplicadas no parágrafo"` → `"words duplicated in paragraph"`
- User-facing output breaks

**Why it matters:**
- REQ-005 explicitly forbids this
- UX breaks for Portuguese users
- Feature violates spec

**Mitigation:**
1. **Before refactor:** Extract all user-facing strings to a checklist
   ```bash
   grep -n "console.log\|throw new\|Error(" src/*.ts | grep -E "['\"](.*português)" > messages-to-preserve.txt
   ```
2. **Post-refactor:** Verify messages unchanged
   ```bash
   grep -n "palavras duplicadas no parágrafo" src/helpers.ts  # Must exist
   npm test  # Assertion error if message changed
   ```
3. Code review: Visual diff check message strings before commit

**Rollback Trigger:**
- npm test assertion fails (message check fails)
- Manual grep finds English versions of PT-BR messages

---

### R4: Functional Behavior Changes Unexpectedly 🔴 CATASTROPHIC
**Status:** Very Low probability, Critical impact  

**What can go wrong:**
- Variable rename changes logic unintentionally
  ```typescript
  // Example (hypothetical):
  // OLD: if (resultado.count > 0)
  // NEW: if (result.result > 0)  ← TYPO! "result.result" instead of "result.count"
  ```
- Function returns wrong type or value
- Subtle bug in word counting logic

**Why it matters:**
- Entire feature premise: "zero functional changes"
- If behavior changes, feature is no longer a pure refactor
- Requires full re-testing and possibly re-design

**Mitigation:**
1. **Mechanical refactor only:** Never change logic, only names
   - No `if` statements refactored
   - No algorithm changes
   - No type changes
2. **Test suite is source of truth**
   - Pre-refactor: 125 tests passing
   - Post-refactor: Must still be 125, same assertions
3. **Smoke test:** Run CLI on actual file
   ```bash
   node dist/cli.js --texto arquivos/texto-web.txt --destino ./smoke-out
   ```
   Compare output with pre-refactor run

**Rollback Trigger:**
- npm test fails (assertion shows different behavior)
- Smoke test output differs from baseline
- Coverage drops below 100%

---

### R5: TypeScript Compilation Fails Post-Refactor
**Status:** Low probability, High impact  

**What can go wrong:**
- Function renamed in source but NOT all import statements
- Export statement missed
- Type import uses old name
  ```typescript
  // OLD: type ContagemParagrafo = ...
  // NEW: type WordCountMap = ...
  // BUG: import { ContagemParagrafo } from '../index.js'  // ← MISSED
  ```
- TypeScript fails: `Cannot find name 'ContagemParagrafo'`

**Why it matters:**
- Build gate fails: `npm run build` fails
- Feature cannot ship if TypeScript doesn't compile
- Blocks other developers

**Mitigation:**
1. After each source file refactor (T1, T2, T3): Run `npm run typecheck`
2. After each test refactor (T4, T5a, T5b): Run `npm run typecheck`
3. Gate: Must pass before moving to next task

**Rollback Trigger:**
- `npm run typecheck` shows errors
- `npm run build` fails

---

### R6: Test Count Differs Post-Refactor (125 → X)
**Status:** Very Low probability, Medium impact  

**What can go wrong:**
- Accidentally delete a test during refactor
- Typo in function name means entire test suite doesn't run
- Test file import fails silently
  ```bash
  npm test  # 124 passing instead of 125 (one test missing)
  ```

**Why it matters:**
- Coverage drops
- Feature incomplete (missing validation)

**Mitigation:**
1. npm test output shows: `✓ 125 passing`
2. grep pre-refactor vs post-refactor test count
   ```bash
   grep "describe\|it(" src/__tests__/index.test.ts | wc -l  # Must be same before/after
   ```

**Rollback Trigger:**
- npm test count ≠ 125

---

### R7: Code Coverage Drops Below 100%
**Status:** Very Low probability, Medium impact  

**What can go wrong:**
- Logic branch accidentally unreachable after rename
- Dead code not cleaned up during refactor
- Test doesn't run (import failure)

**Why it matters:**
- Project goal: 100% coverage
- Feature spec requires 100% maintained (REQ-006)
- Regression from maintenance perspective

**Mitigation:**
1. Run coverage report post-refactor:
   ```bash
   npm test         # Auto-generates coverage/
   open coverage/index.html  # Check visual report
   ```
2. Diff coverage metrics before/after

**Rollback Trigger:**
- coverage/coverage-final.json shows < 100% statements covered

---

### R8: CLI Smoke Test Fails (Binary Breaks)
**Status:** Low probability, High impact  

**What can go wrong:**
- dist/cli.js generated but doesn't run
- CLI help text broken
- CLI can't parse arguments
- CLI crashes on actual text input

**Why it matters:**
- Feature is supposed to maintain **zero behavioral changes**
- If CLI breaks, feature failed its core goal
- Users can't use the tool

**Mitigation:**
1. After T7 verification, run smoke test:
   ```bash
   npm run build
   node dist/cli.js --help           # CLI runs, shows help
   echo "test" > /tmp/test.txt
   node dist/cli.js --texto /tmp/test.txt --destino /tmp/out  # Produces output
   cat /tmp/out/*.txt                # Verify output contents (PT-BR messages present)
   ```
2. Compare with baseline (pre-refactor smoke test output)

**Rollback Trigger:**
- CLI crashes with error
- Output differs from pre-refactor baseline

---

## 📊 Risk Scoring

```
Risk Score = (Probability × Impact) / Prevention Effort

R1 (Imports):              (Medium × High) / Low Effort      = 3.0  ⚠️ WATCH CLOSELY
R2 (Inconsistency):        (Low × High) / Very Low Effort    = 2.0
R3 (Messages Corrupted):   (Low × Critical) / Very Low Effort = 2.5  🔴 HIGHEST ALERT
R4 (Behavior Change):      (Very Low × Critical) / Low Effort = 1.5
R5 (TypeScript Fails):     (Low × High) / Very Low Effort     = 2.0
R6 (Test Count):           (Very Low × Medium) / Very Low     = 0.75
R7 (Coverage Drop):        (Very Low × Medium) / Very Low     = 0.75
R8 (CLI Breaks):           (Low × High) / Low Effort          = 2.0
```

---

## 🚨 Rollback Plan

### Trigger Conditions (Execute Rollback If ANY of These Occur)

```
IF: npm test shows count ≠ 125
OR: npm test fails with "is not a function"
OR: npm run typecheck shows errors
OR: npm run build fails
OR: code coverage < 100%
OR: grep finds old Portuguese names in refactored files
OR: Smoke test output differs from baseline
THEN: Execute rollback (below)
```

### Rollback Steps (Atomic)

**Step 1:** Revert last commit
```bash
git reset --hard HEAD~1
```

**Step 2:** Validate pre-refactor state
```bash
npm run typecheck    # Should be clean
npm run lint         # Should be clean
npm test             # Should show 125 passing
npm run build        # Should compile
```

**Step 3:** Determine root cause
```bash
# Was it T1? T2? T3? or T4-T6?
# Check git log to see which commit failed
git log --oneline | head -5
```

**Step 4:** Recommence from previous successful state
- If T1 failed: Redo T1 with extra care
- If T4 failed: Redo T1-T3 first (ensure source is correct), then redo T4

**Step 5:** Verify regression fully resolved
```bash
npm test
npm run build
npm run lint
npm run typecheck
```

---

## ⚠️ Known Limitations

1. **No automated diff generation:** Must manually spot-check variable renames (no linting rule exists for Portuguese → English renaming)
2. **Test messages are hard-coded:** If a test message contains Portuguese, it must be updated manually (no automatic translation)
3. **Edge cases with special characters:** Accented Portuguese characters (ã, ç, é) may cause encoding issues in search-replace; test with UTF-8 validation

---

## ✅ Gates (Required for Feature Completion)

All gates must pass before commit:

| Gate | Command | Expected | Failure Action |
|------|---------|----------|-----------------|
| **Syntax** | `npm run typecheck` | 0 errors | Rollback |
| **Linting** | `npm run lint` | 0 errors | Rollback |
| **Tests** | `npm test` | 125/125 passing | Rollback |
| **Coverage** | Check coverage/coverage-final.json | 100% | Rollback |
| **Build** | `npm run build` | dist/cli.js generated | Rollback |
| **Smoke Test** | Manual CLI run | Output matches baseline | Rollback |

---

## 📝 Sign-Off

**This risks document covers:**
- ✅ 8 distinct risks (R1-R8)
- ✅ Probability/Impact scoring
- ✅ Mitigation steps for each risk
- ✅ Atomic rollback procedure
- ✅ Clear rollback triggers
- ✅ Known limitations documented
- ✅ All gates defined

**Approved for implementation:** When all 4 files (FEATURE-SPEC.md, DESIGN.md, TASKS.md, RISKS.md) reviewed and approved.
