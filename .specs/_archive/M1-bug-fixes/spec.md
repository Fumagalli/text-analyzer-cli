# Bug Fixes Specification

## Problem Statement

O `text-analyzer-cli` produz resultados incorretos em vários cenários: palavras com pontuação são contadas errado, inputs numéricos inválidos corrompem a lógica silenciosamente, quebras de linha CRLF não são tratadas, e a regex de pontuação não cobre caracteres comuns em português. Esses bugs tornam o projeto não-confiável para portfolio.

## Goals

- [ ] Contagem de palavras correta para qualquer input textual (incluindo pontuação e caracteres PT-BR)
- [ ] Validação clara de inputs numéricos no CLI (NaN, negativos, zero)
- [ ] Suporte a arquivos com CRLF e CR
- [ ] Regex de pontuação cobre caracteres PT-BR

## Out of Scope

| Feature                    | Reason                                  |
| -------------------------- | --------------------------------------- |
| Mudança de arquitetura     | Bugs são na lógica, não na estrutura    |
| Novas funcionalidades      | Escopo é correção, não adição           |
| Refatoração de I/O sync/async | Será feito na feature portfolio-ready |

---

## User Stories

### P1: Correção de contagem de palavras ⭐ MVP

**User Story**: Como usuário do CLI, quero que palavras sejam contadas corretamente mesmo com pontuação, para que o resultado seja confiável.

**Why P1**: É o bug mais grave — produz resultados errados silenciosamente.

**Acceptance Criteria**:

1. WHEN palavra tem pontuação (ex: `"hello!"`) THEN sistema SHALL contar apenas `"hello"` (sem pontuação)
2. WHEN palavra é curta com pontuação (ex: `"a!!!"`) THEN sistema SHALL ignorar a palavra (length real < minChars)
3. WHEN token é só pontuação (ex: `"..."`) THEN sistema SHALL ignorar completamente (não gerar chave vazia)
4. WHEN `minChars=3` THEN sistema SHALL filtrar pelo comprimento da palavra limpa, não da original

**Independent Test**: `contaPalavras("Oi! a... teste teste", 3)` → deve contar "teste" como duplicada, ignorar "oi" (2 chars limpo) e "a" (1 char limpo)

---

### P2: Validação de opções numéricas

**User Story**: Como usuário do CLI, quero receber mensagem de erro clara quando passo valores inválidos para `--min-chars` ou `--min-count`.

**Why P2**: NaN corrompe toda a lógica silenciosamente, sem feedback ao usuário.

**Acceptance Criteria**:

1. WHEN `--min-chars abc` THEN sistema SHALL exibir erro claro e encerrar com código 1
2. WHEN `--min-chars -1` THEN sistema SHALL exibir erro claro e encerrar com código 1
3. WHEN `--min-chars 0` THEN sistema SHALL exibir erro claro e encerrar com código 1
4. WHEN `--min-chars 5` THEN sistema SHALL prosseguir normalmente com minChars=5

**Independent Test**: Executar CLI com `--min-chars abc` e verificar erro no stderr e exit code 1

---

### P3: Suporte a CRLF e múltiplos espaços

**User Story**: Como usuário do CLI, quero que arquivos com quebras de linha Windows (CRLF) e tabs sejam processados corretamente.

**Why P3**: Arquivos compartilhados entre plataformas frequentemente têm CRLF.

**Acceptance Criteria**:

1. WHEN texto tem `\r\n` THEN sistema SHALL separar parágrafos corretamente
2. WHEN texto tem `\r` (Mac clássico) THEN sistema SHALL separar parágrafos corretamente
3. WHEN palavras são separadas por tabs THEN sistema SHALL tokenizar corretamente
4. WHEN há múltiplos espaços entre palavras THEN sistema SHALL não gerar tokens vazios

**Independent Test**: Processar arquivo com CRLF e verificar que parágrafos são detectados corretamente

---

### P4: Regex de pontuação PT-BR

**User Story**: Como usuário analisando textos em português, quero que aspas curvas, travessões e reticências sejam removidos como pontuação.

**Why P3**: Textos em PT-BR usam caracteres que a regex atual não cobre.

**Acceptance Criteria**:

1. WHEN palavra contém aspas curvas (`"..."` ou `'...'`) THEN sistema SHALL remover as aspas
2. WHEN palavra contém travessão (`—`) ou meia-risca (`–`) THEN sistema SHALL remover
3. WHEN palavra contém reticências (`…`) THEN sistema SHALL remover
4. WHEN palavra contém colchetes (`[`, `]`) THEN sistema SHALL remover
5. WHEN palavra contém letras acentuadas (á, é, ã, ç) THEN sistema SHALL preservar

**Independent Test**: `contaPalavras("São Paulo — \"grande\" cidade…", 3)` → deve tokenizar "são", "paulo", "grande", "cidade" corretamente

---

## Edge Cases

- WHEN texto vazio (`""`) THEN sistema SHALL retornar array vazio `[]`
- WHEN texto só com pontuação (`"!@#$"`) THEN sistema SHALL retornar array vazio `[]`
- WHEN parágrafo sem duplicatas THEN sistema SHALL retornar objeto vazio para aquele parágrafo
- WHEN `minChars` igual ao comprimento de uma palavra THEN sistema SHALL incluir essa palavra

---

## Requirement Traceability

| Requirement ID | Story    | Phase   | Status  |
| -------------- | -------- | ------- | ------- |
| BUG-01         | P1: Contagem   | Design  | Pending |
| BUG-02         | P1: Contagem   | Design  | Pending |
| BUG-03         | P1: Contagem   | Design  | Pending |
| BUG-04         | P1: Contagem   | Design  | Pending |
| VAL-01         | P2: Validação  | Design  | Pending |
| VAL-02         | P2: Validação  | Design  | Pending |
| VAL-03         | P2: Validação  | Design  | Pending |
| VAL-04         | P2: Validação  | Design  | Pending |
| SPLIT-01       | P3: CRLF       | Design  | Pending |
| SPLIT-02       | P3: CRLF       | Design  | Pending |
| SPLIT-03       | P3: Espaços     | Design  | Pending |
| SPLIT-04       | P3: Espaços     | Design  | Pending |
| PTBR-01        | P4: Regex       | Design  | Pending |
| PTBR-02        | P4: Regex       | Design  | Pending |
| PTBR-03        | P4: Regex       | Design  | Pending |
| PTBR-04        | P4: Regex       | Design  | Pending |
| PTBR-05        | P4: Regex       | Design  | Pending |

---

## Success Criteria

- [ ] `contaPalavras` produz resultados corretos para qualquer input textual
- [ ] CLI rejeita valores numéricos inválidos com mensagem clara
- [ ] Arquivos CRLF são processados corretamente
- [ ] Caracteres PT-BR são tratados corretamente (removidos como pontuação ou preservados como letras)
- [ ] Todos os testes existentes continuam passando
- [ ] Novos testes cobrem todos os edge cases documentados