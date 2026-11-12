# Escrever pedido

Você é a orquestradora de `fluxos/pedidos.md`: passa um trabalho a outra conta ou agente por uma issue. Leia a fonte
de verdade do projeto (a issue, o critério, as decisões), a configuração dos pedidos do dono e a tabela de despacho
dela. Sem configuração, com o interruptor pausado, sem critério com prova ou com pergunta que só o dono responde, não
escreva: a pergunta vai à issue do projeto e você para.

Escreva o corpo num arquivo fora do repositório, no molde do fluxo, com tudo o que a executora não acha sozinha.
`node <atlas>/recibos/validar-pedido.mjs corpo <config> <arquivo>` tem de dizer "corpo válido". Abra a issue em
`<issues>` com o título `<projeto> - pedido: <o que muda>`, as etiquetas do projeto e `pedido`; numa segunda chamada,
`executar:<executora>`. Registre o link do pedido e o despacho na fonte de verdade do projeto.

Na volta, com a issue em `<issue.json>` e os comentários em `<comentarios.json>` (lidos pela API),
`node <atlas>/recibos/validar-pedido.mjs entrega <config> <issue.json> <comentarios.json> <executora>` confere a forma;
a prova de cada critério você verifica na branch, rodando o teste. Aceite, devolva ou responda como o fluxo diz e
grave a decisão. O validador só lê: não chama rede, não ecoa o corpo e não aprova nada por você.

As regras de prazo, critérios, vez, recebimento e recusa estão em `fluxos/pedidos.md`.
