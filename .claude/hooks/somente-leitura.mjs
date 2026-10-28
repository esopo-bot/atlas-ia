import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { localDoMeu, pastaPrincipal } from './meu.mjs';

// Gancho PreToolUse do Claude Code: os repositórios de meu/somente-leitura.txt (.claude/rules/meu.md) são só leitura.
// Ler, rodar, testar e atualizar o clone pode; criar branch, commitar, empurrar e escrever no GitHub (PR, issue,
// comentário, workflow, gh api de escrita), não. Sem a lista, tudo passa.

const ATLAS = fileURLToPath(new URL('../..', import.meta.url));

export function lerLista(texto) {
  return new Set(texto.split(/\r?\n/).map((l) => l.replace(/#.*/, '').trim().toLowerCase().replace(/\.git$/, ''))
    .filter(Boolean));
}

// dono/nome de uma URL do GitHub (https, ssh ou scp); null fora do GitHub.
export function slugDaUrl(url) {
  const achado = String(url).match(/github\.com[:/]+([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i);
  return achado ? `${achado[1]}/${achado[2]}`.toLowerCase() : null;
}

// Palavras do comando, respeitando aspas simples e duplas; o resto do shell (variável, subshell) fica como texto.
function palavras(trecho) {
  return [...trecho.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map((m) => m[1] ?? m[2] ?? m[3]);
}

const GH_ESCRITA = {
  pr: /^(create|edit|merge|close|reopen|comment|review|ready|lock|unlock)$/,
  issue: /^(create|edit|close|reopen|comment|delete|transfer|lock|unlock|pin|unpin|develop)$/,
  release: /^(create|edit|delete|upload)$/,
  workflow: /^(run|enable|disable)$/,
  run: /^(rerun|cancel|delete)$/,
  repo: /^(edit|delete|rename|archive|sync)$/,
  label: /^(create|edit|delete|clone)$/,
  secret: /^(set|delete)$/,
  variable: /^(set|delete)$/,
};

function ehEscritaGit(args) {
  const [sub, ...resto] = args;
  if (['push', 'commit', 'tag'].includes(sub)) return true;
  if (sub === 'checkout') return resto.some((a) => a === '-b' || a === '-B');
  if (sub === 'switch') return resto.some((a) => a === '-c' || a === '-C');
  if (sub === 'branch') return resto.some((a) => !a.startsWith('-')) || resto.some((a) => /^-(?:[mMcCdD]|-move|-copy|-delete)$/.test(a));
  return false;
}

function ehEscritaGhApi(args) {
  const i = args.findIndex((a) => a === '-X' || a === '--method');
  const metodo = i >= 0 ? String(args[i + 1]).toUpperCase() : args.find((a) => /^--method=/.test(a))?.split('=')[1]?.toUpperCase();
  if (metodo) return metodo !== 'GET';
  return args.some((a) => /^(-f|-F|--field|--raw-field|--input)$/.test(a) || /^--(raw-)?field=/.test(a));
}

// O que um comando do Bash tenta escrever: [{ tipo: 'git'|'gh', pasta, slugs }]. pasta é onde o git ou o gh rodam.
export function escritasDoComando(comando, cwd) {
  let pasta = cwd;
  const achados = [];
  for (const trecho of comando.split(/&&|\|\||;|\||\n/)) {
    const ws = palavras(trecho.trim());
    while (ws.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(ws[0])) ws.shift();
    if (ws[0] === 'cd' && ws[1]) { pasta = isAbsolute(ws[1]) ? ws[1] : resolve(pasta, ws[1]); continue; }
    const slugs = ws.map(slugDaUrl).filter(Boolean);
    if (ws[0] === 'git') {
      let alvo = pasta;
      let i = 1;
      while (i < ws.length && ws[i].startsWith('-')) {
        if (ws[i] === '-C') { alvo = isAbsolute(ws[i + 1]) ? ws[i + 1] : resolve(alvo, ws[i + 1]); i += 2; } else if (ws[i] === '-c') i += 2; else i += 1;
      }
      if (ehEscritaGit(ws.slice(i))) achados.push({ tipo: 'git', pasta: alvo, slugs });
    } else if (ws[0] === 'gh') {
      const repo = ws.find((w, j) => ws[j - 1] === '-R' || ws[j - 1] === '--repo') ?? ws.find((w) => /^--repo=/.test(w))?.slice(7);
      const api = ws[1] === 'api' ? ws.find((w) => /^\/?repos\/[\w.-]+\/[\w.-]+/.test(w))?.match(/repos\/([\w.-]+\/[\w.-]+)/)?.[1] : null;
      const escrita = ws[1] === 'api' ? ehEscritaGhApi(ws.slice(2)) : GH_ESCRITA[ws[1]]?.test(ws[2] ?? '') ?? false;
      if (escrita) achados.push({ tipo: 'gh', pasta, slugs: [...slugs, repo, api].filter(Boolean).map((s) => s.toLowerCase()) });
    }
  }
  return achados;
}

function slugsDaPasta(pasta) {
  const r = spawnSync('git', ['-C', pasta, 'remote', '-v'], { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.split('\n').map((l) => slugDaUrl(l.split(/\s+/)[1] ?? '')).filter(Boolean) : [];
}

// O primeiro repositório só leitura que a chamada escreveria, ou null. remotos(pasta) dá os dono/nome dos remotos.
export function alvoSoLeitura({ ferramenta, entrada, cwd, lista, remotos = slugsDaPasta }) {
  if (!lista.size) return null;
  if (/^mcp__github__/.test(ferramenta)) {
    const escreve = /create|update|merge|push|delete|add_|fork|request|assign|close|reopen|edit|comment|review|lock/.test(ferramenta);
    const slug = `${entrada?.owner}/${entrada?.repo}`.toLowerCase();
    return escreve && lista.has(slug) ? slug : null;
  }
  if (ferramenta !== 'Bash') return null;
  for (const e of escritasDoComando(String(entrada?.command ?? ''), cwd)) {
    const slugs = e.slugs.length && e.tipo === 'gh' ? e.slugs : [...e.slugs, ...remotos(e.pasta)];
    const achado = slugs.find((s) => lista.has(s));
    if (achado) return achado;
  }
  return null;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const chamada = JSON.parse(readFileSync(0, 'utf8'));
    const arquivo = join(localDoMeu(pastaPrincipal(ATLAS)), 'somente-leitura.txt');
    const lista = existsSync(arquivo) ? lerLista(readFileSync(arquivo, 'utf8')) : new Set();
    const alvo = alvoSoLeitura({ ferramenta: chamada.tool_name, entrada: chamada.tool_input, cwd: chamada.cwd ?? process.cwd(), lista });
    if (alvo) {
      console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny',
        permissionDecisionReason: `${alvo} é só leitura (meu/somente-leitura.txt, .claude/rules/meu.md): ler, rodar, `
          + 'testar e atualizar o clone pode; branch, commit, push e escrita no GitHub, não.' } }));
    }
  } catch (erro) {
    console.error(`somente-leitura: não medido (${erro.message}); a chamada segue sem a conferência.`);
  }
}
