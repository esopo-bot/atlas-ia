# Mapas do Atlas

Leia só o mapa que responde à tarefa. Ele resume relações; `AGENTS.md`, o fluxo aplicável, a fonte de verdade e a
prova observada prevalecem sobre qualquer desenho.

## Ciclo de entrega

```mermaid
flowchart LR
  P[Pedido] --> T{Triagem}
  T -->|pronto| I[intent ou item equivalente]
  T -->|dependência| D[Registrar gatilho]
  I --> S[spec ou campos equivalentes]
  S --> L[plan ou campos equivalentes]
  L --> B[Diff e testes]
  B --> R[Revisão e CI]
  R --> M[Merge pelo fluxo]
  M --> O[Observar e manter]
  O --> K[Conhecimento rastreável]
  K --> P
```

## Roteamento

```mermaid
flowchart TD
  Q[Pedido ou retomada] --> A{O que falta?}
  A -->|prioridade ou dependência| T[fluxos triagem]
  A -->|decisão ou pesquisa útil| K[fluxos conhecimento]
  A -->|mudança ou fronteira| R[fluxos teste e segurança]
  A -->|pesquisa externa| E[prompt pesquisar fonte]
  A -->|skill candidata| S[prompt avaliar skill]
  T --> F[Fonte de verdade]
  K --> F
  R --> F
  E --> F
  S --> F
```

## Conhecimento

```mermaid
flowchart LR
  E[Evidência ou decisão] --> C{Classificar}
  C -->|universal| A[Propor AGENTS ou fluxo]
  C -->|do projeto| P[Regra do projeto]
  C -->|da tarefa| T[Issue spec plano ou PR]
  C -->|do dono, fora do projeto| M[meu/conhecimento aponta a fonte]
  C -->|sem evidência| N[Marcar não medido ou não persistir]
  A --> V[Fonte de verdade]
  P --> V
  T --> V
```

## Risco e prova

```mermaid
flowchart TD
  M[Mudança] --> I[Identificar entrada, acesso e saída]
  I --> X{Texto não confiável + dado sensível + escrita externa?}
  X -->|sim| G[Separar leitura, reduzir permissão ou exigir aprovação]
  X -->|não| P{Escolher prova proporcional}
  G --> P
  P -->|regra ou defeito| U[Teste focal]
  P -->|fronteira| C[Contrato ou integração]
  P -->|jornada| E[Fluxo de ponta a ponta ou imagem]
  P -->|prompt ou configuração| V[Avaliação sintética]
  U --> F[Prova no SHA]
  C --> F
  E --> F
  V --> F
```

## Local e nuvem

```mermaid
flowchart LR
  A[Revisão aprovada do Atlas] --> B{Entrada da sessão}
  B -->|anexo| S[Sessão]
  B -->|checkout somente leitura| S
  B -->|referência aprovada| S
  S --> P[Instruções do projeto]
  P --> H[Adaptador: Claude, Codex, Devin ou Copilot]
  H --> F[Fluxo selecionado]
  F --> V[Fonte de verdade e prova]
  V --> R[Retomada por artefato durável]
```
