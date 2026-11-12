import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PERFIL = fileURLToPath(new URL('../rules/communication.md', import.meta.url));

// Linhas como o teto do communication.md: o texto inteiro, linhas não vazias, uma a cada 120 caracteres. O
// <details> não esconde nada no chat, onde sai como texto cru.
export function contarLinhas(texto) {
  let total = 0;
  for (const linha of texto.split(/\r?\n/)) {
    if (/[^ \t]/.test(linha)) total += Math.ceil([...linha].length / 120);
  }
  return total;
}

export function lerTeto(perfil) {
  const achado = perfil.match(/^- conversa: (\d+) linhas/m);
  return achado ? Number(achado[1]) : null;
}

export function motivoParaReescrever(entrada, teto) {
  const mensagem = entrada?.last_assistant_message;
  if (teto === null || typeof mensagem !== 'string' || entrada.stop_hook_active) return null;
  const total = contarLinhas(mensagem);
  if (total <= teto) return null;
  return `A resposta final tem ${total} linhas e o teto da conversa é ${teto} (.claude/rules/communication.md; conta linhas não vazias, `
    + 'uma a cada 120 caracteres, o texto inteiro). Reescreva só a resposta final, em até '
    + `${teto} linhas: a conclusão na primeira linha; corte na ordem do perfil (eco do pedido, pergunta do `
    + 'professor, explicação das escolhas, contexto opcional); o resto vai num arquivo .md em meu/tmp/sessao/, com o '
    + 'link na última linha (no chat, <details> sai como texto cru). Exceções do '
    + 'perfil: se vale um formato pedido por quem chamou, se a execução é sem o dono (rotina, script) ou se o '
    + 'excesso é erro, teste falho, segurança ou confirmação destrutiva, que saem inteiros, repita a mesma '
    + 'resposta sem mudar nada. Não comente este aviso.';
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const entrada = JSON.parse(readFileSync(0, 'utf8'));
    const motivo = motivoParaReescrever(entrada, lerTeto(readFileSync(PERFIL, 'utf8')));
    if (motivo) console.log(JSON.stringify({ decision: 'block', reason: motivo }));
  } catch (erro) {
    console.error(`reply-limit: não medido (${erro.message}); a resposta segue sem a conferência do teto.`);
  }
}
