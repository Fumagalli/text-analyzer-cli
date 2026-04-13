# Risks Template: [Feature Name]

**Feature:** [feature-name]  
**Created:** YYYY-MM-DD  
**Status:** Planning phase

---

## Risk Matrix

Identify and mitigate risks **before** implementation.

| Risk ID | Risk Description | Category | Probability | Impact | Severity | Mitigation Strategy | Owner |
|---------|------------------|----------|-------------|--------|----------|---------------------|-------|
| R-001 | [Risk] | [Technical/Integration/Testing] | Low/Medium/High | Low/Medium/High | [Low/Medium/High] | [How to prevent] | [Who handles] |
| R-002 | [Risk] | [Category] | [Prob] | [Impact] | [Severity] | [Mitigation] | [Owner] |

**Severity Calculation:** Probability × Impact

| Probability | Impact | Severity |
|-------------|--------|----------|
| Low (1) × Low (1) | = Low | 1 |
| Low (1) × Medium (2) | = Low | 2 |
| Medium (2) × Medium (2) | = Medium | 4 |
| Medium (2) × High (3) | = High | 6 |
| High (3) × High (3) | = Critical | 9 |

---

## Example Risks (Customize for your feature)

### Risk R-001: Test Coverage Drop
**Description:** Adding new code without sufficient tests drops coverage below 100%  
**Category:** Testing  
**Probability:** Medium  
**Impact:** High (fails CI/CD gate)  
**Mitigation:**
- [ ] Write tests alongside code (not after)
- [ ] Run `npm test` after each task
- [ ] Require 100% coverage before commit
- [ ] Use `npm run build` to verify coverage report

**Owner:** Development team

---

### Risk R-002: Breaking Changes in Public API
**Description:** Renaming functions breaks downstream dependents  
**Category:** Integration  
**Probability:** Medium  
**Impact:** High (downstream breakage)  
**Mitigation:**
- [ ] Review DESIGN.md function mapping carefully
- [ ] Create aliases for old names (deprecation period)
- [ ] Update all imports + function calls in current repo
- [ ] Run `npm run typecheck` to catch import errors
- [ ] Document migration path for external users

**Owner:** Tech lead

---

### Risk R-003: Circular Dependencies
**Description:** New imports create circular dependency patterns  
**Category:** Technical  
**Probability:** Low  
**Impact:** Medium (TypeScript compilation fails)  
**Mitigation:**
- [ ] Review DESIGN.md dependency graph before implementing
- [ ] Run `npm run typecheck` after each task
- [ ] Use dependency graph visualization tools if needed
- [ ] Refactor imports if circular pattern emerges

**Owner:** Development team

---

### Risk R-004: Performance Degradation
**Description:** New code introduces performance bottleneck  
**Category:** Technical  
**Probability:** Low  
**Impact:** Medium (slower execution)  
**Mitigation:**
- [ ] Profile before + after implementation
- [ ] Document any algorithmic changes in DESIGN.md
- [ ] Test with realistic dataset sizes
- [ ] Establish performance baseline

**Owner:** Development team

---

### Risk R-005: Incomplete Testing
**Description:** Some code paths not covered by tests  
**Category:** Testing  
**Probability:** Medium  
**Impact:** High (bugs in production)  
**Mitigation:**
- [ ] Write branch coverage tests (if/else paths)
- [ ] Test edge cases (empty inputs, null, etc.)
- [ ] Test error paths (validation failures, etc.)
- [ ] Aim for >100% branch coverage during implementation

**Owner:** Development team

---

## Rollback Plan

**If something breaks during or after implementation:**

### Rollback Procedure (< 5 minutes)

```bash
# Step 1: Identify the issue
# Look at error messages, test failures, or CI/CD logs

# Step 2: Reset to previous known-good state
git reset --hard HEAD~1    # Go back 1 commit
# OR
git reset --hard HEAD~3    # Go back 3 commits (if multiple tasks were committed)

# Step 3: Validate rollback
npm test                   # Verify tests pass
npm run typecheck          # Verify no TypeScript errors
npm run lint               # Verify no linting errors
npm run build              # Verify build succeeds

# Step 4: Confirm state
git log --oneline | head -3   # Show last 3 commits
git status                    # Should be "working tree clean"
```

### When to Trigger Rollback

**Automatic rollback triggers:**
- ✅ `npm test` fails (1+ tests broken)
- ✅ `npm run typecheck` shows TypeScript errors
- ✅ `npm run lint` fails with blocking errors
- ✅ `npm run build` cannot compile
- ✅ Critical functionality broken (verified by smoke test)

**Manual rollback triggers:**
- ❌ Integration issue with another feature (coordinate with team)
- ❌ Scope creep discovered mid-way (pause, reassess, may need new feature)
- ❌ Hidden assumption was wrong (pause, update DESIGN.md, retry)

---

## Rollback Recovery Process

**After Rolling Back:**

1. **Investigate** (10 min)
   ```bash
   git diff HEAD~1 HEAD
   # Read the code that was reverted
   # Identify the problem
   ```

2. **Update DESIGN.md** (5 min)
   - Document what went wrong
   - Update strategy based on findings

3. **Fix and Retry** (20 min)
   ```bash
   # Make corrected implementation
   # Test thoroughly before commit
   ```

4. **Commit Fixed Version** (5 min)
   ```bash
   git commit -m "fix(scope): description

   - Issue: [What was wrong]
   - Solution: [What changed]
   - Tests: [Verification]
   
   Fixes: #R-XXX, #rollback-1"
   ```

---

## Known Limitations

**Things that won't be addressed in this feature:**

1. **Limitation 1:** [Scope/Feature limit]
   - Reason: [Why deferred]
   - Future: Phase/Milestone when addressed

2. **Limitation 2:** [Technical limit]
   - Reason: [Why can't do it now]
   - Workaround: [Temporary solution if available]

3. **Limitation 3:** [Resource constraint]
   - Reason: [Why deferred]
   - Future: [When revisit]

---

## Risk Sign-off

**Before implementation, verify:**

- [ ] All high-severity risks have mitigation
- [ ] Rollback plan is testable in <5 minutes
- [ ] Team is aware of known limitations
- [ ] Dependencies are documented in TASKS.md
- [ ] Recovery process is clear

**Sign-off:**
- [ ] Product Owner agrees with risk level
- [ ] Tech Lead approves mitigation strategy
- [ ] Team confirms they can execute rollback if needed

---

## Mitigation Checklist (During Implementation)

Run this checklist at each task:

- [ ] New code has tests (same task or T-tests task)
- [ ] No new circular dependencies introduced
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes (all tests)
- [ ] `npm run lint` passes
- [ ] No breaking changes to public API (or properly documented)
- [ ] Performance acceptable
- [ ] Edge cases considered

---

## Post-Implementation Review

**After feature is complete, answer:**

1. Did any of the predicted risks materialize? 
   - [ ] Yes (document what happened)
   - [ ] No (update risk probability for future projects)

2. New risks discovered?
   - [ ] Yes (document for future phases)
   - [ ] No

3. Did mitigation strategies work as planned?
   - [ ] Yes (keep approach for future projects)
   - [ ] No (update strategy in next similar feature)

4. Lessons learned?
   - [ ] [Document here for DECISIONS.md]
