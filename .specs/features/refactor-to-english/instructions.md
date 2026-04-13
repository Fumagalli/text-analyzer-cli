# Instructions: Refactor Codebase from Portuguese to English

**Feature Path:** `.specs/features/refactor-to-english/`  
**Status:** Ready for review and implementation  
**Created:** 2026-04-13

---

## Quick Start

**Location of this feature's documentation:**
```
PrimeiraBiblioteca/.specs/features/refactor-to-english/
├── instructions.md   ← You are here (navigation guide)
├── spec.md          ← Read first (understand WHAT)
├── design.md        ← Read second (understand HOW)
└── tasks.md         ← Read third (execute STEP BY STEP)
```

---

## Reading Order (Recommended)

### Step 1: Understand WHAT (2 min)
📖 **Read:** [spec.md](spec.md)

**What you'll learn:**
- Vision: Why are we doing this?
- 8 Requirements (REQ-001 to REQ-008)
- Success criteria
- Out-of-scope items

**Key questions answered:**
- What is being changed?
- What is NOT being changed?
- How do we know when we're done?

---

### Step 2: Understand HOW (5 min)
📖 **Read:** [design.md](design.md)

**What you'll learn:**
- How the refactor will be executed
- Complete function mapping (old → new names)
- Complete variable mapping (old → new names)
- Message preservation strategy
- Testing strategy
- Reference update graph

**Key sections:**
- **Architecture Overview** — Visual flow
- **Function Mapping** — All 11 renames
- **Variable Mapping** — All ~30 renames by file
- **Message Preservation** — What to KEEP unchanged
- **Testing Strategy** — When/how to test

---

### Step 3: Execute STEP BY STEP (45-60 min)
📖 **Follow:** [tasks.md](tasks.md)

**What you'll do:**
- Execute 7 tasks in sequence: T1 → T2 → ... → T7
- Each task has:
  - ✅ Exact scope (what to change)
  - ✅ Dependency information (what must be done first)
  - ✅ Verification command (how to confirm it worked)
  - ✅ Gate check (what must pass)

**The 7 tasks:**
1. **T1** — Refactor src/index.ts (core library)
2. **T2** — Refactor src/helpers.ts (depends on T1)
3. **T3** — Refactor src/cli.ts (depends on T1 + T2)
4. **T4** — Update tests for index.ts (depends on T1)
5. **T5** — Update tests for cli.ts (depends on T3 + T2)
6. **T6** — Verify error handler tests (depends on T1-T3)
7. **T7** — Run all gates + commit (depends on T1-T6)

---

## Key Constraints

### ✅ DO Change
- Function names (Portuguese → English)
- Variable names (Portuguese → English)
- Interface/type names (Portuguese → English)
- JSDoc comments (Portuguese → English)
- All three source files (index.ts, helpers.ts, cli.ts)
- All three test files (update imports + calls)

### ❌ DO NOT Change
- User-facing messages (stay Portuguese)
  - Console logs: `"arquivo criado com sucesso"`
  - Error messages: `"Arquivo não encontrado"`
  - Help text: `"caminho do texto a ser processado"`
  - Output format: `"palavras duplicadas no parágrafo"`
- CLI functionality (behavior must be identical)
- Test count (must stay 125/125)
- Package.json dependencies or versions
- README or documentation (can stay bilingual)

---

## Function Mapping Quick Reference

| Old | New |
|-----|-----|
| `ContagemParagrafo` | `WordCountMap` |
| `contaPalavras` | `countWords` |
| `extraiParagrafos` | `extractParagraphs` |
| `verificaPalavrasDuplicadas` | `analyzeWordFrequency` |
| `limpaPalavras` | `cleanWord` |
| `filtraOcorrencias` | `filterOccurrences` |
| `montaSaidaArquivo` | `buildOutputFormat` |
| `validaInteiroPositivo` | `validatePositiveInteger` |
| `validaEntrada` | `validateInput` |
| `processaArquivo` | `processFile` |
| `criaESalvaArquivo` | `createAndSaveFile` |

