---
name: busca-de-codigo-existente
description: Procura nos repositórios do workspace o código que já existe e cita o achado, com caminho e linha, antes de escrever código novo. Use antes de criar serviço, helper, contrato, componente, endpoint ou aplicação, ou quando perguntarem "já existe algo assim?". Documentação é da documentar-processo; perfil de repositório, da perfil-de-repositorio.
context: fork
agent: Explore
---

# Busca de código existente

Busque só no repositório da tarefa. Nos outros, só ao criar peça nova. Cite o achado antes de criar.

## O fluxo

1. **Escolha onde buscar.** Comece pelo repositório da tarefa. Só ao criar peça nova, escolha no máximo 2 outros
   candidatos pelo mapa `meu/wiki/` ou pelo nome das pastas. A wiki pode estar atrasada: confirme pela pasta se o
   repositório está clonado.
2. **Busque no código de cada candidato com `git -C <repo> grep`.** A wiki é destilada; o código é a verdade.
   Nada de `fetch` no vizinho nem `grep -r` da raiz.

   ```bash
   git -C <repositório> grep -n -i "<conceito>" -- '*.<ext>'
   ```

3. **Cite antes de criar.** Uma das duas frases, sempre:
   - "Já existe: `<repositório/caminho>:<linha>`; vou reusar ou estender."
   - "Não existe: procurei `<termos>` na wiki, nos repositórios e em `<onde mais>`."

   Sem citação, não crie. Achado reusável vence implementação nova.
4. **Criando, imite o repositório vizinho mais parecido:** stack, pastas, nomes, jeito de testar.

## O corte

Reuso tem limite: se estender custar mais que criar limpo, crie, e diga por quê, citando o que descartou. O proibido
não é criar; é criar sem ter procurado.

## Quando roda à parte

No Claude Code, esta skill roda num subagente, sem a conversa de quem pediu. O pedido chega no fim, na linha
`ARGUMENTS:`, e traz o conceito (o que a peça nova faria, nas palavras que o código usaria) e a linguagem, quando
quem pede sabe. Sem conceito, devolva numa linha o que faltou; não adivinhe. Devolva a frase do passo 3 e, se
houver, o perfil do repositório mais parecido: quem cria é quem pediu, e o passo 4 é dele.
