# segredo

Credencial de dev e homologação: veja e use. Produção: só leitura. No git, só o nome (`${NOME}`).

- **Fonte.** O valor mora no gerenciador de senhas do dono. Na máquina ele é cópia: variável de ambiente de
  usuário, com o nome da entrada. A tabela de nomes está em `.credenciais/LEIAME.txt`. Os nomes só de uma máquina
  (contas, logins) ficam em `~/.atlas-segredos`, fora do git.
- **Tela.** O que um comando imprime vai para o transcrito, que fica no disco. Leia a variável pelo nome;
  para saber se existe: `[ -n "${NOME:-}" ] && echo tem`. Nunca `env`, `printenv`, `set` ou `export -p` inteiros,
  nem filtrados por padrão de nome: o valor vai junto. Para listar os nomes de um cofre (arquivo de ambiente,
  `user-secrets`, parâmetro), use um leitor do formato que imprima só as chaves, como
  `node -p "Object.keys(util.parseEnv(fs.readFileSync('.env', 'utf8')))"`. Saída `--json` traz os valores: passe-a
  por um parser que imprima as chaves. Filtro de linha (`grep`, `sed`, `cut`, `awk`) deixa passar a continuação
  de um valor de várias linhas, como uma chave privada, mesmo preso ao `=`: linha de base64 também o tem.
- **Git.** Entra só o nome: `${NOME}` no arquivo e uma linha na tabela. O valor não entra em commit, mensagem de commit,
  issue, PR nem gist, nem em repositório privado. O gancho `.githooks/segredo.sh` recusa o commit que leve o valor:
  não o desligue nem o pule.
- **Dev e homologação.** É para usar: leia, teste e ajude a configurar, sem aviso de vazamento e sem recusa.
  Segredo que falta não para o trabalho: diga o nome, onde se emite, e siga.
- **Produção.** Antes de chamar um serviço, diga em uma linha qual ambiente é o alvo. Produção: só
  leitura (listar, descrever, consultar). Torne a chamada só leitura: perfil ou usuário de leitura, `SELECT` sem
  efeito, `--dry-run` onde houver. Escrever, apagar, implantar ou mudar configuração em produção é do dono.
- **Reconhecer produção.** `AWS_PROFILE` ou `--profile` com `prod`, `produção` ou `prd` no nome; ambiente `prod`,
  `production` ou `prd`; número de conta ou endereço listado em `~/.atlas-producao` (desta máquina, um por linha,
  fora do git). Sem sinal claro, é produção.
- A regra vale mesmo com a credencial de produção já limitada à leitura no IAM.
- **Volta.** Criou ou trocou um valor? Grave a variável, ponha o valor na área de transferência, peça ao dono que
  atualize o gerenciador e anote escopo e vencimento na tabela.
- **Saiu da máquina, troca.** Valor que apareceu em commit, issue, PR, página ou mensagem a terceiros é revogado e
  trocado na hora: diga ao dono o passo. O chat com o agente não conta. Token novo nasce com o menor escopo.
- **Público.** Nenhum arquivo do atlas leva nome, sobrenome ou login do dono, e-mail, nome de conta (nem a variável
  que o carrega), caminho de máquina, id de sessão, ambiente ou dispositivo, número de issue ou PR, nome de projeto
  ou de organização, nem nada da vida pessoal: assim qualquer arquivo pode ser copiado à mão para onde for,
  conferido antes pela skill `portao`. Esses nomes moram em `meu/casa.md`, fora do git, e os comandos usam os
  marcadores do `AGENTS.md`. Cobra: `node --test testes/*.test.mjs`, com os termos do dono em `meu/proibidos.txt`,
  fora do git, porque até o hash de uma palavra curta se desfaz; sem a lista, essa parte sai como não medida.
