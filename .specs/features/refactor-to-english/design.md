# Design: Refactor Codebase from Portuguese to English

**Feature:** refactor-to-english  
**Date:** 2026-04-13  
**Status:** Ready for implementation  
**Architecture Type:** Pure refactor (zero functional changes)

---

## Architecture Overview

**Zero functional changes.** Pure mechanical refactor: rename functions, variables, types, and update all references. Behavioral output identical.

```
Source Code (3 files)
├── src/index.ts        (1 interface + 4 functions + ~8 vars)
├── src/helpers.ts      (2 functions + ~5 vars)
└── src/cli.ts          (4 functions + ~12 vars)
        │
        ↓
   [T1-T3] Find-Replace + Manual Verification
   └─ Rename: functions, variables, types, JSDoc
   └─ Update: all internal references
   └─ Preserve: all messages (PT-BR)
        │
        ↓
   Tests (3 files, 125 tests)
├── src/__tests__/index.test.ts
├── src/__tests__/cli.test.ts
└── src/__tests__/funcoesErro.test.ts
        │
     [T4-T6] Update Imports & Function Calls
   └─ Update: import statements
   └─ Update: function call sites
   └─ Preserve: assertion text for messages
        │
        ↓
   [T7] Verification & Commit
├── npm run typecheck  (TypeScript valid)
├── npm run lint       (ESLint clean)
├── npm test           (All 125 passing)
└── npm run build      (dist/cli.js generated)
```

---

## Function Mapping (REQ-001)

| Old Name | New Name | File | Type | Exports |
|----------|----------|------|------|---------|
| `ContagemParagrafo` | `WordCountMap` | index.ts | Interface | Yes |
| `contaPalavras` | `countWords` | index.ts | Public | Yes |
| `extraiParagrafos` | `extractParagraphs` | index.ts | Public | Yes |
| `verificaPalavrasDuplicadas` | `analyzeWordFrequency` | index.ts | Private | No |
| `limpaPalavras` | `cleanWord` | index.ts | Private | No |
| `filtraOcorrencias` | `filterOccurrences` | helpers.ts | Private | No |
| `montaSaidaArquivo` | `buildOutputFormat` | helpers.ts | Private | **Yes** |
| `validaInteiroPositivo` | `validatePositiveInteger` | cli.ts | Public | Yes |
| `validaEntrada` | `validateInput` | cli.ts | Public | Yes |
| `processaArquivo` | `processFile` | cli.ts | Public | Yes |
| `criaESalvaArquivo` | `createAndSaveFile` | cli.ts | Public | Yes |

---

## Variable Mapping (REQ-002)

### src/index.ts

| Old | New | Usage | Notes |
|-----|-----|-------|-------|
| `texto` | `text` | Function parameters, loop vars | Parameter to contaPalavras |
| `paragrafo` | `paragraph` | Loop iterations, array elements | Internal iteration variable |
| `paragrafos` | `paragraphs` | Array of extracted text | Internal variable |
| `palavra` | `word` | Loop iterations, string processing | Parameter to limpaPalavras |
| `listaPalavras` | `wordList` | Split result from texto.split() | Local variable |
| `resultado` | `result` | Return object accumulator | Local variable |
| `contagem` | `count` | flatMap intermediate result | Local variable |
| `regex` | `regex` | Pattern for punctuation removal | Local pattern (KEEP — already good name) |

### src/helpers.ts

| Old | New | Usage | Notes |
|-----|-----|-------|-------|
| `paragrafo` | `paragraph` | Function parameter | filterOccurrences param |
| `minCount` | `minCount` | Function parameter | (KEEP — already English) |
| `chave` | `key` | Object.keys iteration | Internal loop variable |
| `linhas` | `lines` | Array of output strings | Local variable |
| `index` | `index` | Array.map parameter | (KEEP — standard) |
| `duplicate` | `repeated` | Local variable in output | Text within message string (PT-BR message stays) |

### src/cli.ts

| Old | New | Usage | Notes |
|-----|-----|-------|-------|
| `valor` | `value` | validatePositiveInteger param | CLI option value |
| `nome` | `name` | validatePositiveInteger param | Option name for error |
| `texto` | `text` | CLI option | Text file path input |
| `destino` | `destination` | CLI option | Output directory |
| `minChars` | `minChars` | CLI option | (KEEP — already English) |
| `minCount` | `minCount` | CLI option | (KEEP — already English) |
| `output` | `output` | CLI option | (KEEP — already English) |
| `quiet` | `quiet` | CLI option | (KEEP — already English) |
| `caminhoTexto` | `textPath` | Local variable | Full path to input file |
| `caminhoDestino` | `destinationPath` | Local variable | Full path to output dir |
| `arquivoNovo` | `newFile` | Local variable | Full path to output file |
| `conteudo` | `content` | File read result | Text read from file |
| `textoPalavras` | `wordOutput` | Function result | Formatted output string |
| `statsTexto` | `textStats` | fs.stat result | File stats for input |
| `statsDestino` | `destinationStats` | fs.stat result | Directory stats for output |

---

## Import Dependencies (Real Structure)

**Critical for task sequencing — verified from actual codebase:**

### Index-to-Helpers Relationship
```typescript
// helpers.ts imports from index.ts:
// (None — helpers.ts is independent)
// helpers.ts only works with Record<string, number> types (generic)
```

