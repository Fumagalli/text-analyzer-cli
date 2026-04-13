# Project Infrastructure Specification

## Problem Statement

O projeto não tem repositório Git, contém arquivos órfãos (tarball desatualizado, package-lock.json vazio na raiz), não especifica versão mínima do Node.js, usa interpolação de string para paths em vez de `path.join()`, e não tem build step para distribuição. Isso impede publicação e uso profissional.

## Goals

- [ ] Repositório Git inicializado com `.gitignore` adequado
- [ ] Arquivos órfãos removidos
- [ ] `package.json` com `engines` e build script
- [ ] Paths construídos com `path.join()` (portável)

## Out of Scope

| Feature                    | Reason                                    |
| -------------------------- | ----------------------------------------- |
| CI/CD                      | Adicionado depois, na fase de publicação |
| Publicação no npm          | Feature separada (portfolio-ready)       |
| Mover `PrimeiraBiblioteca/` para raiz | Pode quebrar referências         |

---

## User Stories

### P1: Repositório Git e .gitignore ⭐ MVP

**User Story**: Como desenvolvedor, quero um repositório Git com `.gitignore` para versionar o projeto corretamente.

**Why P1**: Sem Git, não há controle de versão, rollback, ou publicação no GitHub.

**Acceptance Criteria**:

1. WHEN `git init` é executado THEN repositório é inicializado em `PrimeiraBiblioteca/`
2. WHEN `.gitignore` existe THEN `node_modules/`, `dist/`, `resultados/`, `*.tgz`, `*.log`, `.DS_Store` são ignorados
3. WHEN `git status` é executado THEN `resultados/resultado.txt` NÃO aparece como untracked

**Independent Test**: `git init` + `git add .` + verificar que arquivos gerados não são rastreados

---

### P2: Limpeza de arquivos órfãos

**User Story**: Como desenvolvedor, quero que o repositório não contenha arquivos desnecessários ou desatualizados.

**Why P2**: Arquivos órfãos poluem o repositório e podem causar confusão.

**Acceptance Criteria**:

1. WHEN `typescript-eslint-eslint-plugin-6.21.0.tgz` é removido THEN `npm install` funciona normalmente
2. WHEN `package-lock.json` da raiz é removido THEN não há impacto no projeto (o real está em `PrimeiraBiblioteca/`)

**Independent Test**: `npm install` e `npm test` passam após remoção

---

### P3: Build script e configuração de distribuição

**User Story**: Como desenvolvedor, quero `npm run build` para compilar TypeScript e preparar o CLI para distribuição.

**Why P2**: Sem build, o CLI depende de `ts-node` em runtime, não é instalável globalmente.

**Acceptance Criteria**:

1. WHEN `npm run build` THEN TypeScript compila para `dist/` sem erros
2. WHEN `node dist/cli.js` THEN CLI funciona igual à versão `ts-node`
3. WHEN `package.json` tem campo `bin` THEN `npm link` disponibiliza o CLI globalmente
4. WHEN `package.json` tem campo `engines` THEN versão mínima do Node é especificada

**Independent Test**: `npm run build && node dist/cli.js --texto arquivos/texto-kanban.txt --destino resultados`

---

### P4: Substituir interpolação por path.join()

**User Story**: Como desenvolvedor, quero que paths sejam construídos de forma portável entre sistemas operacionais.

**Why P2**: `${endereco}/resultado.txt` não funciona em Windows.

**Acceptance Criteria**:

1. WHEN `path.join()` é usado THEN path de saída é construído corretamente em qualquer SO
2. WHEN CLI roda em Linux/macOS/Windows THEN o arquivo de saída é criado no diretório correto

**Independent Test**: Verificar que `path.join('dir', 'resultado.txt')` produz o path correto

---

## Edge Cases

- WHEN `dist/` não existe THEN `npm run build` deve criá-lo automaticamente (tsconfig `outDir`)
- WHEN `.gitignore` é criado THEN deve ser o primeiro commit antes de qualquer outro arquivo

---

## Requirement Traceability

| Requirement ID | Story       | Phase   | Status  |
| -------------- | ----------- | ------- | ------- |
| INFRA-01       | P1: Git     | Design  | Pending |
| INFRA-02       | P1: Git     | Design  | Pending |
| INFRA-03       | P1: Git     | Design  | Pending |
| INFRA-04       | P2: Limpeza | Design  | Pending |
| INFRA-05       | P2: Limpeza | Design  | Pending |
| INFRA-06       | P3: Build   | Design  | Pending |
| INFRA-07       | P3: Build   | Design  | Pending |
| INFRA-08       | P3: Build   | Design  | Pending |
| INFRA-09       | P3: Build   | Design  | Pending |
| INFRA-10       | P4: path    | Design  | Pending |

---

## Success Criteria

- [ ] Repositório Git inicializado com `.gitignore`
- [ ] `npm run build` compila sem erros
- [ ] CLI compilado funciona igual à versão TypeScript
- [ ] Arquivos órfãos removidos
- [ ] `package.json` tem `engines`, `bin`, `build` script