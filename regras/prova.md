# prova

Só diga "pronto" com a saída colada de um comando: teste, build ou listagem.

- "O modelo disse" não é prova. Saída colada de outra sessão é citação, não prova.
- A saída se cola do terminal, nunca se redige.
- Fluxo que ninguém executou nem tem fonte citada é hipótese, e se grava marcado como hipótese.
- Achado de leitura, sem instrumento rodado, entra como hipótese, com o comando que a decide. Vira defeito só depois
  que o instrumento reproduziu.
- Resultado negativo pede contraprova: zero, vazio e "sem permissão" só valem quando o mesmo instrumento, na mesma
  janela, acha alguma coisa. Sem isso, escreva "não medido", nunca "não existe".
- A prova morre com a escrita seguinte: meça depois do último comando que altera o disco.
- Prova que outro vai repetir ancora em SHA (`git rev-parse HEAD`), nunca em `HEAD` ou `origin/<branch>`, que andam,
  e não traz contagem que cresce nem número de linha que a próxima edição muda.
- Estado que se relata se lê na hora: antes de dizer o que falta numa issue, num PR ou num arquivo, abra e leia.
- Prova feita num ambiente não vale noutro. Proposta que depende de ferramenta (pacote, container, servidor MCP)
  vem com o comando de uma linha que quem recebe roda no ambiente dele antes, e com o contorno, se já conhecido.
  Ambiente trancado é comum: proxy que reassina TLS, política que barra comando, registro de pacote bloqueado.
- Tela ou endpoint que mostra coleção se prova com o tamanho do maior caso de produção, contado antes no banco (só
  leitura) e montado com dado sintético no ambiente de teste; a conta de teste pequena não vale. A prova fecha na
  entrega, sem medida agendada para depois.
- Antes de agir sobre conclusão importante, rode a skill `verificacao-adversarial`.
