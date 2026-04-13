# M4: Portfolio Ready — Tasks

**Milestone**: M4 (Portfolio Ready)  
**Est. Duration**: 1-2 hours  
**Dependencies**: M3 (100% coverage complete), M2 (build script ready)  
**Gate Check**: `npm test ✓ npm run lint ✓ npm run typecheck ✓ npm run build ✓`

---

## Task Dependency Graph

```
T4.1: Add --output flag
  ├─ Parse --output argument
  ├─ Validate output filename
  └─ Pass to criaESalvaArquivo
        ↓ (prerequisite for T4.2)

T4.2: Add --quiet flag
  ├─ Parse --quiet argument
  ├─ Suppress console.log calls
  └─ Still write file
        ↓ (prerequisite for integration testing)

T4.3: Add descriptive types
  ├─ ContagemParagrafo interface
  ├─ ErroComCodigo interface
  └─ Update function signatures
        ↓ (independent, can run in parallel with T4.1 + T4.2)

T4.4: Professional README
  ├─ All 9 non-negotiable sections
  ├─ 3+ portfolio boosters
  └─ Markdown formatting + links pass
        ↓ (can start after T4.1, doesn't block anything)

T4.5: Add LICENSE file
  ├─ Copy MIT license text
  └─ Verify linked from README
        ↓ (independent, final polish)

T4.6: Final gate check + cleanup
  └─ All tests pass, lint pass, build pass
```

---

## T4.1: Add `--output` Flag

**File Modified**: `src/cli.ts`

**Objective**: Enable custom output filename via `--output <filename>` option

### T4.1a: Parse `--output` Argument

**Acceptance Criteria**:
- ✓ CLI accepts `--output custom.txt` argument
- ✓ Parsed value available in options object
- ✓ Default fallback: if `--output` not provided, use `"resultado.txt"`
- ✓ Validation: reject if output contains path separators (e.g., `"../../../evil.txt"`)

**Implementation Pattern**:
```typescript
// In cli.ts, update options parsing:
interface CliOptions {
  arquivo: string;
  minPalavras?: number;
  output?: string;  // NEW
  quiet?: boolean;
}

// Parse from argv:
const output = argv['output'] || 'resultado.txt';
// Default fallback is "resultado.txt"
```

**Commit Message**: `feat(cli): add --output flag for custom output filename`

---

### T4.1b: Validate Output Filename

**Acceptance Criteria**:
- ✓ Reject if output contains `/` or `\` (path separators)
- ✓ Reject if output is empty string after trim
- ✓ Reject if output contains suspicious patterns (e.g., `../`, `..\\`)
- ✓ Accept simple filenames: `resultado.txt`, `análise-mai-2026.txt`, `output_2.txt`
- ✓ Error message is clear: `"Nome de arquivo inválido: <filename>"`

**Example Test Case**:
```typescript
it("should reject output filename with path separators", async () => {
  await expect(
    criaESalvaArquivo({
      arquivo: "test.txt",
      output: "../evil.txt", // ✗ REJECT
    })
  ).rejects.toThrow("Nome de arquivo inválido");

  await expect(
    criaESalvaArquivo({
      arquivo: "test.txt",
      output: "resultado.txt", // ✓ ACCEPT
    })
  ).resolves.not.toThrow();
});
```

**Implementation**:
```typescript
function validaOutputFilename(filename: string): boolean {
  // Reject path separators
  if (filename.includes('/') || filename.includes('\\')) return false;
  if (filename.includes('..')) return false;
  if (filename.trim().length === 0) return false;
  return true;
}

// In validaEntrada:
if (opcoes.output && !validaOutputFilename(opcoes.output)) {
  throw new Error("Nome de arquivo inválido: " + opcoes.output);
}
```

---

### T4.1c: Pass Output Filename Through Pipeline

**Acceptance Criteria**:
- ✓ `--output` value passed to `processaArquivo` function
- ✓ `processaArquivo` receives output in options object
- ✓ Output filename passed to `criaESalvaArquivo`
- ✓ File written to custom location (verified via existsSync)

**Data Flow**:
```typescript
// Parse
const opcoes = {
  arquivo: "input.txt",
  output: "custom-output.txt", // from --output flag
};

// Validate
await validaEntrada(opcoes);

// Process
const resultado = await processaArquivo(opcoes.arquivo, opcoes);

