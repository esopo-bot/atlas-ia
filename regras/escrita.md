# escrita

Conclusão primeiro, frases curtas, um conceito por vez. Com o dono, vale o `PERFIL.md`.

Issue do atlas ou de projeto do dono (teto `issue` do perfil; moldes na skill `trabalho-por-issue`):

- Issue é estado, não diário: objetivo, critérios de fechamento, estado, próximo passo e as decisões do dono em
  vigor. O que deixou de valer sai do corpo; o histórico de edição do GitHub guarda o resto.
- Sem prosa: campo de uma linha, lista curta, tabela, `mermaid`. Frase só onde a tabela não diz. No teto, linha de
  tabela conta 1 e desenho não conta (`conta_issue`, skill `jeito-de-falar`); `<details>` não esconde excesso.
- Critério de fechamento sempre alcançável, com a prova ao lado (comando e linha que decide) ou o fato que se
  observa. A forma do OpenSpec (Dado, Quando, Então) vale. Critério que só o dono cumpre diz isso. Critério que
  espera dia futuro, tráfego real ou caso raro não é alcançável: monte o caso com dado sintético no ambiente de
  teste e feche agora; acompanhar produção depois da entrega é monitoramento, não critério.
- Recorrente (fila, rodadas, quadro que não fecha): título `[RECORRENTE] <projeto> - <assunto>`, etiqueta
  `recorrente`, o corpo e no máximo um comentário. Novidade reescreve o corpo ou esse comentário; comentário novo,
  nunca.
- Não recorrente: o corpo e poucos comentários até fechar, só pergunta que pede resposta do dono e o relato do
  fechamento. Andamento vai no corpo.
- Comentário sem prosa: lista curta ou tabela. Resposta do dono vira linha em Decisões, com a data, e a pergunta
  sai do corpo. Comentário superado se esconde como `Outdated` (skill `trabalho-por-issue`); apagar é do dono.
- Quem explica o trabalho ao dono é o PR para a `main`: ele sim é trabalhado, no teto `pr` do perfil.
- Confere, sai vazio: `gh api 'repos/<issues>/issues?state=open&labels=recorrente'
  --jq '.[] | select(.title | startswith("[RECORRENTE]") | not) | .number'`.

Daqui para baixo, o que vale para texto que não é conversa com o dono: página, issue de outro projeto, nome de peça.

- Escreva na língua de quem vai ler. No atlas, pt-BR; em repositório de outro projeto, a língua e o formato de lá.
- Página de `conhecimento/` é por assunto e densa: o máximo de informação útil por página. Página que obriga a abrir
  outras três para entender uma está mal cortada.
- Conhecimento não nasce em pasta de código: vai para onde mandam a regra `memoria` e a skill `colheita`.
- A altura da explicação é por assunto, não por pessoa. Suba quando o domínio aparecer e pare de explicar o básico.
- Explicar mais é ser mais claro, não mais longo. Corte o que não muda a decisão de quem lê.
- Número em página: com o comando que o produz; fora do git do atlas, se for marco, também a data (regra `memoria`).
- Arquivo do atlas é instrução: sem data de histórico, número de decisão ou de fase, relato de tropeço nem prova
  datada; o histórico fica no `git log`. Fica a `versão:` do `PERFIL.md`, a data em código ou em bloco de código e o
  conteúdo de estudo do `conhecimento/caderno/` (dele sai só o marcador de histórico). Confere, da raiz: saem vazios
  `git grep -nE '\bD-[0-9]{3}\b|E-D-[0-9]+|\bS[0-9]+-[0-9]+|(Ú|U)ltimo trope(ç|c)o|dono, 20[0-9]{2}'` e
  `git grep -nE '\b[Ff]ase [0-9]\b|Script 0[0-9]' -- ':!conhecimento/caderno'`; cada data de
  `git grep -nE '20[0-9]{2}-[0-9]{2}-[0-9]{2}' -- '*.md' '*.txt' '*.sh' .gitignore` é uma dessas exceções.
- Nome de peça: não invente jargão, sinônimo novo para o que já tem nome nem termo em outra língua quando existe o
  daqui. Renomear em massa custa mais que o nome errado que sobrou num canto.
- Markdown passa no `markdownlint` (`.markdownlint.jsonc`).
