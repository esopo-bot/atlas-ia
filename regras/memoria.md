# memoria

O que vale amanhã vai para `conhecimento/`, com o comando que mede. O estado fica no corpo da issue. O que não é do
atlas vai para `meu/`, fora do git.

- Número medido: guarde o comando que o produz, não o valor. Fora do git do atlas (`meu/`, outro repositório,
  issue), o valor pode ficar como marco, com a data e o comando ao lado, nunca como se fosse o de hoje.
- Número que precisa ser cobrado vira checagem que reprova sozinha, não parágrafo.
- Com issue, o estado mora nela, e a linha do `~/atlas-diario/agora.md` é só índice (próximo passo e link), no
  formato da skill jeito-de-falar. Sem issue, a linha basta. Outro arquivo de andamento vira segunda verdade. No fim, o
  que vale adiante sai da issue para `conhecimento/`.
- `conhecimento/`: um lugar por assunto; um nível de subpasta, cada uma com `LEIAME.md`. Exceção: assunto com várias
  páginas ganha subpasta própria, com `LEIAME.md` de entrada. Nome minúsculo, sem acento nem espaço.
  O índice é `conhecimento/LEIAME.md`: página nova ganha uma linha nele, com "abra quando".
- `meu/projetos/`: uma pasta por repositório clonado, com o nome dele, e nada mais. `ls meu/projetos/` é a lista.
  Repositório somente leitura não recebe escrita.
- Memória nativa do agente (auto memory do Claude Code, `~/.codex/memories`, `/memories/` do VS Code, Copilot Memory)
  é lembrança, não regra. Não guarda o que o atlas já diz, segredo nem o que se lê no código ou no git. Regra que
  precisa valer sempre vira proposta de linha no atlas. Fato guardado leva de onde se confere. Memória que contradiz
  o atlas: avise o dono.
- Raiz: só o atlas. O que é do dono mora em `meu/`, fora do git; rascunho e gerado, em `meu/tmp/`.
  Pasta nasce quando o material cansa a leitura, não antes.
- Reorganizar: liste antes de mover; mova com `git mv` e corrija os links. Destino ocupado vira pergunta. Anotação
  do dono não se toca. Apagar é do dono: proponha a lista, com a razão de cada item.
