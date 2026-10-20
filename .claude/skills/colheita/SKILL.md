---
name: colheita
description: Ao dar um trabalho por pronto, separa o que ele ensinou e propõe o destino de cada coisa (regra que entra ou sai, skill, página, perfil do repositório ou descarte), com a conclusão auditada antes. Use quando o trabalho terminar ou quando pedirem "o que disso vira regra?", "colhe isso" ou a análise de promoção.
---

# Colheita

Ao dar um trabalho por pronto, separe o que ele ensinou e proponha o destino. Regra, skill e página mudam
com o sim do dono: proponha, não aplique. Passo sem matéria não se inventa: diga que não há e siga.

A colheita não fecha a tarefa. Depois dela, feche como manda o `PERFIL.md`.

## Antes: a conclusão está auditada?

Trabalho que terminou numa conclusão (causa, diagnóstico, regra deduzida) passa pela skill
`verificacao-adversarial` antes de virar proposta.

## O que colher

1. **Regras.** Alguma ajudou, atrapalhou ou faltou? Proponha a que entra e a que sai, pelo arquivo
   (`regras/<nome>.md`), com o texto novo e o porquê. Antes de reescrever, confira se a regra carregou na sessão.
   Se não carregou, o problema é carga, não texto. Regra sem commit há mais de 60 dias
   (`git -C <raiz> log -1 --format=%cs -- regras/<nome>.md`): pergunte se ela ainda se paga.
2. **Automação.** O que se repetiu e vale virar skill ou script? Diga o quê e por quê.
3. **Repositório.** O que você descobriu que pouparia tempo da próxima sessão? Atualize o perfil pela skill
   `perfil-de-repositorio`, sem tocar no que o dono declarou.
4. **Destino.** Em cada repositório tocado, todo commit está mesclado ou em PR aberto (`regras/destino.md`).
   Commit de outra sessão: relate ao dono.
5. **O que atrapalhou.** Só o que você viu acontecer: pedido caro, ferramenta errada, passo repetido. Vai
   como linha em `~/atlas-diario/ciclo.md` (`- AAAA-MM-DD · atrapalhou · <o quê>`); sem o diário, diga na
   conversa.
6. **Memória.** Siga `regras/memoria.md`; o que contradiz outra memória também vira pergunta ao dono. O que já
   entrou no atlas ou na issue e o arquivo de entrega já mesclada saem dela, mas quem tira é o dono: proponha a lista.

## Três montes

- **Do atlas** (serve a qualquer repositório): proponha regra, skill ou página, com o texto já sem nome de
  pessoa, projeto, organização ou máquina. Antes, procure a página que já trata do assunto e proponha melhorá-la.
  Página nova só com o link de quem vai lê-la.
- **Do repositório:** nota em `conhecimento/` dele, ou no perfil.
- **Gancho do git:** erro de projeto que voltou e cabe num comando vira aviso, no molde de `.githooks/segredo.sh`:
  avisa e diz o conserto. A linha de texto sai no mesmo PR.
- **Descarte:** diga o que descartou, em uma linha. O dono pode discordar.

Na dúvida entre atlas e repositório, é do repositório.

## Números

Todo número da colheita vem com o comando que o produziu, medido agora. Defeito já consertado vai com o
commit do conserto, na mesma linha.
