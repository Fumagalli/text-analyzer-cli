# text-analyzer-cli — Roadmap

## Milestone 1: Bug Fixes (P1 — Crítico)

**Feature**: `bug-fixes`
**Objetivo**: Corrigir todos os bugs lógicos e de segurança que produzem resultados incorretos

- Corrigir contagem de palavras (length check antes de limpeza)
- Corrigir validação de NaN em opções numéricas do CLI
- Corrigir split de linha (CRLF) e split de palavras (espaços/tabs)
- Expandir regex de pontuação para PT-BR

**Status**: In Progress — Design approved, tasks created

---

## Milestone 2: Project Infrastructure (P1 — Crítico)

**Feature**: `project-infra`
**Objetivo**: Infraestrutura profissional para desenvolvimento e publicação

- Inicializar repositório Git com `.gitignore`
- Remover arquivos órfãos (`.tgz`, `package-lock.json` da raiz)
- Adicionar `engines` no `package.json`
- Adicionar build script (`tsc`) e campo `bin`
- Usar `path.join()` no lugar de interpolação

**Status**: Pending

---

## Milestone 3: Test Coverage (P2 — Importante)

**Feature**: `test-coverage`
**Objetivo**: Cobrir edge cases críticos e validar bugs corrigidos

- Testes para bugs da Fase 1 (pontuação, NaN, CRLF, texto vazio)
- Teste de integração end-to-end
- Teste de conteúdo escrito pelo `writeFile`

**Status**: Pending

---

## Milestone 4: Portfolio Ready (P2 — Importante)

**Feature**: `portfolio-ready`
**Objetivo**: Projeto profissional e apresentável

- Opções `--output` e `--quiet` no CLI
- `validaEntrada` async
- Tipagem melhorada (`ContagemParagrafo`, `NodeJS.ErrnoException`)
- README profissional com badges, exemplos e documentação completa
- Arquivo LICENSE (MIT)

**Status**: Pending