# Tipos de repositório: sinais, profundidade e moldes

Classifique em cascata, do sinal mais barato ao mais caro, e pare no primeiro que decide. Fora da conta:
`node_modules/`, `vendor/`, `dist/`, `build/`, `.terraform/`, `coverage/`, `*.min.*` e lockfiles.

## Sinais

Procure as âncoras com `git -C <repo> ls-files`, sem abrir arquivo. A primeira linha que casar decide.

| Âncora (de cima para baixo) | Tipo | Perfil |
| --- | --- | --- |
| `*.tf` na raiz ou em `modules/`, `Chart.yaml`, `terragrunt.hcl`, `docker-compose.*`, `compose.yaml`, `kustomization.yaml`, `ansible.cfg` | infraestrutura | curto, ~40 linhas |
| `dbt_project.yml`, `dags/`, muitos `*.ipynb` | dados | médio, ~70 linhas |
| `pubspec.yaml`, `*.xcodeproj`, gradle de app, `app.json` | mobile | médio, ~70 linhas |
| `next.config.*`, `angular.json`, `vite.config.*`, `nuxt.*` | frontend/ui | médio, ~70 linhas |
| Dockerfile com framework de servidor, pasta de rotas, `openapi.*` | api/serviço | cheio, ~120 linhas |
| manifesto de publicação sem servidor (`exports`, `*.nuspec`) | biblioteca | médio, ~70 linhas |
| `project.godot`, `*.uproject`, `Assets/` com `ProjectSettings/` | jogo | médio, ~70 linhas |
| `dados/` ou `entregas/` com relatório, sem manifesto de código na raiz | dossiê de caso | médio, ~70 linhas |
| nenhuma âncora casou | indefinido | 1 linha no mapa e uma pergunta |

Repositório misto: registre o tipo principal e cite o secundário no perfil.

## Arquivos-chave por tipo (vão para o índice)

- **infraestrutura:** `README.md`, `variables.tf`, `outputs.tf`, `versions.tf`, `Chart.yaml`, `values.yaml`,
  `terragrunt.hcl`
- **api/serviço:** `README.md`, manifesto de dependências, pastas de rotas ou controllers, contratos
  (`openapi.*`, DTOs), configuração de build
- **frontend/ui:** `README.md`, manifesto, configuração de build, pasta de rotas ou páginas
- **jogo:** `README.md`, arquivo de projeto do motor, pastas de cenas e de recursos, como se roda no aparelho
- **dossiê de caso:** `README.md`, pasta de dados brutos, pasta de entregas e o relatório mais recente. O
  perfil diz onde os dados entram, o que já foi entregue e o que espera resposta. Cuidado: a pasta de dados
  brutos pode ser junção apontando para fora do repositório, e a varredura sai da pasta sem avisar.
- **demais:** `README.md` e manifesto de dependências

## Perfil cheio (api/serviço)

```markdown
# <nome do repositório>

Atualizado em <data>, commit <sha>. Perfil destilado: o código é a verdade.

## O que é
<uma frase: o papel deste repositório no conjunto>

## Stack e padrões
<linguagem, framework, pastas, convenções de nome, como roda, como testa: o que uma aplicação nova imitaria>

## O que oferece
<serviços, helpers, contratos, endpoints, cada um com o caminho onde vive>

## Como conversa com os vizinhos
<quem chama, quem é chamado, contratos compartilhados: só o que você VIU>

## Armadilhas
<o que parece mas não é; o que quebra fácil; decisões com motivo>

## Esteira
<o que o push em cada branch aciona; cada portão: o que cobre, o que não cobre e se a proteção o exige;
onde moram o deploy e a reversão. A base e quem empurra ficam em `## Declarado pelo dono`>
```

O perfil médio usa as mesmas seções, na metade do tamanho: rotas e componentes principais em vez de
inventário completo.

## Perfil de infraestrutura: o contrato

Nunca varra `templates/` nem leia HCL arquivo a arquivo; nunca rode `terraform init` ou `plan` para
documentar (exige credencial).

1. Com `terraform-docs`: `terraform-docs markdown table --recursive .` e destile. Para charts,
   `helm-docs --dry-run`.
2. Sem a ferramenta, leia só a lista fechada dos arquivos-chave e use `grep -c '^resource'` para o tamanho.

```markdown
# <nome do repositório>

Atualizado em <data>, commit <sha>. Perfil de infraestrutura: o contrato.

## O que provisiona
<recursos e providers, em linhas>

## Onde se aplica
<ambientes e regiões pela árvore de pastas, até 3 níveis>

## Entradas e saídas
<inputs com defaults e outputs, referenciados, nunca copiados à mão>

## Dependências e como se aplica
<módulos que consome; pipeline ou manual; onde vive o estado>
```
