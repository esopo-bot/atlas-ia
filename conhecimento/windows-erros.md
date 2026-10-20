# Erros no Windows: causa e conserto

Leia depois de um erro de shell. Vale para o Claude Code, o Copilot e o Devin
no Git Bash; não vale para o Codex, que usa PowerShell. Linha nova só depois
de 3 ocorrências.

| erro | causa | conserto |
|---|---|---|
| `"C:/Program Files/Git/PID"`; `FINDSTR: Cannot open`; `ERROR: Invalid syntax.` no `reg`; `cmd /c` abre o prompt e a chamada não volta | o Git Bash troca argumento que começa com `/` por caminho | barra dobrada: `taskkill //PID <n> //T //F` (pelo número, nunca `//IM`), `findstr //i`, `reg query 'HKCU\Environment' //v X`, `cmd //c`; ou `MSYS_NO_PATHCONV=1` com barra simples, só no bash; nunca os dois. Argumento com mais de uma barra (`/aws/lambda/x`): só `MSYS_NO_PATHCONV=1`, porque `//aws/lambda/x` chega dobrado |
| `fatal: ambiguous argument 'origin\main;pasta\arq'`; `git grep '/texto'` não acha nada | o Git Bash também troca `a/b:c/d` (lista de caminhos) e padrão que começa com `/` antes de chamar o git | `MSYS_NO_PATHCONV=1` só nesse comando, com a pasta no formato do Windows: `MSYS_NO_PATHCONV=1 git -C C:/repo/x show "origin/main:pasta/arq"`; com ele, `git -C /c/repo/x` falha (`cannot change to`); no `docker run -v` também: `-v "$(cygpath -m <caminho>):/destino"` |
| `Get-ChildItem: command not found`; `` unexpected token `{' ``; `$null: ambiguous redirect` | sintaxe de PowerShell, e o shell é o Git Bash | `ls`, `cat`, `grep`; `$X`; `> /dev/null`; `if [ -e x ]; then ...; fi` |
| `ls: cannot access 'C:WindowsSystem32'` | a barra invertida fora de aspas some | `C:/Windows/System32` ou `/c/Windows/System32` |
| `cd: too many arguments` | `cd /d` é do `cmd` | `git -C /c/repo/x ...` |
| `gh: command not found` ou `node: command not found` (saída 127) | o programa falta, ou foi instalado depois que o app abriu | se o `.exe` existe, abra uma sessão nova ou reabra o app; se não, diga o que falta e siga |
| `\` ou `$` some de regex, caminho ou texto | a ferramenta Bash come uma de cada duas `\`; heredoc sem aspas expande | texto num arquivo, pela ferramenta de escrita; heredoc só com `<<'EOF'` |
| `git status` marcando `M` (modificado) e `git diff` vazio; `CRLF will be replaced by LF` ou `LF will be replaced by CRLF` | quem regravou o arquivo trocou o fim de linha | não normalize à mão: `git add <arquivo>` (o blob não muda) ou `git checkout -- <arquivo>`; confira com `git ls-files --eol <arquivo>` |
| `git grep 'texto$'` não acha no disco | o disco ainda está em CRLF | `git grep -e 'texto$' HEAD -- <arquivo>`; sai quando a pasta estiver em LF em toda máquina |
| acento trocado em `cmd //c dir`, `tasklist`, `findstr` | programa do Windows escreve na página 850 | `ls`, `ps`, `grep` ou as ferramentas de leitura |
| senha ou JSON recusado, com valor vindo do `aws` | o `aws` e o `tasklist` do Windows terminam a linha com CR | `\| tr -d '\r'` na saída |
| variável vazia na chamada seguinte | cada chamada é um processo novo | `X=1 comando` na mesma chamada |
| a sessão do app passou a outra pasta depois de um `cd` | sem a trava, o `cd` para dentro das pastas da sessão persiste e leva a sessão junto | `git -C <pasta>`; `cd` só dentro de `( ... )`; a trava `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR=1` no `env` do settings devolve a pasta depois de cada comando |
