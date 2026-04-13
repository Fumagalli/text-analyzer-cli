# TDD Feature Specification Template

> Use este template para **toda** nova feature. Segue o padrão TDD + TLC-spec-driven.
> 
> **Conformidade**: Todas as features devem ter estas 4 seções (4 arquivos .md).

---

## Estrutura Obrigatória

```
.specs/features/[feature-name]/
├── FEATURE-SPEC.md          ← Requisitos WHAT (Especificação)
├── DESIGN.md                ← Estratégia HOW (Arquitetura)
├── TASKS.md                 ← Execução STEP-BY-STEP
└── RISKS.md                 ← Riscos e Rollback (NOVO!)
```

---

## 📋 Checklist de Conformidade TDD

Quando **especificar** uma nova feature, responda estas perguntas (serão suas seções):

### ✅ Seção 1: FEATURE-SPEC.md — O QUÊ?

```markdown
# Feature: [Nome da Feature]

**Status:** Specified  
**Created:** YYYY-MM-DD  
**Owner:** Team  
**Priority:** [High/Medium/Low] + [Category]  

---

## 🎯 Vision (Why?)
- Explique o problema/oportunidade
- Por que isso é importante agora
- Impacto esperado

## 📋 Requirements

### REQ-001: [Requisito 1]
- **Scope**: O que será alterado
- **Acceptance Criteria**: Como validar
- **Traceable**: T1, T2 (vinculado às tasks)

### REQ-002: [Requisito 2]
... (continue)

## ✅ Success Criteria
- O projeto será considerado pronto quando:
  - [ ] Critério 1
  - [ ] Critério 2
  - [ ] Critério 3

## 📝 Assumptions
- Pressupostos do projeto

## ❌ Out of Scope (Future)
- O que NÃO será feito nesta versão
```

### ✅ Seção 2: DESIGN.md — COMO?

```markdown
# Design: [Nome da Feature]

**Feature:** [feature-name]  
**Date:** YYYY-MM-DD  
**Status:** Ready for implementation  
**Architecture Type:** [Refactor/Feature/Integration/etc]

---

## Architecture Overview
- Diagrama visual (ASCII ou Mermaid)
- Flow de dados
- Componentes afetados

## Function/Component Mapping
- [Old] → [New] (se refactor)
- Ou: Novos componentes e dependências

## Import Dependencies
- O quê depende do quê
- Sequência de implementação (task order)

## Message/UX Preservation
- O que NÃO deve mudar (user-facing)
```

### ✅ Seção 3: TASKS.md — STEP-BY-STEP

```markdown
# Tasks: [Nome da Feature]

**Feature:** [feature-name]  
**Total Tasks:** N  
**Status:** Ready to execute  
**Estimated Time:** HH-MM minutes

---

## Task Breakdown

### [ ] T1: [Tarefa 1]
**What:** Breve descrição  
**Where:** Arquivo(s)  
**Depends on:** T0, T2 (ou None)  
**Reuses:** Escreva se reutiliza output de outra task

**Done When:**
- ✅ Critério 1
- ✅ Critério 2

**Verification:**
\`\`\`bash
npm test
npm run typecheck
\`\`\`

**Gate:** [Qual verificação deve passar]

### [ ] T2: [Tarefa 2]
... (continue)

## Dependency Chain
\`\`\`
T1 (independent)
 ├─→ T2 (depends on T1)
 │   ├─→ T3 (depends on T2)
 │   └─→ T4 (parallel with T3)
 └─→ T5 (final: aggregation)
\`\`\`
```

### ✅ Seção 4: RISKS.md — O QUÊ PODE DAR ERRADO?

```markdown
# Risks: [Nome da Feature]

---

## Risk Matrix

| Risk ID | Risk | Probability | Impact | Mitigation |
|---------|------|-------------|--------|-----------|
| R-001 | [Risk 1] | Medium | High | [Como mitigar] |
| R-002 | [Risk 2] | Low | Medium | [Como mitigar] |

---

## Rollback Plan

**If something breaks:**
1. \`git reset --hard HEAD~1\` (volta ao commit anterior)
2. \`npm test\` (valida reversão)
3. Investigar post-mortem
4. Retry com ajustes

**Rollback Triggers:**
- [x] Test suite fails (>1 test broken)
- [x] TypeScript errors appear
- [x] Critical functionality broken
- [ ] [Custom trigger]

---

## Known Limitations
- [Limitação 1]
- [Limitação 2]
```

---

## 🚀 Como Usar Este Template

### Passo 1: Criar a pasta da feature
```bash
mkdir -p .specs/features/[feature-name]
cd .specs/features/[feature-name]
```

### Passo 2: Copiar e preencher os 4 arquivos
```bash
cp FEATURE-SPEC-TEMPLATE.md .specs/features/[feature-name]/FEATURE-SPEC.md
# Editar:
# - FEATURE-SPEC.md (especificação + requirements)
# - DESIGN.md (arquitetura + mapping)
# - TASKS.md (tarefas atômicas)
# - RISKS.md (riscos + rollback)
```

### Passo 3: Executar com TLC-spec-driven Skill
Quando pronto para implementar, peça ao agente:

```
Use a skill TLC-spec-driven para implementar a feature [feature-name].
Siga o padrão documentado em .specs/features/[feature-name]/.
```

O agente fará:
1. **Specify:** Valida spec + design + tasks + risks
2. **Design:** Revisa arquitetura
3. **Tasks:** Executa T1 → T2 → ... → Tn
4. **Execute:** Implementa com verificação atomic

---

## ✅ Validação Pré-Implementação

Antes de começar a implementar, valide:

- [ ] FEATURE-SPEC.md tem 4+ Requirements
- [ ] DESIGN.md tem Architecture Overview + Mapping
- [ ] TASKS.md tem 3+ Tasks com Dependencies claras
- [ ] RISKS.md tem 2+ Risks com Mitigations
- [ ] Acceptance Criteria é testável
- [ ] Success Criteria é verificável post-implementation
- [ ] Rollback Plan é executável em <5 minutos

---

## 📚 Examples

### Exemplo 1: Refactor (Simples)
Veja: [`.specs/features/refactor-to-english/`](../refactor-to-english/)

### Exemplo 2: Feature (Médio)
_Criar quando primeira feature for mapeada_

### Exemplo 3: Integration (Complexo)
_Criar quando integração for necessária_

---

## 🎯 TDD Checklist (Mandatory)

Todas as features devem responder estas 7 questões (mapa para seções TDD):

1. **Context** (Contexto) → FEATURE-SPEC.md: Vision
2. **Problem Statement** (O que resolver) → FEATURE-SPEC.md: Requirements  
3. **Scope** (Onde chega/não chega) → FEATURE-SPEC.md: In-Scope/Out-of-Scope
4. **Technical Solution** (Como resolver) → DESIGN.md: Architecture
5. **Risks** (O que pode dar errado) → RISKS.md: Risk Matrix
6. **Implementation Plan** (Passo a passo) → TASKS.md: Task Breakdown
7. **Rollback Plan** (Como reverter) → RISKS.md: Rollback Plan

✅ Responda todas as 7 = Sua feature está TDD-compliant
