# CLAUDE.local.md: o que é desta máquina

Copie para `CLAUDE.local.md` na raiz do atlas (fora do git) e preencha. O Claude Code o carrega sozinho. O
`AGENTS.md` usa os nomes pelos marcadores entre `<>`; o `AGENTS.md` de um projeto redefine o `fluxo` dele com os
mesmos campos. Na nuvem ele não existe: vale o `AGENTS.md` do projeto, e `<issues>` é o `origin` do atlas.

Para o atlas valer também fora da pasta dele, o `~/.claude/CLAUDE.md` da máquina importa cinco linhas:
`@<raiz>/AGENTS.md`, `@<raiz>/.claude/rules/communication.md`, `@<raiz>/.claude/rules/environments.md`,
`@<raiz>/.claude/rules/meu.md` e `@<raiz>/CLAUDE.local.md`.

## Nomes

- issues: `dono/nome`
- dono: `login`
- automação: `login da conta que empurra e abre PR` (vazio: a conta da máquina)
- token: `NOME_DA_VARIAVEL com o token dela`
- raiz: `caminho da pasta do atlas`

## Produção

- producao: `conta`, `região`, `endereço` (o agente trata como produção tudo que citar um deles)
- producao-liberada: `projeto-a`, `projeto-b (sem-aprovacao)` (onde a sessão vai até produção, pelas regras de
  `environments.md`; `(sem-aprovacao)` mescla com os checks no lugar da aprovação do dono)

## Fluxo

O padrão desta máquina; o `AGENTS.md` do projeto vale sobre ele.

- base: `main` (de onde nasce a branch de trabalho: `develop`, `homolog`...)
- branch: `claude/<tarefa>` (nome da branch de trabalho: `feature/<tarefa>`...)
- ate-onde: `merge` (branch | esteira | integracao | pr | merge)
- esteira: `Action esteira-da-rotina, inputs branch/titulo/corpo` (o que aciona a integração, ou vazio)
- integracao: `homolog` (a branch de integração, ou vazio)
- pr-para: `main`
- revisor: `login`

Exemplo de lugar com esteira própria: `base: develop`, `branch: feature/<tarefa>`, `ate-onde: esteira`,
`esteira: push da branch feature/* aciona`, `pr-para:` vazio. Ali o agente abre a branch, entrega nela e para.