// Save with custom output
await criaESalvaArquivo(opcoes.arquivo, resultado, opcoes.output);
```

---

### T4.1d: Test Integration

**Acceptance Criteria**:
- ✓ `npm test` passes (new --output tests)
- ✓ Manual test: `node dist/cli.js --arquivo input.txt --output custom-name.txt` creates `custom-name.txt`
- ✓ Verify: Default behavior still works (no `--output` → `resultado.txt`)
- ✓ Error cases: Invalid output filename rejects clearly

**Test Example**:
```typescript
it("should save to custom output file", async () => {
  const inputFile = "./test-input.txt";
  const outputFile = "./custom-output-test.txt";
  
  writeFileSync(inputFile, "Test content");
  
  await criaESalvaArquivo({
    arquivo: inputFile,
    output: outputFile,
  });
  
  expect(existsSync(outputFile)).toBe(true);
  const content = readFileSync(outputFile, "utf-8");
  expect(content).toContain("Contagem");
  
  // Cleanup
  unlinkSync(inputFile);
  unlinkSync(outputFile);
});
```

---

## T4.2: Add `--quiet` Flag

**File Modified**: `src/cli.ts`

**Objective**: Suppress console output via `--quiet` flag (still write file)

### T4.2a: Parse `--quiet` Argument

**Acceptance Criteria**:
- ✓ CLI accepts `--quiet` boolean flag (no value required)
- ✓ Defaults to `false` if not provided
- ✓ Available in options object as `quiet: boolean`
- ✓ Multiple flags work: `--arquivo file.txt --output out.txt --quiet`

**Implementation Pattern**:
```typescript
interface CliOptions {
  arquivo: string;
  minPalavras?: number;
  output?: string;
  quiet?: boolean;   // NEW
}

// Parse from argv:
const quiet = argv['quiet'] === true || argv['q'] === true;
// Boolean flag, no value
```

---

### T4.2b: Suppress Console Output During Processing

**Acceptance Criteria**:
- ✓ When `--quiet`, no console output during processing
- ✓ No "Analisando..." message
- ✓ No result text printed to console
- ✓ No "Arquivo salvo em..." confirmation message
- ✓ Errors still printed to stderr (even with --quiet)
- ✓ Exit code still indicates success/failure

**Example**: **Before** (current)
```bash
$ node dist/cli.js --arquivo doc.txt
Analisando arquivo: doc.txt
Contagem de palavras: 150
Contagem de parágrafos: 8
Arquivo salvo em resultado.txt
```

**After** (with --quiet):
```bash
$ node dist/cli.js --arquivo doc.txt --quiet
# (complete silence, but file was written)
$
```

**Implementation**:
```typescript
async function criaESalvaArquivo(
  arquivo: string,
  resultado: string,
  nomeArquivoSaida: string,
  opcoes?: { quiet?: boolean }
): Promise<void> {
  if (!opcoes?.quiet) {
    console.log(`Analisando arquivo: ${arquivo}`);
  }
  
  // ... processing ...
  
  if (!opcoes?.quiet) {
    console.log(resultadoFormatado);
  }
  
  // Write file (always, even if quiet)
  await fs.promises.writeFile(nomeArquivoSaida, resultadoFormatado);
  
  if (!opcoes?.quiet) {
    console.log(`Arquivo salvo em ${nomeArquivoSaida}`);
  }
}
```

---

### T4.2c: Verify File Still Written (Quiet Doesn't Skip Write)

**Acceptance Criteria**:
- ✓ `--quiet` suppresses console only, not file write
- ✓ Output file created successfully even with `--quiet`
- ✓ File contains correct content (same as non-quiet)
- ✓ File size/content identical whether quiet or not

**Test Example**:
```typescript
it("should write file even with --quiet flag", async () => {
  const inputFile = "./test-input.txt";
  const outputFile = "./test-quiet-output.txt";
  
  writeFileSync(inputFile, "Test content\nAnother line");
  
  // Mock console.log to verify it's not called
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  
  await criaESalvaArquivo(inputFile, ..., outputFile, { quiet: true });
  
  // File should exist
  expect(existsSync(outputFile)).toBe(true);
  
  // Content should be written
  const content = readFileSync(outputFile, "utf-8");
  expect(content).toContain("Contagem");
  
  // Console should not have been called (verify quiet worked)
  expect(consoleSpy).not.toHaveBeenCalled();
  
  consoleSpy.mockRestore();
  unlinkSync(inputFile);
  unlinkSync(outputFile);
});
```

---

### T4.2d: Test Quiet + Output Combined

**Acceptance Criteria**:
- ✓ `--quiet --output custom.txt` works (quiet + custom filename)
- ✓ File written to custom location
- ✓ Console silent
- ✓ No errors or warnings

**Test Example**:
```typescript
it("should support --quiet and --output together", async () => {
  const inputFile = "./test-input.txt";
  const customOutput = "./custom-quiet-output.txt";
  
  writeFileSync(inputFile, "Test content");
  
  await criaESalvaArquivo(inputFile, ..., customOutput, { quiet: true });
  
  expect(existsSync(customOutput)).toBe(true);
  const content = readFileSync(customOutput, "utf-8");
  expect(content).toBeTruthy();
});
```

**Commit Message**: `feat(cli): add --quiet flag to suppress console output`

---

## T4.3: Add Descriptive Type Definitions

**Files Modified**: `src/index.ts`, `src/erros/funcoesErro.ts`, `src/cli.ts`

**Objective**: Make code self-documenting with explicit interfaces + strong typing

### T4.3a: Define `ContagemParagrafo` Interface

**File**: `src/index.ts` (at top after imports)

**Acceptance Criteria**:
- ✓ Interface exported for external use
- ✓ Clear field names: `totalPalavras`, `totalParagrafos`
- ✓ Nested array for duplicates: `{ palavra: string, repeticoes: number }`
- ✓ Used in analyzer function return types

**Implementation**:
```typescript
export interface ContagemParagrafo {
  totalPalavras: number;
  totalParagrafos: number;
  palavrasDuplicadas: Array<{
    palavra: string;
    repeticoes: number;
  }>;
}

