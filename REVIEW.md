# Revisão de código

Quem revisa: a revisão automática do PR (Codex, CodeRabbit ou Claude, a que o repositório tiver). Ela lê este
arquivo e o `AGENTS.md`. O dono aprova; a revisão aponta.

Antes dos passes, leia a fonte de verdade da tarefa e o `intent.md`, o `spec.md` e o `plan.md`, quando existirem. Se
algum artefato ou prova não estiver acessível, diga "não medido"; não invente aderência. Quem escreveu não aprova. A
automação e o revisor podem apontar e corrigir, mas a aprovação humana permanece separada, salvo no merge sem
aprovação humana de `.claude/rules/environments.md`.

## Passes, nesta ordem

1. Defeito: lógica, borda, erro engolido, caminho sem teste.
2. Segurança: segredo no diff, injeção, dado pessoal, permissão a mais.
3. Aderência ao pedido: `intent.md`, `spec.md`, plano e fonte de verdade; o que entrou a mais ou faltou.
4. Teste: o caso novo falha sem o conserto? O teste foi mudado para passar?

## Classificação

| Marca | O que é | Efeito |
|---|---|---|
| Importante | quebra correção, requisito, segredo ou regra do `AGENTS.md` | bloqueia o merge até resolver |
| Nit | estilo, nome, comentário | no máximo 5 por revisão; não bloqueia |
| Fora | o que a CI já cobre (lint, build, suíte) | não comenta |

Cada achado traz o arquivo, a linha e o que fazer. Achado repetido em 2 PRs vira proposta de linha no `AGENTS.md`
ou no `.claude/rules/code-style.md`.