**👉 Full mapping table in [design.md → Function Mapping](design.md#function-mapping-req-001)**

---

## Variable Mapping Quick Reference

| Old | New | File |
|-----|-----|------|
| `texto` | `text` | All files |
| `palavra` | `word` | index.ts |
| `paragrafo` | `paragraph` | All files |
| `resultado` | `result` | index.ts, cli.ts |
| `caminhoTexto` | `textPath` | cli.ts |
| `caminhoDestino` | `destinationPath` | cli.ts |
| `listaPalavras` | `wordList` | index.ts, helpers.ts |
| `conteudo` | `content` | cli.ts |

**👉 Full mapping table in [design.md → Variable Mapping](design.md#variable-mapping-req-002)**

---

## Dependency Chain

```
T1: src/index.ts (independent)
    ↓
    ├─→ T2: src/helpers.ts (needs T1 exports)
    │   ↓
    │   ├─→ T3: src/cli.ts (needs T1 + T2 exports)
    │   │   ├─→ T4: index.test.ts
    │   │   ├─→ T5: cli.test.ts
    │   │   └─→ T6: funcoesErro.test.ts
    │   │
    │   └─→ [All can run in parallel: T4, T5, T6]
    │
    └─→ T7: Gates + Commit (requires T1-T6)
```

**Critical path:** T1 → T2 → T3 → T7  
**Can parallelize:** T4, T5, T6 (after T1-T3 done)

---

## Verification at Each Step

### After T1 (index.ts)
```bash
npm run typecheck
# Expected: 0 errors
```

### After T2 (helpers.ts)
```bash
npm run typecheck
# Expected: 0 errors
```

### After T3 (cli.ts)
```bash
npm run typecheck
# Expected: 0 errors
```

### After T4-T6 (test files)
```bash
npm run typecheck
# Expected: 0 errors
```

### At T7 (final gates)
```bash
npm run typecheck    # 0 errors
npm run lint         # 0 errors
npm test             # 125/125 passing
npm run build        # dist/cli.js generated
```

---

## How to Use During Implementation

### When starting a task:
1. Open [tasks.md](tasks.md)
2. Find your task (e.g., T1, T2, etc.)
3. Read: **What**, **Where**, **Changes Required**
4. Open the file mentioned
5. Make the changes according to the mapping table in [design.md](design.md)
6. Run the verification command
7. Mark task done: `[x] T1`

### If you get stuck:
1. Check: **Done When** criteria (in tasks.md)
2. Check: **Verification** command (run it)
3. Check: **Gate** requirement
4. Consult [design.md](design.md) for detailed mappings
5. Cross-reference [spec.md](spec.md) for requirements

---

## Success Criteria (Final)

✅ **All 7 tasks complete**
- [ ] T1 done
- [ ] T2 done
- [ ] T3 done
- [ ] T4 done
- [ ] T5 done
- [ ] T6 done
- [ ] T7 done

✅ **All gates pass (at T7)**
- `npm run typecheck` → 0 errors
- `npm run lint` → 0 errors
- `npm test` → 125/125 passing
- `npm run build` → dist/cli.js generated

✅ **Smoke test passes**
- CLI behavior identical
- Messages still Portuguese
- Output format unchanged

✅ **Commit created**
- Single atomic commit
- Detailed message with rationale

---

## File Overview

| File | Purpose | Read When |
|------|---------|-----------|
| **instructions.md** | Navigation guide + quick reference tables | First (understand how to use the docs) |
| **spec.md** | 8 requirements, acceptance criteria, success metrics | Before starting (understand WHAT) |
| **design.md** | Detailed function mapping, variable mapping, reference graphs | Before coding (understand HOW) |
| **tasks.md** | 7 atomic tasks with exact steps and verification | During implementation (execute STEP BY STEP) |

---

## Critical: Message Strings to Preserve

These strings must NOT change (stay in Portuguese):

```
✓ "arquivo criado"
✓ "arquivo criado com sucesso"
✓ "erro: "
✓ "deve ser um número inteiro positivo"
✓ "Arquivo precisa ter extensão .txt"
✓ "Arquivo não encontrado"
✓ "Não é um arquivo"
✓ "Diretório não existe"
✓ "Não é um diretório"
✓ "palavras duplicadas no parágrafo"
✓ "caminho do texto a ser processado"
✓ "caminho da pasta onde salvar o arquivo de resultados"
✓ "tamanho mínimo de palavra"
✓ "ocorrências mínimas para considerar duplicada"
✓ "nome do arquivo de saída"
✓ "suprime saída no console"
```

All these appear in [design.md → Message Preservation](design.md#message-preservation-req-005)
