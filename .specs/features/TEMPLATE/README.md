# Feature Template — Starter Files

This folder contains **template files** for creating new features that comply with the TDD + TLC-spec-driven pattern.

## 📋 What's Inside

| File | Purpose | Status |
|------|---------|--------|
| `FEATURE-SPEC-TEMPLATE.md` | Template for FEATURE-SPEC.md (What + Why + Requirements) | ✅ Use as-is |
| `DESIGN.md` | Template for DESIGN.md (Architecture + Strategy) | ✅ Use as-is |
| `TASKS.md` | Template for TASKS.md (Step-by-step breakdown) | ✅ Use as-is |
| `RISKS.md` | Template for RISKS.md (Risks + Rollback) | ✅ Use as-is |

## 🚀 How to Use These Templates

### Step 1: Create Your Feature Directory
```bash
cd .specs/features/
mkdir [your-feature-name]
cd [your-feature-name]
```

### Step 2: Copy Templates
```bash
cp ../TEMPLATE/FEATURE-SPEC-TEMPLATE.md FEATURE-SPEC.md
cp ../TEMPLATE/DESIGN.md DESIGN.md
cp ../TEMPLATE/TASKS.md TASKS.md
cp ../TEMPLATE/RISKS.md RISKS.md
```

### Step 3: Customize Templates
Edit each file to match your feature:
- [ ] FEATURE-SPEC.md — Define WHAT and WHY
- [ ] DESIGN.md — Define HOW and WHY
- [ ] TASKS.md — Break into STEP-BY-STEP
- [ ] RISKS.md — Identify and mitigate risks

### Step 4: Get Review
```
@agent Review .specs/features/[feature-name]/ for TDD compliance
```

### Step 5: Implement
```
@agent Use skill tlc-spec-driven to implement [feature-name]
```

## 📚 Example Features

- **Completed**: [../refactor-to-english/](../refactor-to-english/) — Refactor codebase to English
- **Templates**: This folder (../TEMPLATE/)
- **Archived**: [../../../.specs/ARCHIVED-FEATURES/](../../../.specs/ARCHIVED-FEATURES/) — Historical examples

## ✅ TDD Compliance Checklist

Before using templates, understand the **7 mandatory TDD elements:**

1. **Context** (FEATURE-SPEC.md: Vision)
2. **Problem Statement** (FEATURE-SPEC.md: Requirements)
3. **Scope** (FEATURE-SPEC.md: In-Scope/Out-of-Scope)
4. **Technical Solution** (DESIGN.md: Architecture)
5. **Risks** (RISKS.md: Risk Matrix)
6. **Implementation Plan** (TASKS.md: Task Breakdown)
7. **Rollback Plan** (RISKS.md: Rollback Plan)

**If any element is missing, the feature does NOT comply with TDD and should not be implemented.**

## 📖 Learning Resources

1. **Full Guide**: Read [.claude/FEATURE-DEVELOPMENT-GUIDE.md](../../../.claude/FEATURE-DEVELOPMENT-GUIDE.md)
2. **Working Example**: Study [../refactor-to-english/](../refactor-to-english/)
3. **TLC Skill Docs**: Read [skills/tlc-spec-driven/](../../../.claude/skills/tlc-spec-driven/SKILL.md)
4. **TDD Skill Docs**: Read [skills/technical-design-doc-creator/](../../../.claude/skills/technical-design-doc-creator/README.md)

## 🎯 Quick Tips

### ✅ Do
- Use these templates as starting point
- Customize for your specific feature
- Get review before implementing
- Keep all 4 files up-to-date during development
- Archive templates when feature is complete

### ❌ Don't
- Skip any of the 7 TDD elements
- Start coding before templates are complete
- Leave templates generic (customize them!)
- Delete the TEMPLATE folder itself
- Change template file names (always use: FEATURE-SPEC.md, DESIGN.md, TASKS.md, RISKS.md)

## 🔄 When to Use These Templates

**Always use for:**
- ✅ New features (REQ functionality)
- ✅ Large refactors (architectural changes)
- ✅ Integrations (external systems)
- ✅ Infrastructure changes
- ✅ Anything > 1 week effort

**Can skip for:**
- ❌ Small bug fixes (< 1 hour effort)
- ❌ Documentation updates
- ❌ Configuration tweaks
- ❌ One-line code changes

**When in doubt: Use the templates.** Better to over-document than under-plan.

## 📞 Questions?

Review the associated documentation:
- **Feature Development**: [FEATURE-DEVELOPMENT-GUIDE.md](../../../.claude/FEATURE-DEVELOPMENT-GUIDE.md)
- **Current Instructions**: [instructions.md](../../../.claude/instructions.md)
- **Project Workflow**: [WORKFLOW.md](../../../WORKFLOW.md)
