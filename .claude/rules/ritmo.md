# Ritmo: pacote, prova e notícia

versão: 2026-11-10-a
Vale para toda sessão, thread, subagente e rotina, em qualquer repositório. Em conflito com outra regra do atlas, vale
esta, salvo o que é só do dono (`AGENTS.md`) e a proteção de branch de cada repositório.

## Trabalho

1. Sem objetivo verificável, não comece: pergunte na leva (item 6). Rotina para e relata; não inventa trabalho.
2. Issue nova, não. O que surge vira critério, com a prova ao lado, da issue aberta mais próxima: a do pacote em curso,
   a do mesmo assunto ou a recorrente do projeto. Nada cabe: pergunta na leva; rotina segue o roteiro dela. A
   exceção é o pedido de `fluxos/pedidos.md`: uma issue por pedido, que a orquestradora abre e fecha.
3. Um pacote, uma branch, uma esteira, um PR. Durante, só o teste do arquivo tocado; a suíte roda uma vez, antes do
   push. Caiu: conserte e rode de novo só o que caiu.
4. Rápido e testado, sem desperdício. Paralelismo que encurta o relógio pode. Não pode: revisão repetida, revisor em
   cascata, workflow de vários agentes (nem com o modo que o liga por padrão; só se o dono pedir na tarefa), suíte mais
   de uma vez por pacote, teste do que não mudou.
5. Nenhum comentário em código, em nenhuma linguagem, no que se escreve ou se toca (`code-style.md`).
6. Perguntas e permissões numa leva só, no começo: tudo o que a tarefa vai pedir, de uma vez. Depois, nenhuma que o
   recomendado resolva.
7. Decisão técnica é da sessão, pelo recomendado, dita ao dono numa linha. Ao dono vai só o pessoal (dinheiro, contas,
   credenciais, contratos, contato com terceiros) e o que o `AGENTS.md` diz que é só dele. Decisão que gasta dinheiro,
   antiga ou tomada em lote, volta ao dono numa frase, com o custo, antes do primeiro gasto.

## O dono não roda comando

8. IAM, SQL, apply e deploy vão pela esteira ou pela nuvem. Sem caminho automático, a falta vira critério ligado ao
   workflow que falta. Ao dono vai primeiro o clique exato, quando a página faz o mesmo; o comando inteiro, colável,
   uma vez, que para no erro, com o que ele deve ver no fim, só no que só a credencial dele faz. Script num arquivo
   para ele rodar, nunca. A ordem não joga trabalho nele: apply antes do merge.
9. Esteira parada pela conta (cobrança, limite, permissão da plataforma): dito na hora, "só você resolve", com o link
   da página que resolve.

## Notícia

10. Estado só com prova: "rodando", "verde" e "em produção" só com o link do run ou do deploy, lido agora.
    "Homologado", "no ar" e "funciona", de tela ou de rota, só com a prova do item 18: deploy verde não é nenhum deles.
11. Com esteira ou deploy pendente, notícia a cada 15 minutos no máximo, só com mudança de estado; sem mudança, uma
    linha: "sem mudança, run <link>". Esteira caiu: aviso na hora, com o link e o conserto.
12. Pouco texto: conclusão na primeira linha e só o que o dono precisa saber ou fazer.
13. O que é do dono chega no chat (na rotina, em "Pendente com o dono" da issue), nunca só na issue: o link, a decisão
    recomendada, o texto pronto para colar ou o clique exato, e o que ele deve ver no fim.
14. PR que o dono aprovou não volta a ele por commit novo: mescle com a aprovação que vale, se a proteção aceitar. A
    proteção derrubou a aprovação: aviso uma vez, com o link, sem explicação.

## Prova e fechamento

15. Nada de tempo passivo. Prova de produção se faz na hora: Playwright na tela e leitura dos logs, com a conta de
    teste. O que só o uso real mostra se prova agora com dado sintético (`AGENTS.md`); a medida real fica anotada para
    a rotina do dia seguinte, sem segurar a issue.
16. Todos os critérios atendidos em produção, conferidos contra a `main`: a sessão fecha a issue e avisa, sem
    perguntar. Critério aberto mantém a issue aberta. Critério que só terceiros resolvem vai à recorrente de pedidos do
    projeto, e a issue fecha.
17. Merge sem aprovação humana só onde o repositório o declara (`environments.md`). Nos outros, a proteção da `main`
    manda e não se contorna.
18. Homologar é abrir. Tela: aberta na integração, no estado final (dado ou vazio de verdade, sem erro), com a imagem
    no PR e no relato. Rota: chamada lá, com o status e o tempo colados. Suíte, esteira e deploy verdes não homologam.
    Sem homologar, não está pronto nem vai ao dono para aprovar: o PR fica em rascunho, "não homologado" no topo.
19. Camadas em ordem, cada uma provada antes da seguinte: banco, API, tela. Objeto novo de banco (tabela, coluna,
    função, procedure) a sessão aplica e confere no banco da integração antes do push do código que o usa; a tela só
    sobe com a rota respondendo lá. Nada vai à `main` para destravar a integração. No refino, antes do código,
    confira o caminho do DDL de produção que o `AGENTS.md` do projeto nomeia e se ele aceita o comando; sem caminho,
    isso vai ao dono ali. Em produção, o DDL entra antes do merge (item 8).
20. A prova não espera o dono: login, senha, clique ou comando dele não é passo de prova. Use a conta de teste ou o
    usuário sintético do projeto (o ambiente local serve). Sem nenhum, diga "tela não aberta": a tarefa fica aberta,
    e isso é bloqueio da sessão, não pendência dele.
21. Integração compartilhada: o PR da integração lista cada pacote que leva à produção, com a prova do item 18 e o
    DDL de cada um; quem leva um pacote a uma integração de PR aberto atualiza o corpo dele. Pacote sem prova sai da
    integração antes de o dono aprovar.