// Usage in function signature:
export function verificaPalavrasDuplicadas(
  texto: string,
  minRepetacoes?: number
): ContagemParagrafo {
  // ...implementation...
}
```

**Rationale**: Portfolio reviewers immediately understand what the analyzer returns

---

### T4.3b: Define `ErroComCodigo` Interface

**File**: `src/erros/funcoesErro.ts` (at top after imports)

**Acceptance Criteria**:
- ✓ Extends `Error` base class
- ✓ Has `codigo` field with specific error codes
- ✓ Has `mensagem` field (explicit message)
- ✓ Optional `statusCode` for HTTP contexts
- ✓ Used in error handling functions

**Implementation**:
```typescript
export interface ErroComCodigo extends Error {
  codigo: 
    | 'ARQUIVO_NAO_ENCONTRADO'
    | 'OPCAO_INVALIDA'
    | 'VALOR_INVALIDO'
    | 'ERRO_LEITURA_ARQUIVO';
  mensagem: string;
  statusCode?: number;
}

// Helper function
export function criaErroComCodigo(
  codigo: ErroComCodigo['codigo'],
  mensagem: string,
  statusCode?: number
): ErroComCodigo {
  const erro = new Error(mensagem) as ErroComCodigo;
  erro.codigo = codigo;
  erro.mensagem = mensagem;
  if (statusCode) erro.statusCode = statusCode;
  return erro;
}
```

---

### T4.3c: Update Function Signatures to Use Types

**Files**: `src/cli.ts`, `src/index.ts`

**Acceptance Criteria**:
- ✓ `processaArquivo` returns `ContagemParagrafo`
- ✓ `criaESalvaArquivo` accepts typed options (not `any`)
- ✓ Error handlers throw `ErroComCodigo`
- ✓ No implicit `any` types (TypeScript strict mode)

**Example of Typed Function**:
```typescript
// Before (implicit types)
async function processaArquivo(arquivo: string, opcoes: any): any {
  // ...
}

