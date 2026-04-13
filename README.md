# text-analyzer-cli

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](./coverage/index.html)

A high-performance CLI tool that analyzes text files to identify and count duplicate words in Portuguese, with comprehensive error handling and flexible output options.

## Features

- 🎯 **Precise duplicate detection** — Identifies words that appear multiple times in each paragraph
- 🌍 **Portuguese language support** — Handles PT-BR punctuation and special characters
- 📊 **Flexible filtering** — Customize minimum word length and occurrence thresholds
- 💾 **Portable output** — Save results to custom filenames with `--output` flag
- 🤫 **Silent mode** — Suppress console output with `--quiet` flag for CI/CD integration
- ⚡ **Battle-tested** — 100% test coverage with E2E file operation tests

## Installation

**Requirements**: Node.js ≥ 18

```bash
npm install text-analyzer-cli
```

Or run directly from source:

```bash
git clone https://github.com/your-username/text-analyzer-cli.git
cd text-analyzer-cli
npm install
```

## Quick Start

### Basic Usage

Analyze a text file and display duplicate words:

```bash
npx text-analyzer-cli --texto arquivo.txt --destino ./resultados
```

This creates `resultado.txt` in the `./resultados` directory with analysis results.

### With Options

```bash
# Custom output filename
npx text-analyzer-cli --texto file.txt --destino ./out --output analysis.txt

# Silent mode (file written, no console output)
npx text-analyzer-cli --texto file.txt --destino ./out --quiet

# Strict filtering (min 5 chars, min 3 occurrences)
npx text-analyzer-cli --texto file.txt --destino ./out --min-chars 5 --min-count 3

# Combined flags
npx text-analyzer-cli --texto file.txt --destino ./out \
  --output report.txt --quiet --min-chars 4 --min-count 2
```

## CLI Options

| Flag | Alias | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--texto` | `-t` | `<path>` | required | Input text file path (must be `.txt`) |
| `--destino` | `-d` | `<path>` | required | Output directory path |
| `--min-chars` | `-m` | `<number>` | `3` | Minimum word length to include |
| `--min-count` | `-c` | `<number>` | `2` | Minimum occurrences to flag as duplicate |
| `--output` | `-o` | `<filename>` | `resultado.txt` | Custom output filename |
| `--quiet` | `-q` | `boolean` | `false` | Suppress console output (file still created) |
| `--help` | `-h` | — | — | Display help information |
| `--version` | `-V` | — | — | Display version number |

## Usage Examples

### Example 1: Analyze Blog Post

```bash
npx text-analyzer-cli \
  --texto blog-post.txt \
  --destino ./analysis \
  --min-chars 4 \
  --min-count 2
```

**Output** (`resultado.txt`):
```
palavras duplicadas no parágrafo 1: utilizando, desenvolvimento, javascript
palavras duplicadas no parágrafo 3: framework, componentes, estado
```

### Example 2: Generate Report with Custom Filename

```bash
npx text-analyzer-cli \
  --texto ./documents/legal-review.txt \
  --destino ./reports \
  --output legal-duplicates-2026-04.txt \
  --min-chars 3 \
  --min-count 3
```

### Example 3: CI/CD Integration

```bash
# Suppress output for pipeline automation
npx text-analyzer-cli \
  --texto test-content.txt \
  --destino ./ci-output \
  --quiet \
  && echo "Analysis complete" && exit 0
```

## Testing

Run the full test suite with coverage:

```bash
# Run all tests
npm test

# Run tests with coverage threshold enforcement
npm test -- --coverage

# Run specific test file
npm test -- cli.test.ts

# Watch mode (development)
npm test -- --watch
```

**Current Coverage**: 100% statement coverage across all source files

Test categories:
- ✅ **Unit Tests** — Core logic and validation (21 tests)
- ✅ **Regression Tests** — Verified bug fixes (B1-B4: 4 tests)
- ✅ **Edge Cases** — Boundary conditions (E1-E4: 4 tests)
- ✅ **E2E Tests** — Real file I/O pipeline (8 tests)
- ✅ **Integration Tests** — Flag combinations (8 tests)

## Motivation

Built to strengthen TypeScript fundamentals and demonstrate:
- **Async I/O best practices** — Non-blocking file operations with `fs.promises`
- **Error handling maturity** — Custom error types and code-based error mapping
- **Test-driven quality** — E2E tests catch integration bugs that mocks miss
- **Pragmatic CLI design** — Flexible flags for diverse use cases (dev, CI/CD, automation)
- **Portuguese text processing** — Handling real-world language complexity (CRLF, unicode punctuation)

## Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **TypeScript** | Type-safe language | 5.x |
| **Node.js** | Runtime | ≥18 |
| **Commander.js** | CLI argument parsing | ^12.x |
| **Chalk** | Colored output | ^5.x |
| **Vitest** | Test runner | ^4.x |
| **ESLint** | Code quality | ^9.x |
| **Prettier** | Code formatting | ^3.x |

## Edge Cases Handled

✅ **CRLF line endings** — Correctly handles Windows (`\r\n`) and Unix (`\n`) line breaks  
✅ **PT-BR punctuation** — Supports em-dashes, en-dashes, ellipsis, curly quotes  
✅ **Whitespace robustness** — Handles irregular spacing, tabs, multiple spaces  
✅ **Empty paragraphs** — Filters out empty lines without breaking  
✅ **NaN validation** — Rejects invalid numeric options with clear error messages  
✅ **File system errors** — Maps ENOENT, EACCES, ENOTDIR to user-friendly messages

## Project Structure

```
text-analyzer-cli/
├── src/
│   ├── cli.ts              # CLI entry point, argument parsing, I/O orchestration
│   ├── index.ts            # Core analyzer: word counting, paragraph extraction
│   ├── helpers.ts          # Output formatting and filtering utilities
│   ├── erros/
│   │   └── funcoesErro.ts   # Error handling with code-based mapping
│   └── __tests__/
│       ├── cli.test.ts      # CLI and integration tests (20 tests)
│       ├── index.test.ts    # Core analyzer unit tests (21 tests)
│       └── funcoesErro.test.ts # Error handling tests (9 tests)
├── dist/                   # Compiled JavaScript (generated by `npm run build`)
├── coverage/               # Test coverage report (100% coverage)
├── tsconfig.json           # TypeScript configuration with source maps
├── package.json            # Dependencies and scripts
├── eslint.config.js        # ESLint rules for code quality
└── README.md               # This file
```

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build    # Compile TypeScript to dist/
npm run typecheck # Check types without emitting
```

### Code Quality

```bash
npm run lint     # Run ESLint with Prettier formatting
npm test         # Run full test suite
npm test -- --coverage  # Generate coverage report
```

### Running from Source

```bash
npm run dev -- --texto file.txt --destino ./out
# Or use npm scripts defined in package.json
```

## License

MIT License © 2026 — See [LICENSE](./LICENSE) file for details.

---

**Questions or issues?** Open a GitHub issue or reach out on LinkedIn.

Last updated: April 2026
