# Design Template: [Feature Name]

**Feature:** [feature-name]  
**Date:** YYYY-MM-DD  
**Status:** Ready for implementation  
**Architecture Type:** [Refactor/Feature/Integration/Infrastructure]

---

## Architecture Overview

[ASCII diagram or visual representation of the system flow]

```
┌─────────────────┐
│   Component A   │
├─────────────────┤
│ - Responsibility│
│ - Dependency    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Component B   │
├─────────────────┤
│ - Responsibility│
└─────────────────┘
```

**Data Flow:**
- How data moves through the system
- Transformation points
- Storage/Retrieval points

---

## Function/Component Mapping

| Old Name | New Name | File | Type | Exports | Notes |
|----------|----------|------|------|---------|-------|
| `function1` | `newFunction1` | src/file.ts | Public | Yes | [Details] |
| `function2` | `newFunction2` | src/file.ts | Private | No | [Details] |

**Or for new features:**

| Component | Purpose | File | Public API |
|-----------|---------|------|-----------|
| NewComponent | [Purpose] | src/components/new.ts | Yes/No |

---

## Variable/Property Mapping

| Old | New | Usage | Scope |
|-----|-----|-------|-------|
| `var1` | `newVar1` | [Where used] | [Function/File] |
| `var2` | `newVar2` | [Where used] | [Function/File] |

---

## Import Dependencies

**Dependency Graph:**
```
A imports from B ✓ (allowed)
B imports from A ✗ (circular — avoid)
C imports from A, B ✓ (aggregator)
```

**Task Sequencing Implication:**
- ✅ Task X can run independently
- ⚠️ Task Y requires Task X done first
- ✅ Tasks A and B can run in parallel

---

## Message/UX Preservation

**DO NOT CHANGE (user-facing):**
- Console outputs: `console.log("mensagem em português")`
- Error messages: UI-visible strings
- Help text: CLI option descriptions
- Output formats

**CAN CHANGE (internal):**
- Variable names
- Function names
- Code comments
- Documentation

**Example:**
```typescript
// CHANGE: Function name
function validateInput() { ... }

// PRESERVE: Error message shown to user
console.error("Erro: entrada inválida"); // Still Portuguese!
```

---

## Alternative Approaches Considered

### Option 1: [Alternative]
- Pros: [+]
- Cons: [-]
- Rejected because: [Why not this]

### Option 2: [Alternative]
- Pros: [+]
- Cons: [-]
- **CHOSEN** because: [Why this option]

---

## Strategic Decisions

**Decision 1:** [What was decided]
- **Rationale:** [Why]
- **Alternatives:** What else was considered
- **Impact:** Consequences of this choice

**Decision 2:** [What was decided]
- **Rationale:** [Why]

---

## Testing Strategy

**Unit Tests:**
- Component A: Test {behavior1, behavior2}
- Component B: Test {behavior3, behavior4}

**Integration Tests:**
- A + B integration: Test {scenario1, scenario2}

**E2E Tests:**
- Full flow: Test {user story 1, user story 2}

**Coverage Goal:** 100% (statements + branches + lines)
