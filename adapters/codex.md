# Adaptador: Codex

Leia todos os `AGENTS.md` aplicáveis, da raiz até a tarefa; o mais específico resolve conflito. Leia instruções
adicionais somente quando o escopo as exigir; mantenha a orientação curta, contextual e sem duplicar configuração
privada.

A entrada portátil desta camada é anexo, checkout somente leitura ou referência aprovada fornecida à sessão. Se ela
não estiver na árvore do projeto alvo, leia a revisão explicitamente antes da política local. Sem entrada aprovada,
pare e peça a referência; não procure estado privado nem faça clone automático. A exceção nomeada é o `meu/` do
dono (`.claude/rules/meu.md`): ao começar, leia `<raiz>/meu/LEIAME.md`, na pasta principal do atlas, quando existir;
na nuvem, o `LEIAME.md` do repositório `meu` do ambiente. Sem ele, tudo segue.

Antes de editar, encontre a fonte de verdade, os critérios e a prova. Em tarefa material, siga `intent.md`, `spec.md`
e `plan.md` ou seus equivalentes declarados. Prove o resultado com saída observada, registre o que não foi medido e
entregue pelo fluxo do repositório.

Cada sessão trabalha na própria branch e worktree. Paralelize apenas tarefas sem recurso ou decisão compartilhados.
Use skill oficial da OpenAI ou do fornecedor somente para procedimento especializado e verificável; o Atlas não cria
skill genérica nem torna uma skill externa confiável por ela ser descoberta.

No projeto alvo, `AGENTS.md` local prevalece para arquitetura, comandos, ambientes e fluxo. Não escreva nomes,
credenciais, caminhos de máquina ou estado pessoal na política versionada.
