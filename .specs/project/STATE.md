# text-analyzer-cli — State

## Decisions

| Decision                                        | Rationale                                                    | Date       |
| ----------------------------------------------- | ------------------------------------------------------------ | ---------- |
| Manter estrutura de diretório `PrimeiraBiblioteca/` | Projeto de estudo, mover pode quebrar referências            | 2026-04-09 |
| Usar `/\r?\n/` para split de linhas             | Suporta CRLF (Windows) e LF (Unix) sem quebrar              | 2026-04-09 |
| Usar `/\s+/` para split de palavras             | Lida com tabs e múltiplos espaços                            | 2026-04-09 |
| Manter `vitest` como framework de teste         | Já configurado e funcionando, sem razão para trocar          | 2026-04-09 |
| Adicionar build step com `tsc`                 | Necessário para distribuição como CLI global e publicação npm | 2026-04-09 |
| Length check DEPOIS de `limpaPalavras`          | Bug B1/B2 — palavras com pontuação eram contadas incorretamente | 2026-04-10 |
| Filtrar parágrafos vazios no split              | `/\r?\n/` pode gerar strings vazias em arquivos com linhas em branco | 2026-04-10 |
| `process.exit(1)` para inputs inválidos         | Convenção CLI — args inválidos devem sair com código não-zero  | 2026-04-10 |
| `validaInteiroPositivo` como função separada    | Mantém validação de paths separada de validação de números    | 2026-04-10 |

## Blockers

| Blocker                  | Status   | Impact                        |
| ------------------------ | -------- | ----------------------------- |
| Sem repositório Git      | Resolved | Repositório inicializado e commits atômicos habilitados |
| Bug de contagem (B1/B2)  | Resolved | Correções de M1 concluídas com gates verdes |

## Lessons Learned

| Lesson                                                         | Context                                 |
| -------------------------------------------------------------- | --------------------------------------- |
| Length check deve vir DEPOIS da limpeza de pontuação           | Bug B1 — palavras curtas com pontuação  |
| `parseInt` sem validação produz NaN silencioso                 | Bug de segurança S1                     |
| Regex de pontuação deve cobrir caracteres PT-BR                | Aspas curvas, travessão, reticências    |
| `/\s+/` é mais robusto que `' '` para split de palavras         | Tabs e múltiplos espaços não são tratados por `' '` |
| `/\r?\n/` é o padrão cross-platform para split de linhas        | CRLF do Windows é muito comum em arquivos compartilhados |

## Deferred Ideas

| Idea                                   | Reason                          | Priority |
| -------------------------------------- | ------------------------------- | -------- |
| Stream processing para arquivos > 100MB | M1 T1.2 usa `split(/\s+/)` que é O(n) em memória; streams evita carregar tudo | P2 |
| Worker threads para análise paralela | Parágrafos são independentes; análise regex é CPU-bound | P2 |
| Publicação no npm                      | Não é bloquerador de portfolio   | P3       |
| CI/CD com GitHub Actions               | Pode ser adicionado depois      | P3       |
| Internacionalização (i18n) do CLI     | Manter PT-BR por enquanto       | P3       |
| Opção `--verbose` no CLI              | Nice-to-have, não essencial     | P3       |

## Preferences

- Modelo mais rápido é suficiente para tarefas leves (validação, state updates)