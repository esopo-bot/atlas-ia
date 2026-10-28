# Selecionar fluxo

Você recebeu uma revisão do Atlas por anexo, checkout somente leitura ou referência aprovada. Leia `AGENTS.md`, a fonte
de verdade da tarefa e somente as instruções do projeto que o escopo exige. Sem revisão aprovada, peça a referência;
não procure estado privado além do `meu/` (`.claude/rules/meu.md`), não faça clone automático e não instale nada.

Escolha e leia um ou mais fluxos: `fluxos/triagem.md` para prioridade, dependência ou prontidão; `fluxos/conhecimento.md`
para decisão, pesquisa, incidente ou lição; `fluxos/teste-e-seguranca.md` para código, configuração, fronteira ou
escrita externa. Declare na fonte de verdade qual fluxo usou, a decisão resultante, a prova e o próximo portão.

Quando a tarefa pedir pesquisa, leia também `prompts/pesquisar-fonte-externa.md` antes de usar a fonte. Quando pedir
uma skill oficial ou externa, leia `prompts/avaliar-skill-externa.md` e pare antes de instalar, habilitar ou copiar.
Quando pedir relação, escolha, dependência ou explicação visual, leia também `prompts/consultar-mapa.md`. Esses
prompts podem acompanhar os fluxos acima, mas não substituem a fonte de verdade nem a prova.

Quando G4 ou G6 exigir recibo, leia também `prompts/verificar-recibo.md`. Ele confere um recibo já produzido contra o
SHA esperado; não cria revisão, não ativa esteira e não libera merge.

Não crie skill caseira, diário global ou arquivo ritual para tarefa pequena. Se houver dúvida material de escopo,
acesso ou risco, registre a pergunta exata e pare antes da escrita. Quando a tarefa estiver pronta, siga o ciclo de
entrega e o adaptador do ambiente da sessão.
