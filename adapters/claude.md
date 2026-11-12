# Adaptador: Claude Code

Para esta sessão, leia `CLAUDE.md`, `AGENTS.md` e somente as regras e artefatos que a tarefa toca. O `CLAUDE.md`
aponta para a política comum; regras específicas do projeto continuam no repositório do projeto.

A entrada portátil desta camada é anexo, checkout somente leitura ou referência aprovada fornecida à sessão. Em local
ou nuvem, leia essa revisão explicitamente antes de projetar regra no projeto alvo; sem entrada aprovada, pare e
peça a referência. Não dependa de caminho fixo, clone automático, link simbólico ou estado privado. A exceção
nomeada é o `meu/` do dono (`.claude/rules/meu.md`): o gancho `meu.mjs indice` o põe no contexto quando existe (na
nuvem, o preparo do ambiente, com o repositório `meu` anexado), e sem ele tudo segue.

Comece Planejar e Projetar em descoberta de leitura. Para tarefa material, confirme a fonte de verdade e os artefatos
`intent.md`, `spec.md` e `plan.md` antes de Construir. Trabalhe em worktree e branch da tarefa; coordene conflito
compartilhado no artefato, não por estado global.

Use hook e permissões nativos para controles determinísticos. Não trate instrução, skill, comentário de revisão ou
automação como aprovação humana. Use uma skill oficial somente quando seu escopo especializado corresponder à tarefa;
ela não substitui `AGENTS.md`, testes, CI ou revisão.

Ao levar a camada a outro projeto, preserve o `CLAUDE.md` dele e registre somente a regra revisada que o projeto
precisa. Não crie link simbólico, não copie configuração local e não presuma que estado privado esteja disponível.
