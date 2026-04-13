# text-analyzer-cli — Project Vision

## Problem Statement

Projeto de estudo Node.js (Alura) que analisa arquivos de texto para identificar palavras duplicadas por parágrafo. Pretende servir como portfolio, mas possui bugs críticos, baixa cobertura de testes, falta infraestrutura (git, build) e não está pronto para publicação.

## Goals

- [ ] Corrigir todos os bugs críticos e de segurança identificados na análise
- [ ] Alcançar cobertura de testes abrangente para lógica core e CLI
- [ ] Infraestrutura profissional: git, build, distribuição
- [ ] Projeto publicado no GitHub como portfolio com README profissional

## Target Users

- Recrutadores e desenvolvedores avaliando o portfolio
- Próprio autor como referência de aprendizado Node.js/TypeScript

## Tech Stack

| Layer        | Technology              |
| ------------ | ----------------------- |
| Language     | TypeScript (ESM)        |
| Runtime      | Node.js >= 18           |
| CLI          | commander ^14           |
| Output       | chalk ^5                |
| Testing      | vitest ^4               |
| Linting      | eslint ^10 + typescript-eslint |
| Formatting   | prettier ^3             |
| Build        | tsc (to be added)       |

## Success Criteria

- [ ] Zero bugs críticos abertos (contagem de palavras, validação NaN, CRLF)
- [ ] Cobertura de testes cobrindo edge cases principais
- [ ] `npm run build` compila sem erros
- [ ] `npm test` passa com 100% dos testes
- [ ] `npm run lint` passa sem erros
- [ ] Repositório no GitHub com README profissional e LICENSE

## Out of Scope

| Feature             | Reason                                  |
| ------------------- | --------------------------------------- |
| Publicação no npm   | Opcional, não é bloqueador de portfolio |
| CI/CD automatizado | Pode ser adicionado depois              |
| Mudança de arquitetura | O projeto é pequeno, não precisa   |
| Internacionalização | CLI é em PT-BR, manter como está        |