# destino

Ao encerrar, prove em cada repositório tocado que todo commit está mesclado ou em PR aberto.

- A prova é comando, não memória. Em cada repositório tocado, inclusive em `meu/projetos/<nome>`:
  `git -C <pasta> status --porcelain` e `git -C <pasta> log HEAD --not --remotes --oneline`. Vazio é a prova.
- Commit em branch que ninguém vai incorporar não tem destino, mesmo empurrado: some quando a branch for podada.
- Destino inclui o passo seguinte: se o caminho é PR, ele fica aberto, não planejado para depois.
- Ou vai, ou é descartado, com a razão em uma linha. Não há terceiro estado.
- A prova é passo do encerramento, não lembrança. Com entrega pendente, fale primeiro, antes do assunto seguinte.
- O destino que você dá é o do que você sujou. Sujeira que já estava na árvore, ou de outra sessão, não se commita
  nem se apaga: relate ao dono, arquivo por arquivo, sem travar a entrega. Vale para binário ou despejo solto.
- Branch e commit de outra sessão na mesma árvore: relate nome, autor e hora, e deixe. Meça na hora de escrever.
- Com outra sessão viva na mesma árvore, não rode `checkout`, `switch`, `reset` nem `stash` nela: eles mexem no que é
  dela. Frente própria vai em `git worktree add`.
