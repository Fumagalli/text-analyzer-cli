# text-analyzer-cli Development Workflow

> Instruciones para toda interacción con este proyecto. El agente debe seguir este patrón automáticamente.

## 🚀 On Every Session Start

1. **Check Project Status**
   - Read: `/memories/repo/PROGRESS.md`
   - If file doesn't exist → Project is complete (see maintenance section below)
   - Identify current milestone and last completed task

2. **Read Context**
   - Project facts: `/memories/repo/text-analyzer-cli-facts.md`
   - Project vision: `.specs/project/PROJECT.md`
   - Current milestone spec: `.specs/features/[milestone]/spec.md`
   - If task exists: `.specs/features/[milestone]/design.md` + `tasks.md`

3. **Execute Next Task**
   - From PROGRESS.md: Find first `[ ]` task
   - Read requirements from design.md + tasks.md
   - Implement → Test → Commit → Update PROGRESS.md

## 🔧 Execution Pattern (Per Task)

```
IMPLEMENT
  ├─ Make code changes
  └─ Update files atomically

TEST (Gate Check)
  ├─ npm test
  ├─ npm run lint
  ├─ npm run typecheck
  └─ All must pass ✓

COMMIT (Atomic + Traceable)
  └─ git commit -m "type(scope): description"
     (Include WHY, not just WHAT)

UPDATE PROGRESS.md
  ├─ Mark task [x]
  ├─ Add completion timestamp
  ├─ Note any learnings
  └─ Identify next task

CONSOLIDATE (If milestone complete)
  └─ Transfer learnings to `.specs/project/STATE.md`
```

## 📝 Commit Message Format

```
type(scope): short description

- What changed (specific files/functions)
- Why it was needed (bug fix, feature, refactor)
- Test coverage maintained/improved

Fixes: #REQ-XYZ
```

Examples:
```
fix(analyzer): move length check after punctuation cleanup

- verificaPalavrasDuplicadas now calls limpaPalavras before length validation
- Prevents counting short words with punctuation as duplicates
- Fixes BUG-01 and BUG-02

Fixes: #BUG-01, #BUG-02
```

## 📊 Active Development Phase

**Current Phase**: M0 - Foundation Setup  
**Status**: In Progress  
**Last Update**: 2026-04-10

When PROGRESS.md exists → Project is in active development

Files to update:
- `PROGRESS.md` — After each task (1-2 min)
- `.specs/project/STATE.md` — After each milestone (5 min)
- `git` — Atomic commits with clear messages

## 🏁 Project Complete Phase (Maintenance)

When PROGRESS.md is deleted/archived → Project is complete

**Workflow changes**:
- Don't create tasks, read STATE.md for context
- If modifying code: Ensure tests still pass (regression)
- If adding new features: Create new `.specs/features/[feature-name]/spec.md`
- Switch instructions to "maintenance mode"

**How to detect**: 
1. Look for PROGRESS.md → if missing, project is done
2. Check `.claude/instructions.md` → if says "maintenance mode", project is stable
3. Reference STATE.md for past decisions (immutable record)

## 📂 Key Reference Files

| File | Purpose | Update Frequency |
|------|---------|-------------------|
| PROGRESS.md | Current sprint tracker | After each task |
| STATE.md | Project history + lessons | After each milestone |
| .specs/features/[m]/spec.md | Feature requirements | Once (design phase) |
| .specs/features/[m]/design.md | Architecture + approach | Once (design phase) |
| .specs/features/[m]/tasks.md | Task breakdown + gates | Once (design phase) |
| WORKFLOW.md | Process documentation | Reference only |

## 🎯 Gate Checks (Must Pass Before Proceeding)

```bash
# After every task/commit, run:
npm test           # All tests pass
npm run lint       # Zero eslint errors
npm run typecheck  # Zero TypeScript errors

# After M2+, also run:
npm run build      # Compiles to dist/ successfully
```

## ❓ If Stuck

1. Check PROGRESS.md for task requirements
2. Check design.md for architectural guidance
3. Check tasks.md for acceptance criteria + independent test
4. Check STATE.md for past learnings (might apply)
5. If blocker: Update PROGRESS.md with blocker entry

---

**Last Updated**: 2026-04-10  
**Version**: 1.0  
**Next Review**: After M0 completion
