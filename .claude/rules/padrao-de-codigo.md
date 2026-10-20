---
paths:
  - "**/*.py"
  - "**/*.js"
  - "**/*.mjs"
  - "**/*.cjs"
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.cs"
  - "**/*.java"
  - "**/*.go"
  - "**/*.rb"
  - "**/*.php"
  - "**/*.kt"
  - "**/*.rs"
  - "**/*.sh"
  - "**/*.sql"
---

# Qualidade de código — a base

- **KISS e YAGNI:** a solução mais simples que resolve. Nada "para o futuro"
  sem uso hoje, nem camada ou padrão que o projeto não tem.
- **Abstração só com 2+ usos reais.** Um uso = código direto; abstração
  errada se espalha, duplicação se junta depois.
- **Arrume antes de mudar (Tidy First), em commit separado** do que muda
  comportamento.
- **Teste em três atos (AAA):** um comportamento por teste, nome que conta a
  história. Teste que não falha quando o código quebra não é teste. Caso
  novo nasce vermelho: rode-o antes do conserto e veja falhar.
- **Script tem teste das partes puras:** em Node, `<nome>.test.mjs` ao lado,
  com `node:test`, importando as funções do próprio script. O script só age
  quando chamado direto: o import do teste não dispara efeito.
- **Erro se trata na fronteira:** valide na entrada, falhe com mensagem útil,
  nunca engula exceção.
- **Engolir erro em volta de uma conta é mentira.** Em volta de um efeito
  colateral, `catch` vazio (no sh, `|| true`) é tolerância; em volta de uma medição, ele
  transforma falha em número — e o zero que sai parece um fato. Falha vira
  "não medido", nunca zero. Vale também para código de saída: a
  ferramenta que sai 2 errou, e errar não é achar nada.
- **Medida longa grava o parcial enquanto mede**, com as listas do resumo,
  e o apaga no final. Registro bruto não serve.
- **`catch` que devolve verdadeiro dentro de teste ou de guarda aprova o
  que não mediu.** O ramo de erro devolve "não medido" e diz o que falhou.
  Vale igual para asserção negativa: provar que algo não aparece exige que o
  mesmo instrumento, na mesma janela, ache alguma outra coisa.
- **Código morto se prova por zero chamador:** procure o texto que o chamador
  usa (a rota, o nome publicado), não só o método do cliente, que outra tela
  contorna chamando direto. Procure no repositório da tarefa e no log de
  acesso. Fora dele, só como permite `regras/economia.md`; o repositório não
  lido fica "não medido". Diga o commit lido: cópia local atrasa, e o
  zero dela só vale com a data.
- **Erro escondido ainda avisa.** Onde suprimir é legítimo, o aviso
  sobrevive: uma linha dizendo o que falhou e o que se perdeu com isso.
- **Peça de interface usa o componente do repositório.** Antes de escrever marcação
  e estilo novos, procure no próprio repositório o componente que já resolve
  aquilo — mensagem, aviso, card, estado vazio — e use-o; cor, ícone e
  espaçamento vêm do tema, nunca cravados no arquivo. **A suíte não vê isto:**
  teste verde não atesta apresentação; o pronto de tela inclui abrir a tela no
  estado final (dado ou vazio de verdade, nunca o esqueleto) e olhar a imagem:
  marca automática de aprovado não é olhar.
- **Coleção que vem da API tem teto na tela e na resposta.** Lista, tabela ou
  cartões de uma coleção da API nunca vão inteiros ao DOM: página, "ver mais"
  ou lista virtual, com o total à vista; o endpoint devolve paginado ou com
  limite declarado, e o item leva só os campos que a tela usa. O pronto de
  tela e de endpoint se prova com dado sintético do tamanho do maior caso real,
  contado antes no banco, nunca só com a conta de teste.
- **Mutante só onde passar calado é o risco:** gancho e cerca que guardam
  regra. Instrumento, página e texto, não.
- **Nome diz o que é.** Se precisou de comentário para explicar, o nome está
  errado.
- **Menor diff coerente:** mudança se fatia em entregas que passam sozinhas.