### CLI-to-Core Relationships
```typescript
// cli.ts imports from index.ts:
import { contaPalavras, type ContagemParagrafo } from './index.js';

// cli.ts imports from helpers.ts:
import { montaSaidaArquivo } from './helpers.js';

// cli.ts imports error handler:
import trataErros from './erros/funcoesErro.js';
```

### Test File Import Dependencies
```typescript
// index.test.ts:
import { contaPalavras } from '../index.js';
import { montaSaidaArquivo } from '../helpers.js';
// Calls: contaPalavras (~40+ calls), montaSaidaArquivo (~20+ calls)

// cli.test.ts:
import { buildProgram, validaEntrada, processaArquivo } from '../cli.js';
// Calls: validaEntrada (~8 tests), processaArquivo (~5 tests), buildProgram (~3 tests)
// Function calls: ~40+ total across all tests

// funcoesErro.test.ts:
import trataErros from '../erros/funcoesErro.js';
// Calls: trataErros (~4 tests) — ISOLATED, no cross-file dependencies
// No need to update; function calls by code name only (not exported)
```

**Task Sequencing Implication:**
- ✅ T1 (index.ts) can run independently
- ✅ T2 (helpers.ts) can run independently (no index.ts exports used)
- ✅ T3 (cli.ts) requires T1 + T2 done first (imports their exports)
- ⚠️ T4 (index.test.ts) requires T1 done (updates imports)
- ⚠️ T5 (cli.test.ts) requires T1 + T2 + T3 done (updates imports)
- ✅ T6 (funcoesErro.test.ts) is isolated but runs after T3 for consistency

---

```
index.ts exports:
├─ WordCountMap (used by: helpers.ts, cli.ts, tests)
├─ countWords (used by: cli.ts, tests)
├─ extractParagraphs (used by: countWords, tests)

helpers.ts exports:
├─ buildOutputFormat (used by: cli.ts, tests)
└─ uses: filterOccurrences (internal)

cli.ts exports:
├─ validatePositiveInteger (used by: CLI handler)
├─ buildProgram (used by: main, tests)
├─ validateInput (used by: processFile, tests)
├─ processFile (used by: CLI handler, tests)
├─ createAndSaveFile (used by: processFile, tests)
└─ imports: countWords, buildOutputFormat, validateErrors
```

---

## Message Preservation (REQ-005)

**Critical: Do NOT change these strings:**

```typescript
// In buildOutputFormat (helpers.ts)
`palavras duplicadas no parágrafo ${index + 1}: ${duplicadas}`

// In validatePositiveInteger (cli.ts)
chalk.red(`erro: ${nome} deve ser um número inteiro positivo`)

// In validateInput (cli.ts)
`Arquivo precisa ter extensão .txt: ${textPath}`
`Arquivo não encontrado: ${textPath}`
`Não é um arquivo: ${textPath}`
`Diretório não existe: ${destinationPath}`
`Não é um diretório: ${destinationPath}`

// In CLI program options
.option('-t, --texto <string>', 'caminho do texto a ser processado')
.option('-d, --destino <string>', 'caminho da pasta onde salvar o arquivo de resultados')
.option('-m, --min-chars <number>', 'tamanho mínimo de palavra', '3')
.option('-c, --min-count <number>', 'ocorrências mínimas para considerar duplicada', '2')
.option('-o, --output <string>', 'nome do arquivo de saída', 'resultado.txt')
.option('-q, --quiet', 'suprime saída no console')

// In createAndSaveFile (cli.ts)
if (!quiet) {
  console.log('arquivo criado');
}
```

---

## Testing Strategy

**Timing:** Batch test after all code changes (T1-T6) at T7.

**Why:**
- Simpler workflow (single test run catches all import issues)
- Fast-fail: gates run once after all changes
- Avoids test churn during refactoring

**Gate Order (T7):**
1. `npm run typecheck` — TypeScript validation (catches import errors)
2. `npm run lint` — ESLint (code quality)
3. `npm test` — Full test suite (functional verification)
4. `npm run build` — Build dist/ (deployment readiness)

**Expected Outcome:** All gates pass, 125/125 tests identical to pre-refactor

---

## Implementation Notes

1. **Find-Replace Strategy:**
   - Use VS Code multi-replace for mechanical changes
   - One file at a time: index.ts → helpers.ts → cli.ts
   - Verify TypeScript compiles after each file

2. **Syntax Safety:**
   - All changes preserve type signatures
   - No logic changes — only names + variable refs
   - TypeScript will catch import mismatches automatically

3. **Rollback Plan:**
   - If gates fail: review diff with `git diff src/`
   - Revert single file with `git checkout src/[file].ts`
   - No loss of work (all changes trackable)

4. **Test Updates:**
   - import statements: update function names
   - function calls: use new names
   - describe/it blocks: keep readable (no changes)
   - assertions: keep as-is (checking PT-BR messages)

---

## Post-Implementation Verification

**Code Quality:**
- ✅ All source files use English names
- ✅ All JSDoc comments are English
- ✅ All messages are Portuguese
- ✅ No mixed-language identifiers

**Functional Equivalence:**
- ✅ CLI behavior identical to pre-refactor
- ✅ Output format unchanged
- ✅ Test count matches (125)
- ✅ All tests pass

**Portfolio Readiness:**
- ✅ Code readable for non-Portuguese speakers
- ✅ Professional English naming conventions
- ✅ Suitable for GitHub + npm
- ✅ README bilingual for context
