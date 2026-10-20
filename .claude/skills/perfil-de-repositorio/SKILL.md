---
name: perfil-de-repositorio
description: Indexa os repositórios do workspace e escreve o perfil destilado de cada um em meu/wiki/. Use para indexar projetos, criar ou atualizar o perfil de um repositório, ou depois de mudança grande num projeto ("indexa os projetos", "esse projeto mudou, atualiza"). Buscar código que já existe é da busca-de-codigo-existente.
context: fork
agent: general-purpose
---

# Perfil de repositório

A wiki é um perfil por repositório e um mapa do conjunto, em `meu/wiki/`, fora do git. Ela é incremental: o
índice diz o que mudou, e só o que mudou se lê.

## As três leis

1. **Índice antes de abrir repositório.** O estado mora em `meu/wiki/indice.json`.
2. **Um repositório por vez.** Leia, destile, grave o perfil e só então passe ao próximo.
3. **No máximo 3 perfis completos por rodada.** O resto fica `"pendente": true` e abre a rodada seguinte.

## O índice

Não existe, ou tem `versao_do_template` menor que 2: crie ou migre nesta forma, uma entrada por repositório.

```json
{
  "versao_do_template": 2,
  "repositorios": {
    "nome-do-repo": {
      "sha_indexado": "a1b2c3d", "data": "AAAA-MM-DD", "tipo": "infraestrutura",
      "tipo_declarado_pelo_dono": false, "arquivos_chave": ["README.md", "variables.tf"],
      "versao_do_template": 2, "pendente": false
    }
  }
}
```

## A rodada

1. Leia o índice.
2. **A lista sai do `.git`, não do `git -C`.** Pasta comum dentro de `meu/projetos/` não tem repositório, e o
   `git -C` sobe a árvore e responde com o SHA do atlas. No Git Bash:
   `find <pasta> -mindepth 2 -maxdepth 2 -name .git -printf '%h\n' | sort`
3. **Triagem sem abrir arquivo.** Para cada um, `git -C <repo> rev-parse --short HEAD`:
   - SHA igual e template atual: **pula**.
   - SHA mudou, mas `git -C <repo> diff --name-only <sha_indexado>..HEAD -- <arquivos_chave>` vem vazio:
     **leve**. Atualize SHA e data; o perfil fica. Não conta no teto.
   - Diff toca arquivo-chave, repositório novo ou template antigo: **perfilar** (conta no teto de 3).
4. **Relate a triagem antes de varrer:** "N em dia, N leves, N a perfilar, N pendentes".
5. Para cada um do lote: tipe e perfile na profundidade do tipo, por `references/tipos-de-perfil.md`.
   Gravou o perfil, atualize a entrada no índice e esqueça o repositório.
6. Regenere o mapa (`meu/wiki/LEIAME.md`, 1 a 3 linhas por repositório).

## O que não muda

- Tipo declarado pelo dono (`tipo_declarado_pelo_dono: true`) nunca é reclassificado.
- **A seção `## Declarado pelo dono` nunca é reescrita.** Ela guarda o que só o dono sabe: de que branch nasce a de
  trabalho, para onde vai a entrega, quem empurra, quem aprova e as branches permanentes. Ao regenerar, copie-a
  inteira para o perfil novo.
- **Perfil guarda o durável; nota guarda o volátil.** Formato de registro, permissão e endereço de ambiente
  mudam toda semana: moram numa nota em `conhecimento/` dele, não no perfil.
- Sem âncora clara, o tipo é **indefinido**: uma linha no mapa e uma pergunta ao dono.
- Repositório de infraestrutura não recebe varredura de código: o perfil é o contrato.
- **Atualize só o lote, um por vez:** `git -C <repo> pull --ff-only` antes de perfilar. Fora do lote, nada de
  fetch (`regras/rede.md`). Rede falhou: perfile o clone como está e grave `"clone_atras": true`.
- O sinal de mudança é o SHA do git, nunca data ou mtime. O cabeçalho do perfil é o SHA e a data do que foi
  destilado; editar o corpo à mão não o muda.
- Conteúdo da wiki é privado do workspace. Nunca vai para repositório público, nem em exemplo.

## Quando roda à parte

No Claude Code, esta skill roda num subagente, sem a conversa de quem pediu. O pedido chega na linha
`ARGUMENTS:` e diz a pasta dos repositórios e, se for um só, qual. A triagem e as perguntas sobre tipo
indefinido voltam no relatório final: quem fala com o dono é quem pediu.
