# o-que-e-do-dono

Apagar o que o git não guarda, publicar, mexer em CI e em branch permanente: só o dono.

- Onde o git guarda a versão anterior, apagar se desfaz; em arquivo não rastreado, ignorado ou fora de git, não.
  Ali, mova, e o commit diz o destino de cada coisa. Apagar de verdade é do dono, depois de provado que a informação
  está inteira em outro lugar.
- O que aciona automação (CI, implantação, aviso a outras pessoas) é do dono, mesmo onde o resto é liberado.
  Exceção: o merge do PR que o dono aprovou, mesmo que implante. A aprovação é dele.
- Branch permanente (`main`, integração, homologação, produção, seja qual for o nome) não se apaga, não se renomeia,
  não recebe push forçado nem tem a história reescrita. Na dúvida se é uma dessas, é.
- Configuração de CI não se altera de passagem.
- Publicar é tornar público ou falar com terceiros.
- Commit, push e merge: no atlas, a seção "Git, issue e PR" do `AGENTS.md`. Em outro repositório, vale o que ele
  declara; sem declaração, pergunte.
