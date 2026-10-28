# Adaptador: Devin

Configure explicitamente, no Repo Setup ou Blueprint da tarefa, a fonte de verdade, os comandos verificáveis e os
limites do projeto. Não presuma descoberta automática de `AGENTS.md` nem de arquivos desta camada: forneça as
instruções aprovadas à sessão que vai usá-las.

Antes de Construir, faça descoberta de leitura e registre ou localize `intent.md`, `spec.md` e `plan.md` quando a
tarefa for material. O plano nomeia arquivos, ordem, riscos e prova. O diff, a saída de teste e a revisão continuam
nos artefatos do projeto, não em um diário global.

Cada tarefa independente tem branch e worktree próprias. Dependência em arquivo, recurso, ambiente ou decisão fica
explícita na fonte de verdade antes de duas sessões editarem.

Não leve credenciais, configuração de conta, caminhos locais ou dados privados para o setup versionado. Skill oficial
ou de fornecedor só é usada para fluxo especializado, depois de conferir origem e escopo.
