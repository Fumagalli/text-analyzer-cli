# Test Coverage Specification

## Problem Statement

Os testes existentes não cobrem edge cases críticos: palavras com pontuação, NaN em opções numéricas, CRLF, conteúdo do arquivo de saída, e erros não mapeados. Os bugs da Fase 1 precisam de testes de regressão.

## Goals

- [ ] Cobrir todos os bugs corrigidos na feature `bug-fixes` com testes de regressão
- [ ] Teste de integração end-to-end do fluxo completo do CLI
- [ ] Verificar conteúdo escrito pelo `writeFile`

## Out of Scope

| Feature                     | Reason                                        |
| --------------------------- | --------------------------------------------- |
| 100% coverage numérica      | Objetivo é cobrir edge cases críticos, não métrica |
| Testes de performance       | Não é relevante para o escopo                |
| Mock de dependências externas | Projeto não tem dependências externas      |

---

## User Stories

### P1: Testes de regressão para bugs corrigidos ⭐ MVP

**User Story**: Como desenvolvedor, quero testes que garantam que os bugs corrigidos não voltem a acontecer.

**Why P1**: Sem testes de regressão, qualquer refatoração pode reintroduzir os bugs.

**Acceptance Criteria**:

1. WHEN palavra com pontuação é testada THEN teste SHALL verificar que `limpaPalavras` remove pontuação e contagem é correta
2. WHEN token só de pontuação é testado THEN teste SHALL verificar que nenhuma chave vazia é gerada
3. WHEN `--min-chars abc` é testado THEN teste SHALL verificar erro claro e exit code 1
4. WHEN `--min-chars -1` é testado THEN teste SHALL verificar rejeição de valores negativos
5. WHEN texto com CRLF é testado THEN teste SHALL verificar parágrafos separados corretamente
6. WHEN texto com tabs é testado THEN teste SHALL verificar tokenização correta
7. WHEN texto vazio é testado THEN teste SHALL retornar array vazio
8. WHEN regex PT-BR é testada THEN teste SHALL verificar remoção de aspas curvas, travessão, reticências

**Independent Test**: `npm test` passa com todos os novos testes

---

### P2: Teste de integração end-to-end

**User Story**: Como desenvolvedor, quero um teste que valide o fluxo completo do CLI: ler arquivo → processar → escrever resultado.

**Why P2**: Testes unitários não garantem que os componentes funcionam juntos.

**Acceptance Criteria**:

1. WHEN CLI processa um arquivo de entrada THEN resultado SHALL ser escrito no diretório de saída
2. WHEN conteúdo do arquivo de saída é verificado THEN formato SHALL corresponder ao esperado
3. WHEN arquivos temporários são usados THEN teste SHALL limpar após execução

**Independent Test**: Criar arquivo temporário, executar CLI, verificar resultado, limpar

---

### P3: Verificação de conteúdo do writeFile

**User Story**: Como desenvolvedor, quero que o teste de sucesso do CLI verifique o conteúdo escrito no arquivo, não apenas as mensagens de console.

**Why P3**: O teste atual verifica mensagens mas não o output real, permitindo bugs no formato.

**Acceptance Criteria**:

1. WHEN teste de sucesso executa THEN `writeFile` SHALL ser chamado com conteúdo formatado corretamente
2. WHEN mock de `writeFile` é inspecionado THEN conteúdo SHALL listar palavras duplicadas por parágrafo

**Independent Test**: Verificar que `fs.promises.writeFile` é chamado com string contendo "palavras duplicadas"

---

### P4: Teste de erro não mapeado

**User Story**: Como desenvolvedor, quero que `trataErros` lide com códigos de erro desconhecidos de forma previsível.

**Why P3**: O fallback de `trataErros` para erros não mapeados não é testado.

**Acceptance Criteria**:

1. WHEN erro com `code` desconhecido (ex: `"UNKNOWN"`) THEN `trataErros` SHALL re-throw com mensagem incluindo o erro original
2. WHEN erro sem `code` THEN `trataErros` SHALL re-throw como-is

**Independent Test**: `trataErros(new Error("test"))` — erro sem code é re-lançado

---

## Requirement Traceability

| Requirement ID | Story              | Phase   | Status  |
| -------------- | ------------------ | ------- | ------- |
| TEST-01        | P1: Regressão      | Design  | Pending |
| TEST-02        | P1: Regressão      | Design  | Pending |
| TEST-03        | P1: Regressão      | Design  | Pending |
| TEST-04        | P1: Regressão      | Design  | Pending |
| TEST-05        | P1: Regressão      | Design  | Pending |
| TEST-06        | P1: Regressão      | Design  | Pending |
| TEST-07        | P1: Regressão      | Design  | Pending |
| TEST-08        | P1: Regressão      | Design  | Pending |
| E2E-01         | P2: Integração     | Design  | Pending |
| E2E-02         | P2: Integração     | Design  | Pending |
| E2E-03         | P2: Integração     | Design  | Pending |
| WRITE-01       | P3: writeFile      | Design  | Pending |
| WRITE-02       | P3: writeFile      | Design  | Pending |
| ERR-01         | P4: Erro mapeado   | Design  | Pending |
| ERR-02         | P4: Erro mapeado   | Design  | Pending |

---

## Success Criteria

- [ ] Todos os bugs corrigidos têm testes de regressão
- [ ] Teste de integração e2e passa
- [ ] Conteúdo do `writeFile` é verificado
- [ ] `npm test` passa com 0 falhas
- [ ] Nenhum teste existente foi removido ou enfraquecido