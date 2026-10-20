---
name: verificacao-adversarial
description: Ataca uma conclusão antes de agir sobre ela, separando provado de suposto, ou revisa uma mudança de código por várias lentes, com um cético tentando derrubar cada achado. Use ao fechar diagnóstico ou investigação, antes de escalar ou aplicar conserto baseado em hipótese, e quando pedirem "roda o cético", "isso está provado?" ou "revisa esse código por várias lentes".
---

# Verificação adversarial

Conclusão não atacada não está pronta.

## O procedimento

1. **Desmonte a conclusão em afirmações.** Escreva as estruturais: as que, se falsas, derrubam o veredito.
   Ignore as decorativas.
2. **Marque cada uma: provada ou suposta.** Provada = existe saída de instrumento que você viu. "Costuma ser
   assim", "o código sugere" e "faz sentido" são suposições, mesmo quando corretas.
3. **Para cada suposta, desenhe a medição mais barata que a derrubaria.** A pergunta não é "como confirmo?",
   é "o que eu veria se ela fosse falsa?".
4. **Zero e vazio não provam ausência.** "Não achei" pode ser retenção vencida, filtro estreito ou
   instrumento sem cobertura: antes de aceitar um zero, faça a contraprova da regra `prova`.
5. **Execute o que der.** Medição barata primeiro. O que não puder ser medido agora fica como não medido,
   não como verdade provisória.
6. **Reemita o veredito em três faixas:** provado (instrumento mostrou), provável (evidência forte, sem
   instrumento), não provado (de pé só por falta de contradição). Liste no fim o que segue sem prova.

## A regra de ouro

A hipótese se anuncia com o mesmo volume da evidência, nunca mais alto. Três medições e uma suposição se
dizem na mesma frase, não numa nota de rodapé.

## Medição que varia

Onde a saída muda entre execuções iguais (modelo, relógio, custo), uma rodada só não separa causa de acaso.
Meça o ruído antes de comparar e desconfie de diferença menor que ele. Máquina ocupada responde por outro
instante: repita com ela livre ou, sem isso, alterne as rodadas dos dois lados na mesma janela e decida pela
mediana. O exit que vale é o do comando medido, não o do cano nem o do `tail`. Antes e depois no mesmo
contexto: mesmo checkout (cópia sem `.git` pode mudar o que o build gera), mesmas dependências e relógio real
(relógio falso de teste troca timers e `performance`). O limite de aceite se grava antes da coleta.

## Sinais de que a conclusão precisa do cético agora

- Ela apareceu cedo e tudo depois pareceu confirmá-la.
- É a única hipótese que alguém levantou.
- Explica o sintoma sem explicar o começo dele ("por que hoje?").
- Alguém vai agir caro em cima dela (escalar, reverter) ou ela vai sair daqui: e-mail, revisão, mensagem a
  terceiro.

Onde não vale: pergunta que um comando ou canário responde em minutos. Aí o teste é a prova (regra `economia`).

## Quando o alvo é o trabalho de outra sessão

A verificação vale mais numa sessão limpa, sem apego à conclusão. Travas a mais:

- **Rode os instrumentos você mesmo** (regra `prova`).
- **Não conserte nada.** Isto é um relatório.
- **Número se mede de novo, dizendo o que você contou.** Duas medições honestas de coisas um pouco
  diferentes discordam, e a discordância parece erro quando é definição.
- **Conserto de um conserto se compara em três pontos:** a base, a ponta anterior e a nova. Contra a base
  só, o diff soma os dois consertos e esconde a regressão do segundo.

## A segunda forma: várias lentes sobre uma mudança de código

No Claude Code, a rodada é o workflow `.claude/workflows/ceticos.js` (`/ceticos`). Ele roda 3 lentes
independentes (correção, caminho de erro, usuário final, esta com os números reais do dado), até 5 achados
por lente. Cada achado ganha um cético que tenta reproduzi-lo; os graves ganham um segundo, que lê o
contrato. A rodada para em 9 agentes.

- `args`: `alvo` (`{"base": "<base>", "ponta": "<branch>"}` ou `{"arquivos": ["<caminho>"]}`), `contexto` (o
  objetivo da issue) e, quando houver, `revisao_do_codex` (o texto da revisão, lido como lista de achados).
  Lentes e céticos leem o `git` da pasta da sessão: numa worktree do mesmo repositório, a `ponta` é a branch dela,
  não `HEAD`. Noutro repositório, o `contexto` leva o caminho só às lentes: o cético recebe o `alvo` e mede onde
  roda; confira a pasta no comando de cada veredito.
- Volta: provado, provável, não provado, derrubado e sem voto, cada achado com o comando e a saída.
- Leia antes `lentes_que_cairam` e `revisao_do_codex.fora_do_formato`: o que está ali não foi medido.
  Com `nao_mediu`, todas as lentes caíram: rode de novo, porque zero lido não é zero achado.
- Sem voto não é derrubado: o teto acabou antes do cético.
- **Revisor que roda código não chama o programa real** (nuvem, banco): proibir no pedido não segura. Ponha um
  substituto à frente no `PATH`, em forma Unix (`/c/...`: no Git Bash o `:` de `C:` parte o `PATH` e o programa
  real volta), e prove com `command -v <programa>` antes de soltar o revisor.
- Antes de agir num achado, rode de novo o comando dele e leve o veredito ao critério que ele toca, no corpo da issue;
  a lista inteira vai no PR, em `<details>`.
- A `revisao_do_codex` sai do plugin oficial. O `/codex:review` só roda quando o dono digita
  (`disable-model-invocation`); o agente chama o script dele, da raiz da árvore revisada:
  `node ~/.claude/plugins/cache/openai-codex/codex/<versão>/scripts/codex-companion.mjs review --wait --base <base>`.
  "No code was inspected" ou "Review blocked" é não medido, não zero achado.

Agente sem workflow faz a rodada à mão, com as mesmas lentes e o mesmo veredito.

## O que isto não é

Não é revisão de estilo nem verificação de implementação. O alvo é o raciocínio: a ponte entre o que foi
medido e o que foi concluído. Na segunda forma, o código é o terreno; o que se julga é cada achado.
