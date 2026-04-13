# Tasks Template: [Feature Name]

**Feature:** [feature-name]  
**Total Tasks:** N  
**Status:** Ready to execute  
**Estimated Time:** HH-MM minutes (e.g., 45-60 minutes)  
**Last Updated:** YYYY-MM-DD

---

## Task Overview

**Dependency Chain:**
```
T1 (independent)
 ├─→ T2 (depends on T1)
 │   ├─→ T3 (depends on T2)
 │   └─→ T4 (parallel with T3, depends on T1)
 │
 └─→ T5 (depends on T1, aggregates T2-T4)
```

**Critical Path:** T1 → T2 → T3 → T5  
**Can Parallelize:** T3 and T4 (after T1 + T2)

---

## Task Breakdown

### [ ] T1: [Brief Description]

**What:** What exactly needs to be done  
**Where:** File(s) to modify (e.g., src/index.ts, src/helpers.ts)  
**Depends on:** None / T0 / [List dependencies]  
**Reuses:** [ ] Nothing / [Output from T0]  

**Changes Required:**
1. Change A: [Detailed description]
2. Change B: [Detailed description]
3. Change C: [Detailed description]

**Done When:**
- ✅ [Criterion 1 - specific and testable]
- ✅ [Criterion 2 - specific and testable]
- ✅ [Criterion 3 - specific and testable]

**Verification:**
```bash
npm run typecheck    # 0 errors
npm test             # All tests pass
npm run lint         # 0 errors
```

**Gate Check:** [Which verification must pass]
- ✓ TypeScript compiles without errors
- ✓ All existing tests still pass
- ✓ No linting issues

**Notes:**
- [Any edge cases to watch for]
- [Common mistakes to avoid]

---

### [ ] T2: [Brief Description]

**What:** What exactly needs to be done  
**Where:** File(s) to modify  
**Depends on:** T1  
**Reuses:** T1 exports / changes  

**Changes Required:**
1. Change A
2. Change B

**Done When:**
- ✅ [Criterion 1]
- ✅ [Criterion 2]

**Verification:**
```bash
npm run typecheck
npm test
npm run lint
```

**Gate Check:**
- ✓ [Specific gates]

---

### [ ] T3: [Brief Description]

**What:** [Description]  
**Where:** [Files]  
**Depends on:** T2  
**Reuses:** [T2 outputs]  

**Changes Required:**
1. [Detail 1]
2. [Detail 2]

**Done When:**
- ✅ [Criterion 1]
- ✅ [Criterion 2]

**Verification:**
```bash
npm run typecheck
npm test
```

**Gate Check:**
- ✓ [Specific gates]

---

### [ ] T4: [Brief Description]

**What:** [Description]  
**Where:** [Files]  
**Depends on:** T1  
**Reuses:** [T1 outputs]  

**Changes Required:**
1. [Detail 1]
2. [Detail 2]

**Done When:**
- ✅ [Criterion 1]
- ✅ [Criterion 2]

**Verification:**
```bash
npm run typecheck
```

**Gate Check:**
- ✓ [Specific gates]

---

### [ ] T5: Final Verification + Commit

**What:** Run all gates + commit atomically  
**Where:** Workspace root  
**Depends on:** T1-T4 (all prior tasks)  
**Reuses:** Everything from T1-T4  

**Changes Required:**
1. Verify all tasks completed
2. Run full test suite
3. Create atomic commit

**Done When:**
- ✅ `npm test` → All tests passing
- ✅ `npm run typecheck` → 0 errors
- ✅ `npm run lint` → 0 errors
- ✅ `npm run build` → Compiles successfully
- ✅ `git status` → Working tree clean
- ✅ Commit created with detailed message

**Verification:**
```bash
npm test                  # All tests pass
npm run typecheck         # 0 errors
npm run lint              # 0 errors
npm run build             # Compiles
git status                # Working tree clean
git log --oneline | head -1  # Show commit
```

**Gate Check:**
- ✓ All tests pass (125/125 or equivalent)
- ✓ Zero TypeScript errors
- ✓ Zero ESLint errors
- ✓ Build succeeds
- ✓ Feature is fully integrated

**Commit Message Template:**
```
feat(scope): [feature description]

- What changed: [specific changes]
- Why: [rationale]
- Test verification: [what was verified]

Closes: [issue #, if applicable]
```

---

## Verification at Each Stage

### After T1
```bash
cd PrimeiraBiblioteca && npm run typecheck
```
Expected: 0 errors

### After T2
```bash
cd PrimeiraBiblioteca && npm run typecheck && npm test
```
Expected: 0 errors, all tests pass

### After T3-T4
```bash
cd PrimeiraBiblioteca && npm run typecheck && npm test
```
Expected: 0 errors, all tests pass

### At T5 (Final)
```bash
npm run typecheck    # 0 errors
npm run lint         # 0 errors
npm test             # All tests passing
npm run build        # dist/ generated
git status           # Working tree clean
```

---

## Parallel Execution Tips

**If tasks can run in parallel (e.g., T3 and T4 both depend on T2):**

1. Complete T1, T2 first (sequential)
2. Then execute T3 and T4 in parallel
3. Then execute T5 (aggregation)

**In practice:**
- Person A: Complete T3 while Person B: Completes T4
- Both run T5 verification using main branch state

---

## Common Task Patterns

### Pattern 1: Single File Refactor
```
T1: core function refactor
T2: test update  
T3: verify + commit
```

### Pattern 2: Multi-file Feature
```
T1: Create component A
T2: Create component B (depends on A exports)
T3: Create integration point
T4: Update tests
T5: Verify + commit
```

### Pattern 3: External Integration
```
T1: API wrapper
T2: CLI integration
T3: Error handling
T4: Tests + documentation
T5: Verify + commit
```

---

## Task Dependencies Reference

**Which tasks must complete before others can start:**

```
Nothing → T1 (start here)
T1 → T2 (requires T1 to finish)
T1 → T3 (requires T1 to finish)
T1, T2 → T5 (requires both T1 and T2)
```

**Can run in parallel:** Tasks with no dependencies on each other

---

## Estimated Breakdown

| Phase | Duration | Tasks | Status |
|-------|----------|-------|--------|
| Planning | - | Spec + Design | Pre-implementation |
| Implementation | ~20-30 min | T1-T4 | During task execution |
| Verification | ~5-10 min | T5 | After all complete |
| **Total** | **45-60 min** | 5 tasks | Typically 1 session |

*Estimates vary based on complexity; adjust as needed*
