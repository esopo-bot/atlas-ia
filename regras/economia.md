# economia

Busca dirigida antes de varrer. Teste direto antes de pesquisa; cético só onde importa.

- Pergunta que um comando ou canário responde em minutos: rode o teste antes de pesquisar. Se o teste e a
  documentação discordam, vale o teste.
- Cético (agente que tenta derrubar o achado) só onde importa: decisão difícil de desfazer (apagar, publicar, regra
  do servidor), fase grande ou desenho de várias peças, produção, segurança, segredo, dinheiro e achado que vira
  regra. Fora disso, uma verificação direta basta, mesmo com o modo de muitos agentes ligado.
- Repositório grande não se varre inteiro: índice, `LEIAME` e busca dirigida primeiro. Identifique a linguagem pelo
  manifesto e leia os pontos de entrada antes do resto.
- Busque só no repositório da tarefa. Nos outros, só ao criar peça nova: escolha pelo mapa `meu/wiki/` ou pelo nome
  das pastas, no máximo 2 candidatos, e use `git -C <repo> grep`. Nada de `fetch` no vizinho nem `grep -r` da raiz.
- A busca do agente honra o `.gitignore` (o Glob do Claude Code, só com `CLAUDE_CODE_GLOB_NO_IGNORE=false` no
  settings) e responde menos do que existe: o zero dela é falso negativo. Para decidir, confirme com
  `command grep -r --exclude-dir=node_modules --exclude-dir=bin --exclude-dir=obj` (pasta de build trava o `grep`).
- Subagente e workflow só quando a tarefa não cabe numa conversa (reconhecimento amplo, dezenas de itens em
  paralelo). Antes de disparar, diga ao dono quanto deve levar. Conserto de um item se faz direto. Paralelismo que o
  dono já autorizou não se pergunta de novo na sessão. Subtarefa leva objetivo, contexto e limites, e se sustenta
  sozinha.
- Linha nova no `AGENTS.md` ou em `regras/` só entra com um caso em `bateria/casos.mjs`, lista `CASOS`;
  sem caso, vai ao Talvez da issue recorrente de melhorias do atlas (`gh issue list -R <issues> --label recorrente
  --search "melhorias in:title"`).
- Achado que não quebra correção nem requisito vai direto ao Talvez da issue recorrente de melhorias do atlas (uma
  linha da tabela do corpo), sem pergunta ao dono.
- Defeito que quebra correção ou requisito, fora do pedido, não se conserta: vira issue comum, com a etiqueta
  `defeito`, em `<issues>`. Antes, procure uma aberta do mesmo assunto; achou, ponha no corpo dela.
  Nunca linha numa issue que não fecha.
- Pedido pequeno do dono, feito na hora, não abre issue: o commit é o registro.
- Uma issue pode juntar entregas que a mesma bateria de provas cobre; cada entrega é um critério com a prova dele.
- Teto do atlas: até 70 arquivos e 600 KB no git; fora de `conhecimento/caderno/`, nada acima de 400 linhas. Mede:
  `git -C <raiz> ls-tree -r HEAD | wc -l`;
  `git -C <raiz> ls-tree -r -l HEAD | awk '{s+=$4} END {print s}'`;
  `git -C <raiz> grep -c '' HEAD -- ':!conhecimento/caderno' | awk -F: '$NF > 400'` (vazio é o esperado).
- Como abrir, retomar, relatar e fechar: skill `trabalho-por-issue`.
