# M4: Portfolio Ready — Design Document

**Milestone Goal**: Professional presentation for hiring/portfolio context + production-grade features

**Success Criteria**:
- `--output` flag works (customize output filename)
- `--quiet` flag works (suppress console output)
- Descriptive TypeScript interfaces defined (ContagemParagrafo, ErroComCodigo)
- Professional README with non-negotiable sections + portfolio boosters
- MIT LICENSE file present
- All tests passing (100% coverage maintained)
- All quality gates passing (lint, typecheck, build)
- Portfolio reviewers see: completeness, professionalism, attention to detail

---

## Architecture: Type System + CLI Design

### Type System Strategy

**Goal**: Make code self-documenting + catch bugs at compile time

#### Current State (Implicit Types)
```typescript
// No clear contracts
function contaPalavras(text: string): number { ... }
function extraiParagrafos(text: string): string[] { ... }
function processoArquivo(file: string, opts: any): any { ... }
```

**Problem**:
- CLI options not typed consistently
- Error returns not standardized
- Analyzer output structure unclear
- Portfolio reviewer can't see your type thinking

---

#### Target State (Explicit, Portfolio-Ready Types)

### Interface: `ContagemParagrafo`
```typescript
interface ContagemParagrafo {
  totalPalavras: number;
  totalParagrafos: number;
  palavrasDuplicadas: {
    palavra: string;
    repeticoes: number;
  }[];
}
```

**Why**: Clarifies what "counting paragraphs" means; shows you think about data contracts

---

### Interface: `ErroComCodigo`
```typescript
interface ErroComCodigo extends Error {
  codigo: string; // "ARQUIVO_NAO_ENCONTRADO" | "OPCAO_INVALIDA" | etc.
  mensagem: string;
  statusCode?: number;
}
```

**Why**: Standardizes error handling; shows you structure errors professionally

---

### CLI Options Architecture

#### Flag: `--output <filename>`
```bash
# Default behavior (current)
node dist/cli.js --arquivo input.txt
# Output: resultado.txt (hardcoded)

# With --output flag (new)
node dist/cli.js --arquivo input.txt --output meu-resultado.txt
# Output: meu-resultado.txt (custom)

node dist/cli.js --arquivo input.txt --output análise-mai-2026.txt
# Output: análise-mai-2026.txt (custom name)
```

**Implementation Details**:
- Option: `--output <filename>` with default fallback
- Storage: Passed through CLI → ValidaEntrada → ProcessaArquivo → CriaESalvaArquivo
- Validation: Filename must be valid (no path separators, no `.gitignore` patterns)
- Error: If `--output` has invalid path, reject with clear error

---

#### Flag: `--quiet`
```bash
# Current behavior (verbose)
node dist/cli.js --arquivo input.txt
# Console: "Analisando..." + analysis results
# File: resultado.txt with results

# With --quiet flag (new)
node dist/cli.js --arquivo input.txt --quiet
# Console: (silent — no output)
# File: resultado.txt with results

# Combination
node dist/cli.js --arquivo input.txt --output custom.txt --quiet
# Console: (silent)
# File: custom.txt with results
```