// After (explicit types)
async function processaArquivo(
  arquivo: string,
  opcoes: {
    minPalavras?: number;
    output?: string;
    quiet?: boolean;
  }
): Promise<ContagemParagrafo> {
  // ...
}
```

**Commit Message**: `refactor(types): add ContagemParagrafo and ErroComCodigo interfaces`

---

### T4.3d: Test Type Safety

**Acceptance Criteria**:
- ✓ `npm run typecheck` passes (no TypeScript errors)
- ✓ Function return types are accessible
- ✓ Errors return proper `ErroComCodigo` shape
- ✓ IDE autocomplete shows typed fields

**Verification**:
```bash
npm run typecheck
# ✓ No errors (types are correct)
```

---

## T4.4: Create Professional README

**File Created/Modified**: `PrimeiraBiblioteca/README.md`

**Objective**: Portfolio-grade documentation with all non-negotiables + boosters

### T4.4a: Structure Non-Negotiable Sections

**Acceptance Criteria** (must have ALL):
- ✓ H1 Title: `# text-analyzer-cli`
- ✓ One-liner describing project
- ✓ About/Description section (3 sentences: problem + solution)
- ✓ Installation section (Node version + copy-paste commands)
- ✓ Quick Start section (real working CLI command)
- ✓ Features section (bullet list of 4+ features)
- ✓ CLI Options section (table with all flags)
- ✓ Usage Examples section (2-3 realistic examples)
- ✓ Testing section (how to run `npm test`)
- ✓ License section (mention MIT)
- ✓ Author attribution (name + link)

**Template**:
```markdown
# text-analyzer-cli

Fast TypeScript CLI for analyzing Portuguese text — word counts, paragraphs, and duplicate detection.

## About

[Problem statement and solution in 3 sentences]

## Installation

Requires Node.js 18+
[copy-paste commands]

## Quick Start

[Working CLI command example]

## Features

- [Feature 1]
- [Feature 2]
...

## Options

[Table of flags]

## Examples

[2-3 realistic examples]

## Testing

[How to run tests]

## License

MIT License — [LICENSE](./LICENSE)

---

**Built by** [Your Name]
```

---

### T4.4b: Add Portfolio Boosters

**Acceptance Criteria** (choose 3+ from):
- ✓ Motivation section (why you built it, what you learned)
- ✓ Tech Stack section (languages, libraries, tools)
- ✓ Edge Cases Handled section (CRLF, PT-BR punctuation, NaN)
- ✓ Project Structure section (src/ directory visualization)
- ✓ Badges (License, Node version, coverage %)

**Example Motivation Section**:
```markdown
## Motivation

I built this tool to strengthen my TypeScript + CLI development skills while solving
a real problem: analyzing Portuguese text with proper edge-case handling.

**Key learnings**:
- Cross-platform line ending handling (CRLF vs LF)
- Portuguese text processing (punctuation, contractions)
- Async file I/O with proper error handling
- Test-driven development (100% coverage, regression + edge case + E2E)

This project demonstrates my commitment to **quality over speed** — every feature
has tests, edge cases are considered, and errors are handled gracefully.
```

---

### T4.4c: Markdown Quality Check

**Acceptance Criteria**:
- ✓ No syntax errors (renders properly on GitHub)
- ✓ All code blocks have language tags (```bash, ```typescript)
- ✓ All tables are aligned + readable
- ✓ All links work (no broken references)
- ✓ No typos or grammar errors
- ✓ Formatting is consistent (headers, lists, code blocks)

**Verification**:
```bash
# View on GitHub or locally:
# 1. Render markdown in VS Code (preview mode)
# 2. Check for red squiggly lines (markdown errors)
# 3. Click links to verify they work
# 4. Proofread for typos
```

---

### T4.4d: Add Badges (Optional but Recommended)

**Acceptance Criteria**:
- ✓ License badge visible (MIT)
- ✓ Node.js version badge (>=18)
- ✓ Coverage badge (100%)
- ✓ Badges render without broken image links

**Example Badge Section** (add after title):
```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
```

**Commit Message**: `docs(readme): add comprehensive portfolio-ready documentation`

---

## T4.5: Add LICENSE File

**File Created**: `PrimeiraBiblioteca/LICENSE`

**Objective**: Include MIT license for portfolio professionalism

### T4.5a: Create LICENSE File with MIT Text

**Acceptance Criteria**:
- ✓ File named `LICENSE` (not `LICENSE.md`, not `license.txt`)
- ✓ Contains full MIT license text
- ✓ Includes copyright line: `Copyright (c) 2026 [Your Name]`
- ✓ File exists at repo root
- ✓ Readable and properly formatted

