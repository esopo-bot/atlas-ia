# Adaptador: Copilot VS Code

Use o `AGENTS.md` do projeto como núcleo comum. Quando o ambiente exigir instrução nativa adicional, projete somente
a regra aplicável em `.github/copilot-instructions.md` ou em uma instrução com escopo de caminho; não crie cópia
conflitante nem misture política de outro projeto.

Leia a fonte de verdade e os artefatos da tarefa antes de mudar código. Para trabalho material, mantenha a cadeia
`intent.md`, `spec.md`, `plan.md`, diff com prova e pull request com revisão. Pequena mudança pode usar os campos
equivalentes na issue declarada pelo projeto.

Trabalhe em branch e worktree da tarefa. Recurso, arquivo ou decisão compartilhados exigem dependência explícita ou
uma única sessão. Configurações do editor, contas, extensões e caminhos locais não entram na camada versionada.

Skill oficial só entra quando resolver um procedimento especializado e seu escopo for conferido. A prova continua em
teste, build, revisão e CI do projeto.
