---
name: jeito-de-falar
description: 'Diário do dono em ~/atlas-diario e o passo a passo de abrir, fechar e retomar tarefa;
  em references/rotinas.md, revisão da semana, medida, "Aprendi", estudo, cópias do perfil.
  Leia ao abrir ou fechar tarefa, antes de abrir ou atualizar issue ou PR, quando o dono disser "onde estávamos?",
  "o que eu fiz?", "revisão da semana", "quero estudar X" ou "atualiza as cópias do perfil",
  e quando ele reclamar do texto. Só na sessão com o dono.'
---

# Jeito de falar: diário, abrir, fechar e retomar

versão: 2026-10-19-a
Complemento do `PERFIL.md`, que tem os ajustes, os tetos e as regras de escrita.
Revisão da semana, aprendizado, estudo, medida e cópias: leia antes [references/rotinas.md](references/rotinas.md).

## 1. O diário

Pasta `~/atlas-diario/`, uma por máquina, fora de qualquer repositório e do git.
Na primeira vez numa máquina, crie a pasta e os arquivos. Na nuvem (`CLAUDE_CODE_REMOTE` é `true`), não crie nem
avise: a thread é a tarefa, o checklist de status faz o papel do `agora.md` e o corpo da issue faz a ponte.

| Arquivo | Para quê |
| --- | --- |
| `agora.md` | o que está aberto: Agora, Esperando, Estacionado; no topo, a data da próxima revisão |
| `AAAA-MM.md` | o que foi feito no mês, uma seção por dia |
| `aprendi.md` | a fila de perguntas de revisão |
| `conheco.md` | a resposta do dono a "isso é novo para você?", para a pergunta não voltar |
| `estudar.md` | assuntos de fora das tarefas que o dono quer estudar |
| `ciclo.md` | reclamações e revisões semanais |
| `detalhe/` | o que passou do teto, o "explica" e o `corpo.md` da contagem, em `AAAA-MM-DD-assunto.md` |

Regras de linha: um item por linha, começando por `-` e um espaço; campos separados por ` · `; data AAAA-MM-DD no
primeiro campo. O formato fixo existe para a medida funcionar sem código.

`agora.md`:

```text
revisão: 2026-10-12
## Agora
- 2026-10-05 · claude-code · atlas · perfil v3 · pronta quando: dono aprova · próximo: medir · issue <n>
## Esperando
- 2026-10-05 · claude-code · atlas · build da branch · volta quando: CI verde · então: seguir
## Estacionado
- 2026-10-03 · codex · estudos · estudo de Node · volta quando: fechar a tarefa atual
```

- Agora: criação · agente · pasta · tarefa · pronta quando: critério · próximo: passo · link.
- Esperando: criação · agente · pasta · o quê · volta quando: gatilho · então: ação.
- Estacionado: criação · agente · pasta · o quê · volta quando: gatilho.
- Sua linha é a que você gravou nesta conversa. Reconheça-a pela tarefa: duas sessões podem ter o mesmo agente e pasta.
- Releia o arquivo logo antes de gravar e mude só a sua linha. Releia também ao fim de cada passo do plano.
- Grave com a ferramenta de edição do agente, pelo caminho absoluto (o `~` já expandido). No Claude Code, escrever
  por `sed -i`, `>` ou `>>` num alvo com `~` ou variável pede aprovação ao dono a cada vez.
- Se a sua linha saiu de Agora, o dono trocou de tarefa em outra sessão: pare, diga em uma linha onde parou e siga o
  que estiver lá.

`AAAA-MM.md` (o índice; havendo issue, o corpo e o relato dela são o detalhe):

```text
## 2026-10-05
- Fechada: perfil v3 gravado · Conferir: wc -lc PERFIL.md · claude-code · atlas · issue <n>
- Fechada: correção de fuso em parseDate · Conferir: npm test · codex · estudos · PR <n> · Aprendi: fuso: compare em UTC
```

`aprendi.md`, `conheco.md`, `estudar.md` e `ciclo.md`, nessa ordem:

```text
- 2026-10-05 · fuso: converta as datas para UTC antes de comparar · revisar: 2026-10-12 · acertos: 0 · PR <n>
- 2026-10-05 · rebase interativo · novo
- 2026-10-05 · avaliação de agentes com casos de teste · pedido na conversa
- 2026-10-05 · reclamação · longo · conversa · resposta sobre rebase · 19 linhas
- 2026-10-12 · revisão · ajudou: em parte · mudanças: 2 · versão: 2026-10-12
```

Em `conheco.md`, o último campo é `novo` ou `domino`. Antes de perguntar se um assunto é novo, procure-o lá.

## 2. Abrir e fechar