**Content Template**:
```
MIT License

Copyright (c) 2026 [Your Full Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Where to Get**: [opensource.org MIT](https://opensource.org/licenses/MIT)

---

### T4.5b: Link LICENSE from README

**Acceptance Criteria**:
- ✓ README mentions `[LICENSE](./LICENSE)` with clickable link
- ✓ Link points to LICENSE file
- ✓ GitHub renders it as clickable link
- ✓ Reviewer can click from README → LICENSE

**In README.md License Section**:
```markdown
## License

MIT License — see [LICENSE](./LICENSE) file for details

---

**Built by** [Your Name] — [GitHub Profile](https://github.com/yourusername)
```

**Commit Message**: `docs(license): add MIT license file`

---

## T4.6: Final Gate Check + Cleanup

**File Modified**: None (verification task)

**Objective**: Verify all quality gates pass before considering M4 complete

### T4.6a: Test Coverage Verification

**Acceptance Criteria**:
- ✓ `npm test` → **All tests pass** (30+ tests)
- ✓ Coverage still 100% on:
  - `src/index.ts`: 100%
  - `src/cli.ts`: 100%
  - `src/helpers.ts`: 100%
  - `src/erros/funcoesErro.ts`: 100%
- ✓ No new tests broke due to T4.1-T4.5 changes

**Command**:
```bash
npm test

# Expected: ✓ 30+ tests pass, 100% coverage
```

**If coverage dropped**:
- Add tests for new --output + --quiet code paths
- Add tests for new type definitions
- Rerun `npm test` until 100% confirmed

---

### T4.6b: Quality Gate Checks

**Acceptance Criteria**:
- ✓ `npm run lint` → **No linting errors**
- ✓ `npm run typecheck` → **No TypeScript errors**
- ✓ `npm run build` → **Compiles successfully** (dist/ exists)

**Commands**:
```bash
npm run lint      # ✓ PASS
npm run typecheck # ✓ PASS
npm run build     # ✓ PASS
```

**If any fails**:
- `npm run lint --fix` to auto-fix style issues
- `npm run typecheck` output shows specific TypeScript errors → fix
- `npm run build` shows compiler errors → fix

---

### T4.6c: Feature Verification (Manual Test)

**Acceptance Criteria**:
- ✓ `--output` flag works: Custom filename created
- ✓ `--quiet` flag works: Console silent, file still created
- ✓ `--output + --quiet` together: Custom filename, silent
- ✓ Help message updated (if applicable)

**Manual Tests**:
```bash
# Build first
npm run build

# Test 1: --output flag
node dist/cli.js --arquivo ./arquivos/texto-aprendizado.txt --output teste-output.txt
# Verify: teste-output.txt created with results

# Test 2: --quiet flag
node dist/cli.js --arquivo ./arquivos/texto-aprendizado.txt --quiet
# Verify: No console output, but resultado.txt created

# Test 3: Both flags
node dist/cli.js --arquivo ./arquivos/texto-aprendizado.txt --output custom-quiet.txt --quiet
# Verify: custom-quiet.txt created, console silent

# Test 4: Default (no flags)
node dist/cli.js --arquivo ./arquivos/texto-aprendizado.txt
# Verify: resultado.txt created, console output visible
```

---

### T4.6d: Git Status Clean

**Acceptance Criteria**:
- ✓ `git status` shows "On branch main, nothing to commit" (or current branch)
- ✓ All changes committed with atomic messages
- ✓ 4 feature commits visible in `git log`:
  1. `feat(cli): add --output flag...`
  2. `feat(cli): add --quiet flag...`
  3. `refactor(types): add descriptive interfaces...`
  4. `docs(readme): add portfolio-ready documentation...`
  5. `docs(license): add MIT license...`

**Commands**:
```bash
git status        # ✓ Clean (nothing to commit)
git log --oneline # ✓ Shows 5 new commits
```

---

### T4.6e: README + LICENSE Verification

**Acceptance Criteria**:
- ✓ README.md has all 9 non-negotiables + 3+ boosters
- ✓ README is grammatically correct + no typos
- ✓ LICENSE file exists and contains MIT text
- ✓ Both files render properly on GitHub
- ✓ Links in README work (LICENSE link clickable)

**Verification**:
```bash
# Check files exist
ls -la README.md      # ✓ Exists
ls -la LICENSE        # ✓ Exists

# Verify content
head -20 README.md    # ✓ Title + structure visible
head -5 LICENSE       # ✓ MIT License visible
```

---

## Execution Checklist

### Before Starting
- [ ] M3 (100% test coverage) complete and verified
- [ ] All M3 tests passing: `npm test`
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` all pass
- [ ] No uncommitted changes: `git status`
- [ ] Current on main branch: `git branch`

### During Execution
- [ ] **T4.1**: Add --output flag
  - [ ] Parse argument
  - [ ] Validate filename
  - [ ] Pass through pipeline
  - [ ] Test integration
  - [ ] Commit: `feat(cli): add --output flag...`

- [ ] **T4.2**: Add --quiet flag
  - [ ] Parse argument
  - [ ] Suppress console output
  - [ ] Verify file still written
  - [ ] Test quiet + output combo
  - [ ] Commit: `feat(cli): add --quiet flag...`

- [ ] **T4.3**: Add types
  - [ ] Define `ContagemParagrafo` interface
  - [ ] Define `ErroComCodigo` interface
  - [ ] Update function signatures
  - [ ] Verify type safety
  - [ ] Commit: `refactor(types): add descriptive interfaces...`

- [ ] **T4.4**: Professional README
  - [ ] Add all 9 non-negotiables
  - [ ] Add 3+ portfolio boosters
  - [ ] Quality check: spelling, links, formatting
  - [ ] Add badges (optional)
  - [ ] Commit: `docs(readme): add portfolio-ready documentation...`

- [ ] **T4.5**: Add LICENSE
  - [ ] Create LICENSE file with MIT text
  - [ ] Link from README
  - [ ] Verify GitHub recognizes it
  - [ ] Commit: `docs(license): add MIT license...`

- [ ] **T4.6**: Final gate check
  - [ ] `npm test` passes, 100% coverage ✓
  - [ ] `npm run lint` passes ✓
  - [ ] `npm run typecheck` passes ✓
  - [ ] `npm run build` succeeds ✓
  - [ ] Manual feature tests pass ✓
  - [ ] `git status` clean ✓
  - [ ] `git log` shows 5 commits ✓

### After Completion
- [ ] All tests passing
- [ ] All quality gates passing
- [ ] README is portfolio-ready
- [ ] LICENSE present
- [ ] Git history is clean + atomic
- [ ] Celebrate! 🎉 **Milestone complete**

---

## Atomic Commits (Trace Every Change)

```bash
# After T4.1 (--output flag)
git add src/cli.ts src/__tests__/cli.test.ts
git commit -m "feat(cli): add --output flag for custom output filename"

# After T4.2 (--quiet flag)
git add src/cli.ts src/__tests__/cli.test.ts
git commit -m "feat(cli): add --quiet flag to suppress console output"

# After T4.3 (Types)
git add src/index.ts src/cli.ts src/erros/funcoesErro.ts
git commit -m "refactor(types): add ContagemParagrafo and ErroComCodigo interfaces"

# After T4.4 (README)
git add README.md
git commit -m "docs(readme): comprehensive portfolio-ready documentation"

# After T4.5 (LICENSE)
git add LICENSE
git commit -m "docs(license): add MIT license"
```

Each commit is **one logical feature** + tests passing.

---

## Success Indicators

✅ **Task complete when**:
1. `--output` flag implemented + working
2. `--quiet` flag implemented + working
3. `ContagemParagrafo` + `ErroComCodigo` interfaces defined + used
4. README has all 9 non-negotiables + 3+ boosters
5. LICENSE file present (MIT text)
6. `npm test` passes with 100% coverage
7. `npm run lint`, `npm run typecheck`, `npm run build` all pass
8. 5 atomic commits in git log
9. Portfolio reviewers see: **Complete, professional project**

✅ **Final Talking Points**:
- ✅ Full feature set: Text analysis + CLI options
- ✅ Production-quality: 100% test coverage, comprehensive edge case handling
- ✅ TypeScript best practices: Strong typing, no implicit `any`
- ✅ Professional documentation: Complete README + MIT license
- ✅ Cross-platform: Handles Windows/Unix line endings
- ✅ Portuguese-specific: PT-BR punctuation support
- ✅ Clean architecture: Atomic commits, semantic messages

---

**Milestone Status**: Ready to execute  
**Duration**: 1-2 hours  
**Final Gate Check**: All quality tests passing + portfolio-ready  
*Next**: Archive PROGRESS.md + celebrate project completion! 🎉