**Implementation Details**:
- Option: `--quiet` boolean flag (no value required)
- Effect: Suppress `console.log()` calls during processing
- Still report: Errors go to `stderr` (even with `--quiet`)
- Verify: Output file was written successfully (don't silently fail)

---

### CLI Options Data Flow

```
Input: node dist/cli.js --arquivo input.txt --output out.txt --quiet

↓ Parse args using minimist/yargs/manual parsing

Parsed Options Object:
{
  arquivo: "input.txt",
  output: "out.txt",
  quiet: true,
  minPalavras: 5 // default from spec
}

↓ Pass to ValidaEntrada (async)

Validated:
- arquivo exists (fs.promises.access)
- minPalavras is positive integer (or default)
- output filename is valid (reject if contains path separators)

↓ Pass to ProcessaArquivo

Processing:
- Read arquivo
- Count words/paragraphs
- Generate output text

↓ Pass to CriaESalvaArquivo with { arquivo, output, quiet, ... }

Write Result:
- Write to file: output (or default "resultado.txt")
- Log to console: if NOT quiet
- Return success/error

Output on Disk:
- File created at output filename
```

---

## README Architecture

### Non-Negotiable Sections (Must Have)

#### 1. **Title + One-liner**
```markdown
# text-analyzer-cli

A fast, TypeScript-powered CLI tool for analyzing Portuguese text — word counts, paragraph extraction, and duplicate word detection.
```
**Why**: Tells portfolio reviewer instantly what you built

---

#### 2. **Description (Problem + Solution)**
```markdown
## About

When working with Portuguese text documents, you often need to:
- Count words quickly and accurately
- Find duplicate words
- Split text into meaningful paragraphs

**text-analyzer-cli** does all three in one fast, reliable tool. Handles edge cases like
Windows line endings (CRLF), Portuguese punctuation, and NaN validation.
```
**Why**: Shows you understand the problem domain

---

#### 3. **Installation**
```markdown
## Installation

Requires Node.js 18+

```bash
git clone https://github.com/yourusername/text-analyzer-cli.git
cd text-analyzer-cli/PrimeiraBiblioteca
npm install
npm run build
```
```
**Why**: Reviewer can get it running in 2 minutes

---

#### 4. **Quick Start (Copy-Paste Works)**
```markdown
## Quick Start

```bash
# Analyze a file
node dist/cli.js --arquivo documento.txt

# Custom output filename
node dist/cli.js --arquivo documento.txt --output analise.txt

# Quiet mode (silent until done)
node dist/cli.js --arquivo documento.txt --quiet
```
```
**Why**: Proves CLI works; shows all major flags

---

#### 5. **Features (Bullet List)**
```markdown
## Features

- ✅ **Fast word counting** — Accurate with Portuguese punctuation
- ✅ **Paragraph extraction** — Handles Windows (CRLF) + Unix (LF) line endings
- ✅ **Duplicate detection** — Finds repeated words instantly
- ✅ **CI/CD ready** — POSIX-compliant, zero-dependency core
- ✅ **Fully tested** — 100% code coverage with regression + edge case tests
- ✅ **TypeScript** — Full type safety, no implicit `any`
```
**Why**: Bullet points are scannable; shows professionalism

---

#### 6. **CLI Options (Table Format)**
```markdown
## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--arquivo <path>` | string | required | Input file to analyze |
| `--minPalavras <n>` | number | 5 | Minimum word count per paragraph |
| `--output <file>` | string | resultado.txt | Output filename |
| `--quiet` | boolean | false | Suppress console output |

**Examples**:
```bash
node dist/cli.js --arquivo input.txt --minPalavras 3
node dist/cli.js --arquivo input.txt --output custom-name.txt --quiet
```
```
**Why**: Clear reference; shows all options exist

---

#### 7. **Usage Examples (2-3 Realistic)**
```markdown
## Examples

### Example 1: Basic Analysis
```bash
$ node dist/cli.js --arquivo documento.txt
Contagem de palavras: 1250
Contagem de parágrafos: 8
Palavras duplicadas encontradas: 5
```

### Example 2: Filter Short Paragraphs
```bash
$ node dist/cli.js --arquivo documento.txt --minPalavras 10
# Only shows paragraphs with 10+ words
Contagem de palavras: 1250
Contagem de parágrafos: 4
# (paragraphs < 10 words excluded)
```

### Example 3: Custom Output with Quiet Mode
```bash
$ node dist/cli.js --arquivo documento.txt --output analise-mai-2026.txt --quiet
$ cat analise-mai-2026.txt
Contagem de palavras: 1250
...
```
```
**Why**: Shows real-world usage; proves features work

---

#### 8. **Testing**
```markdown
## Testing

```bash
npm test              # Run all tests (30+ tests)
npm test -- --coverage  # View coverage report (100%)
npm run typecheck     # TypeScript check
npm run lint          # ESLint check
```

**Coverage**:
- 100% lines + branches + functions on critical paths
- Regression tests for all M1 bug fixes
- Edge case coverage (empty files, CRLF, unicode)
- E2E integration tests (file I/O)
```
**Why**: Shows test discipline; portfolio points

---

#### 9. **Author + License**
```markdown
## License

MIT License — see [LICENSE](./LICENSE) file

---

**Built by** [Your Name] — [Your GitHub](https://github.com/yourusername/)
```
**Why**: Makes it portfolio-attributed

---

### Portfolio Boosters (Highly Recommended)

#### 10. **Motivation (Why You Built It)**
```markdown
## Motivation

I built this tool to sharpen my TypeScript + CLI skills while solving a real problem:
analyzing Portuguese text with edge-case handling. 

Key learnings:
- Handling CRLF vs LF line endings (cross-platform compatibility)
- Portuguese punctuation quirks (em-dashes, guillemets)
- Async file I/O with proper error handling
- Comprehensive testing strategy (regression + edge case + E2E)

This project demonstrates my commitment to **quality over speed** — every feature
has supporting tests, edge cases are considered, and errors are handled gracefully.
```
**Why**: Character + growth story; shows intentionality

---

#### 11. **Tech Stack**
```markdown
## Tech Stack

- **Language**: TypeScript 5.x (ESM modules)
- **Runtime**: Node.js 18+ (async/await, fs.promises)
- **Testing**: vitest 4.1.3 (fast, ESM-native)
- **Linting**: ESLint + Prettier (consistent style)
- **Build**: tsc (TypeScript compiler to dist/)
```
**Why**: Shows you're production-ready DevOps-aware

---

#### 12. **Edge Cases Handled**
```markdown
## Edge Cases (Production-Ready)

This tool handles real-world messiness:

| Edge Case | How It's Handled |
|-----------|-----------------|
| **Windows line endings (CRLF)** | Splits on both `\n` and `\r\n` |
| **Portuguese punctuation** | Em-dashes (—), guillemets («»), contracted words (d'água) |
| **Empty files** | Returns 0 words gracefully, no crash |
| **Whitespace-only content** | Correctly identifies as empty (0 words) |
| **Large files** | Streams processing, no memory overhead |
| **Invalid CLI options** | Clear error messages (NaN, negative numbers) |
| **Missing files** | Async error handling with descriptive errors |

Example:
```bash
# Windows file with CRLF + Portuguese punctuation
$ echo -e "Olá—mundo\r\nPara 2" | node dist/cli.js --arquivo temp.txt
# Correctly identifies 2 paragraphs, 4 words
```
```
**Why**: Shows you think about production scenarios

---

#### 13. **Badges**
```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
```
**Why**: Looks professional; quick credibility signals

---

### Nice-to-Have Sections (Add Later if Time)

#### 14. **Project Structure** (Visual + Brief)
```markdown
## Project Structure

```
src/
├── index.ts          # Core logic: contaPalavras, extraiParagrafos, verificaPalavrasDuplicadas
├── cli.ts            # CLI handler: argument parsing, file I/O coordination
├── helpers.ts        # Utilities: shared functions
├── erros/
│   └── funcoesErro.ts # Error handling: trataErros, ErroComCodigo interface
└── __tests__/        # Test suites (30+ tests, 100% coverage)
    ├── cli.test.ts
    ├── index.test.ts
    └── funcoesErro.test.ts
```
```
**Why**: Shows architecture clarity (optional but nice)

---

#### 15. **Contributing Guide** (If Open to Community)
```markdown
## Contributing

Contributions welcome! To add a feature:
1. Create a feature branch (`git checkout -b feature/new-feature`)
2. Add tests covering your feature
3. Ensure `npm test`, `npm run lint`, `npm run typecheck` pass
4. Submit a PR with description
```
**Why**: Shows you're collaborative (optional)

---

#### 16. **Changelog**
```markdown
## Changelog

### v1.0.0 (2026-04-10)
- ✅ Initial release
- ✅ Core text analysis (word count, paragraph extraction, duplicate detection)
- ✅ CLI with --output and --quiet flags
- ✅ 100% test coverage
- ✅ Portuguese punctuation support
- ✅ Windows line ending support
```
**Why**: Professional versioning (optional)

---

## LICENSE Strategy

### File: `LICENSE` (root of PrimeiraBiblioteca/)

**Content**: Full MIT License text
```
MIT License

Copyright (c) 2026 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
...
```

**Why MIT?**
- ✅ Permissive (portfolio projects usually are)
- ✅ Industry standard
- ✅ Shows you understand licensing
- ✅ GitHub recognizes it in repo UI

---

## Type System Integration

### Where Types Go in Code

#### File: `src/index.ts` (Add at top after imports)
```typescript
export interface ContagemParagrafo {
  totalPalavras: number;
  totalParagrafos: number;
  palavrasDuplicadas: Array<{
    palavra: string;
    repeticoes: number;
  }>;
}

export interface ParafoDadosCompletos {
  indice: number;
  conteudo: string;
  palavraCount: number;
  textLimpo: string;
}
```

#### File: `src/erros/funcoesErro.ts` (Add at top)
```typescript
export interface ErroComCodigo extends Error {
  codigo: 'ARQUIVO_NAO_ENCONTRADO' | 'OPCAO_INVALIDA' | 'VALOR_INVALIDO';
  mensagem: string;
  statusCode?: number;
}

export function criaErroComCodigo(
  codigo: ErroComCodigo['codigo'],
  mensagem: string
): ErroComCodigo {
  const erro = new Error(mensagem) as ErroComCodigo;
  erro.codigo = codigo;
  erro.mensagem = mensagem;
  return erro;
}
```

#### File: `src/cli.ts` (Use types in function signatures)
```typescript
interface CliOptions {
  arquivo: string;
  minPalavras?: number;
  output?: string;
  quiet?: boolean;
}

async function validaEntrada(opcoes: CliOptions): Promise<void> { ... }
async function processaArquivo(arquivo: string, opcoes: CliOptions): Promise<ContagemParagrafo> { ... }
```

**Impact on Portfolio Review**:
- Reviewer sees: "Types are explicit, not implicit"
- Reviewer sees: "Error handling is structured, not random"
- Reviewer sees: "You think about contracts + maintainability"

---

## Flag Implementation Strategy

### How `--output` Works (Data Flow)

```
1. Parse args:
   argv = parseArgs() → { arquivo: "input.txt", output: "custom.txt" }

2. Validate:
   validaEntrada({ arquivo, output }) → check output filename valid

3. Process:
   result = processaArquivo(arquivo, options)

4. Save with custom filename:
   criaESalvaArquivo(arquivo, result, output || "resultado.txt")

5. Output:
   File written to "custom.txt" (not "resultado.txt")
```

---

### How `--quiet` Works (Control Flow)

```
1. Parse args:
   argv = parseArgs() → { arquivo: "input.txt", quiet: true }

2. Process:
   result = processaArquivo(arquivo, options)
   // result object is generated, not console.log'd

3. Save with suppressed output:
   criaESalvaArquivo(arquivo, result, "resultado.txt", { quiet: true })
   
   // Inside criaESalvaArquivo:
   if (!quiet) console.log("Analisando...");
   if (!quiet) console.log(resultText);
   
   // Still write to file, even if quiet
   fs.promises.writeFile(outputPath, resultText)

4. Exit:
   if (!quiet) console.log("Arquivo salvo em " + outputPath);
   // If quiet, only file is created
```

---

## README Review Checklist

**Before M4 completion**, review README against this checklist:

- [ ] **Non-negotiables present**:
  - [ ] Title + one-liner visible in first 3 lines
  - [ ] Description (problem + solution) in 3 sentences
  - [ ] Installation: copy-paste works (`npm install`, Node version)
  - [ ] Quick Start: copy-paste CLI command that works
  - [ ] Features: bullet list of capabilities
  - [ ] Options: table with all flags
  - [ ] Examples: 2-3 realistic usage scenarios
  - [ ] Testing: how to run `npm test`
  - [ ] Author + License: clickable links

- [ ] **Portfolio boosters present**:
  - [ ] Motivation: why you built it, what you learned
  - [ ] Tech Stack: TypeScript, Node.js, vitest, ESLint
  - [ ] Edge Cases: CRLF, PT-BR punctuation, NaN handling explained
  - [ ] Badges: License, Node.js version, coverage

- [ ] **Formatting**:
  - [ ] Markdown is valid (renders on GitHub without errors)
  - [ ] Code blocks have language tag (```bash, ```typescript)
  - [ ] Tables are readable + properly aligned
  - [ ] Links work (no 404s)
  - [ ] No typos or grammar errors

---

## Success Indicators

✅ **M4 Complete when**:
1. `--output` flag works (custom filename saves)
2. `--quiet` flag works (console suppressed, file still written)
3. `ContagemParagrafo` interface defined + used
4. `ErroComCodigo` interface defined + error handling uses it
5. README has all 9 non-negotiables + 3+ portfolio boosters
6. LICENSE file present with proper MIT text
7. All tests still passing (100% coverage)
8. `npm run lint` + `npm run typecheck` + `npm run build` pass
9. 4 atomic commits in git (--output, --quiet, types, README+LICENSE)

✅ **Portfolio ready**: Reviewers see a **complete, professional project** with thoughtful design

---

**Status**: Ready for task breakdown  
**Next Step**: M4 Tasks.md (atomic implementation)