Abrir, depois do pedido e nunca antes:

1. Leia `agora.md`. Com Agora vazio, grave a linha e diga a abertura do núcleo; sem critério de pronto, proponha um.
2. Com Agora ocupado, faça a pergunta do núcleo. "Trocar": a linha atual vai para Estacionado com o próximo passo.
   "A outra sessão parou": troque agente e pasta da linha pelos seus e siga do próximo passo dela.

Quando o gatilho de uma linha em Esperando dispara, o que for de um passo se faz na hora; o que for maior volta para
Agora, se estiver vazio.

Fechar:

1. Antes de abrir ou atualizar issue, grave o corpo em `detalhe/corpo.md` e conte o corpo inteiro com `conta_issue`.
   Contar de cabeça erra. Sem o diário (nuvem), grave em `/tmp/corpo.md`.
2. PR em lista com `-`, no teto `pr`; os pontos começam por "Mudou:", "Por quê:", "Testado:", "Risco:" e
   "Conferir:"; depois deles, uma figura (`mermaid`). Saída de teste vai em `<details>`.
3. Grave a linha do mês, libere Agora e mande a sobra, nomeada, para Estacionado.
4. Havendo issue, escreva o relato (teto `relato`) e atualize o corpo dela.
5. Se houve "Aprendi" e a semana (segunda a domingo) ainda não tem item novo em `aprendi.md`, grave-o lá com `revisar`
   uma semana à frente. Os outros ficam só na linha do mês. Só entra o que foi novo para o dono: o que está em `base`
   ou como `domino` fica fora. "Troca o da semana por X" troca o item.
6. Diga o fechamento do núcleo. Se a data do topo de `agora.md` já passou, ofereça a revisão da semana em uma linha.
7. Proponha sessão nova só se a ferramenta ou o contexto travou, com o último comando e o que tentou.

Contagem, no Git Bash:

```bash
export LC_ALL=C.UTF-8   # sem isso, o awk do Git Bash conta bytes e "ação" vale 6
conta() { awk '/<details>/{exit} NF{n+=int((length+119)/120)} END{print n+0}'; }                  # conversa
conta_issue() { awk '/^ *```/{f=!f; next} f{next} /^(---|_Generated by .*_)$/{next} /^ *[|]/{n++; next} NF{n+=int((length+119)/120)} END{print n+0}'; }
conta_issue < ~/atlas-diario/detalhe/corpo.md
```

`conta_issue` pula os blocos de desenho e a assinatura que a nuvem põe no fim (`---` e `_Generated by ..._`), e
conta cada linha de tabela como 1. No Codex o shell é PowerShell:

```powershell
$n = 0; $f = $false; foreach ($l in Get-Content "$HOME\atlas-diario\detalhe\corpo.md" -Encoding UTF8) {
  if ($l -match '^\s*```') { $f = -not $f; continue }; if ($f -or -not $l.Trim() -or $l -match '^(---|_Generated by .*_)$') { continue }
  if ($l -match '^\s*\|') { $n++ } else { $n += [math]::Ceiling($l.Length / 120) } }; $n
```

Reclamação: quando o dono reclamar do texto, grave em `ciclo.md` o tipo (`longo`, `curto`, `sem porquê`, `outro`) e
o canal. Em `longo`, grave a resposta em `detalhe/corpo.md`, conte com `conta` e ponha o número na linha.

## 3. Retomada e "o que eu fiz?"

Quando retomar está no núcleo. Para retomar:

1. Leia `agora.md`. Havendo link de issue e `gh`, leia o corpo dela. Na pasta da tarefa, `git log --oneline -5`.
2. Dê uma linha para cada item do núcleo; some uma se algo em Esperando já pode voltar.
3. Não pergunte onde ele estava. Faltando a issue (ou o diário, fora da nuvem), diga o que leu e o que não achou.

"O que eu fiz hoje, esta semana, em setembro?": responda do `AAAA-MM.md`, por dia, uma linha por tarefa, com o link.
Se não couber no teto `conversa`, dê a contagem e grave a lista em `detalhe/`.
Outra máquina, sessão na nuvem ou mês sem diário: as issues fazem a ponte, com `git log --since=AAAA-MM-DD` na pasta.
A busca, pela REST, vale também na nuvem e pega as issues de qualquer autor (mais de 100: some `&page=2`):

```bash
gh api 'repos/<issues>/issues?state=all&since=2026-09-01T00:00:00Z&per_page=100' --jq '.[] | select(.pull_request | not) | "\(.number) \(.title) \(.html_url)"'
```

Sem `gh` na máquina, avise em uma linha, use o diário e o `git log`, e dê ao dono o link da busca de issues.
