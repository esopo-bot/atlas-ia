---
name: portao
description: Conferência antes de tornar algo público ou copiar um arquivo do atlas para fora dele. Use quando o pedido for publicar, abrir um repositório, escolher o que copiar ou perguntar "isso pode sair daqui?".
---

# Portão

Só vale na saída: tornar algo público ou copiar um arquivo para fora do atlas. Mudança comum no atlas não passa por
aqui.
Publicar é do dono (`regras/o-que-e-do-dono.md`): a lista prepara o sim dele, não o substitui.

## Antes de sair

1. **Histórico.** Repositório que vira público expõe todos os commits, issues e PRs, não só o estado de hoje.
   Cópia para fora é à mão, arquivo por arquivo, cada um conferido por esta lista. A CI (`.github/workflows/`)
   fica: é do dono e cita contas pelo nome.
2. **Nomes e caminhos.** Tire nome de pessoa, organização, projeto, máquina, conta, caminho e produto interno: no
   texto, no nome de arquivo e de pasta, na branch e na mensagem de commit. Se perde o sentido, era caso
   particular: fica.
3. **Segredo.** Nenhum valor de credencial, token, endereço interno ou nome de ambiente. Exemplo de
   configuração leva `${NOME}` (`regras/segredo.md`).
4. **Texto de terceiro.** Entra em resumo, com o link da fonte, nunca em cópia.

## O teste de origem

> Quem lê isto saberia de que projeto ou equipe veio?

Se sabe, é particular, por mais anônimo que esteja: cadência de entrega, quem aprova, nome das etapas, política de
branch. Não sai.

## Na dúvida

Fica. Diga ao dono o que ficou de fora e por quê.
