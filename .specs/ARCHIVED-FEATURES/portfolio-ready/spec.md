# Portfolio Ready Specification

## Problem Statement

O CLI falta funcionalidades esperadas em ferramentas profissionais: nome de arquivo de saída configurável, modo silencioso para scripts, I/O async consistente, e tipagem descritiva. O README precisa de badges, exemplos e documentação profissional. Falta arquivo LICENSE.

## Goals

- [ ] CLI com opção `--output` customizável e `--quiet` para scripts
- [ ] I/O async consistente (sem `fs.existsSync`/`fs.statSync`)
- [ ] Tipagem descritiva (`ContagemParagrafo`, `NodeJS.ErrnoException`)
- [ ] README profissional com badges, exemplos e documentação completa
- [ ] Arquivo LICENSE (MIT)

## Out of Scope

| Feature                   | Reason                                      |
| ------------------------- | ------------------------------------------- |
| Publicação no npm         | Será feita em milestone futuro              |
| Internacionalização       | Manter PT-BR                                |
| Novos comandos ou flags  | Escopo é melhorar, não adicionar features   |

---

## User Stories

### P1: Opção `--output` e `--quiet` ⭐ MVP

**User Story**: Como usuário do CLI, quero especificar o nome do arquivo de saída e suprimir mensagens de console para usar em scripts.

**Why P1**: `resultado.txt` hardcoded e mensagens ininterruptas impedem uso em pipelines.

**Acceptance Criteria**:

1. WHEN `--output saida.txt` THEN sistema SHALL criar arquivo com nome customizado
2. WHEN `--output` não é especificado THEN sistema SHALL usar `resultado.txt` como padrão
3. WHEN `--quiet` é especificado THEN sistema SHALL suprimir todas as mensagens de console
4. WHEN `--quiet` NÃO é especificado THEN sistema SHALL exibir mensagens normalmente

**Independent Test**: `node cli.ts -t input.txt -d ./out -o result.txt --quiet` → cria `result.txt` sem output

---

### P2: I/O async consistente

**User Story**: Como desenvolvedor, quero que todas as operações de I/O sejam async para consistência e performance.

**Why P2**: `validaEntrada` usa `fs.existsSync`/`fs.statSync` (blocking) enquanto `processaArquivo` usa async.

**Acceptance Criteria**:

1. WHEN `validaEntrada` é refatorada THEN função SHALL ser async e usar `fs.promises`
2. WHEN testes existentes rodam THEN todos SHALL continuar passando
3. WHEN erro de validação ocorre THEN mensagem SHALL ser a mesma de antes

**Independent Test**: `npm test` passa sem alterações nos testes existentes

---

### P3: Tipagem descritiva

**User Story**: Como desenvolvedor, quero tipos nomeados em vez de tipos literais para melhor legibilidade e refatoração.

**Why P3**: `Record<string, number>[]` e `Error & { code?: string }` são tipos literais difíceis de manter.

**Acceptance Criteria**:

1. WHEN `ContagemParagrafo` é criado THEN tipo SHALL ser usado em `contaPalavras` e `helpers`
2. WHEN `ErroComCodigo` é substituído THEN tipo SHALL ser `NodeJS.ErrnoException`
3. WHEN tipo de opções do CLI é criado THEN interface SHALL ser usada em `cli.ts`

**Independent Test**: `npm run typecheck` passa sem erros

---

### P4: README profissional e LICENSE

**User Story**: Como recrutador avaliando o portfolio, quero um README claro com badges, exemplos e documentação completa.

**Why P2**: README é a primeira coisa que recrutadores veem.

**Acceptance Criteria**:

1. WHEN README é atualizado THEN SHALL conter badges (license, node version)
2. WHEN README é atualizado THEN SHALL conter exemplos de uso com saída esperada
3. WHEN README é atualizado THEN SHALL documentar todas as opções CLI incluindo `--output` e `--quiet`
4. WHEN README é atualizado THEN SHALL ter seção de estrutura do projeto
5. WHEN LICENSE é criado THEN SHALL ser MIT

**Independent Test**: README renderiza corretamente no GitHub

---

## Requirement Traceability

| Requirement ID | Story          | Phase   | Status  |
| -------------- | -------------- | ------- | ------- |
| CLI-01         | P1: Output     | Design  | Pending |
| CLI-02         | P1: Output     | Design  | Pending |
| CLI-03         | P1: Quiet      | Design  | Pending |
| CLI-04         | P1: Quiet      | Design  | Pending |
| ASYNC-01       | P2: Async      | Design  | Pending |
| ASYNC-02       | P2: Async      | Design  | Pending |
| ASYNC-03       | P2: Async      | Design  | Pending |
| TYPE-01        | P3: Tipagem   | Design  | Pending |
| TYPE-02        | P3: Tipagem   | Design  | Pending |
| TYPE-03        | P3: Tipagem   | Design  | Pending |
| DOC-01         | P4: README     | Design  | Pending |
| DOC-02         | P4: README     | Design  | Pending |
| DOC-03         | P4: README     | Design  | Pending |
| DOC-04         | P4: README     | Design  | Pending |
| DOC-05         | P4: LICENSE    | Design  | Pending |

---

## Success Criteria

- [ ] CLI aceita `--output` e `--quiet`
- [ ] I/O é 100% async
- [ ] Tipos são descritivos e `typecheck` passa
- [ ] README tem badges, exemplos e documentação completa
- [ ] Arquivo LICENSE existe