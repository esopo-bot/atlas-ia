#!/usr/bin/env node
// Consulta do CloudWatch Logs Insights pelo aws CLI: dispara, espera até Complete e devolve colunas.
// Sem dependência. Credencial: a do aws desta máquina (perfil padrão ou AWS_PROFILE). Nada de cliente aqui:
// grupo, região e consulta entram por argumento.
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { setTimeout as dormir } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const USO = `uso: node consultar.mjs --grupo <log group> --regiao <região> --consulta '<query>' --desde <início>
  [--ate agora] [--teto 60] [--tempo-de-leitura 120] [--json]
  --desde: duração para trás a partir de --ate (30m, 2h, 1d), epoch em segundos ou ISO 8601.
  --ate: 'agora' (padrão), epoch ou ISO 8601. ISO sem fuso vale UTC.`;
const SEGUNDOS = { s: 1, m: 60, h: 3600, d: 86400 };
const DURACAO = /^(\d+)([smhd])$/;
const ISO = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?))?(Z|[+-]\d{2}:?\d{2})?$/i;
const ALIAS_DO_PARSE = /\bparse\b[^|]*?\bas\s+([^|]+)/gi;
const NOMES_DO_FIELDS = /\bfields\s+([^|]+)/gi;
const STATUS_QUE_SEGUEM = ['Scheduled', 'Running'];
export const SEM_LINHA = 'a consulta não devolveu nenhuma linha';

export function instanteEmEpoch(valor, rotulo, referencia, agora = Math.floor(Date.now() / 1000)) {
  if (valor === 'agora') return agora;
  if (/^\d+$/.test(valor)) return Number(valor);
  const duracao = DURACAO.exec(valor);
  if (duracao && referencia !== undefined) return referencia - Number(duracao[1]) * SEGUNDOS[duracao[2]];
  const iso = duracao ? null : ISO.exec(valor);
  // Sem fuso, o Date.parse leria hora local: o fuso escrito vale, e só sem ele entra o UTC.
  const fuso = iso?.[3] ? iso[3].toUpperCase().replace(/^([+-]\d{2})(\d{2})$/, '$1:$2') : 'Z';
  const dia = iso ? Date.parse(`${iso[1]}T00:00Z`) : NaN;
  const ms = Number.isNaN(dia) ? NaN : Date.parse(`${iso[1]}T${iso[2] ?? '00:00'}${fuso}`);
  // O Date.parse aceita 30 de fevereiro (vira 2 de março): o dia tem de voltar igual.
  if (Number.isNaN(ms) || !new Date(dia).toISOString().startsWith(iso[1])) {
    throw new Error(`janela inválida em ${rotulo}: ${valor}. Use ISO 8601 (2026-09-01T08:00:00Z), epoch em segundos,`
      + ` 'agora' ou, só em --desde, duração para trás (30m, 2h, 1d)`);
  }
  return Math.floor(ms / 1000);
}

export function janela(desde, ate, agora) {
  const fim = instanteEmEpoch(ate, '--ate', undefined, agora);
  const inicio = instanteEmEpoch(desde, '--desde', fim, agora);
  if (inicio > fim) throw new Error(`a janela começa depois de terminar: ${desde} > ${ate}`);
  return { inicio, fim };
}

const nomes = (trecho) => trecho.split(',').map((nome) => nome.trim()).filter(Boolean);
const capturas = (regex, texto) => [...texto.matchAll(regex)].flatMap((achado) => nomes(achado[1]));

export function avisosDaConsulta(consulta) {
  const aliases = capturas(ALIAS_DO_PARSE, consulta);
  const campos = capturas(NOMES_DO_FIELDS, consulta);
  const avisos = [];
  for (const alias of new Set(aliases)) {
    if (aliases.filter((outro) => outro === alias).length > 1) {
      avisos.push(`aviso: o parse declara o alias "${alias}" mais de uma vez; o último cala os anteriores sem erro`);
    }
    if (campos.includes(alias)) {
      avisos.push(`aviso: o alias "${alias}" do parse tem o nome de um campo do fields; o original some sem erro`);
    }
  }
  return avisos;
}

// stats e fields chegam no mesmo formato (lista de {field, value}); o @ptr é interno e fica de fora.
export function linhasDoResultado(resultado) {
  return (resultado?.results ?? [])
    .map((linha) => Object.fromEntries(linha.filter((par) => par.field && par.field !== '@ptr')
      .map((par) => [par.field, par.value ?? ''])))
    .filter((linha) => Object.keys(linha).length > 0);
}

export function emColunas(linhas) {
  if (linhas.length === 0) return SEM_LINHA;
  const cabecalho = [...new Set(linhas.flatMap((linha) => Object.keys(linha)))];
  const largura = cabecalho.map((c) => Math.max(c.length, ...linhas.map((linha) => String(linha[c] ?? '').length)));
  const formata = (valores) => cabecalho.map((c, i) => String(valores[c] ?? '').padEnd(largura[i])).join('  ')
    .trimEnd();
  return [formata(Object.fromEntries(cabecalho.map((c) => [c, c]))), ...linhas.map(formata)].join('\n');
}

// --cli-read-timeout em toda chamada: sem ele o aws desiste de ler antes de o Insights responder.
export const argumentosDoAws = (argumentos, regiao, tempoDeLeitura) =>
  [...argumentos, '--region', regiao, '--output', 'json', '--cli-read-timeout', String(tempoDeLeitura)];

function awsJson(argumentos) {
  const aws = process.env.CONSULTAR_LOGS_AWS || 'aws';
  const feito = spawnSync(aws, argumentos, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  if (feito.error?.code === 'ENOENT') throw new Error(`"${aws}" não está no PATH; use o plano B da SKILL.md`);
  if (feito.error || feito.status !== 0) {
    throw new Error(`o aws não respondeu: ${feito.error?.message ?? (feito.stderr || feito.stdout).trim()}`);
  }
  return JSON.parse(feito.stdout || '{}');
}

export async function disparar(pedido, { executar = awsJson, esperar = () => dormir(1000), relogio = Date.now } = {}) {
  const { grupo, regiao, consulta, inicio, fim, teto = 60, tempoDeLeitura = 120 } = pedido;
  const chamar = (argumentos) => executar(argumentosDoAws(argumentos, regiao, tempoDeLeitura));
  const aberto = chamar(['logs', 'start-query', '--log-group-name', grupo, '--start-time', String(inicio),
    '--end-time', String(fim), '--query-string', consulta]);
  if (!aberto.queryId) throw new Error(`o start-query não devolveu queryId: ${JSON.stringify(aberto)}`);
  const limite = relogio() + teto * 1000;
  for (;;) {
    const resultado = chamar(['logs', 'get-query-results', '--query-id', aberto.queryId]);
    if (resultado.status === 'Complete') return resultado;
    if (!STATUS_QUE_SEGUEM.includes(resultado.status)) throw new Error(`a consulta terminou em ${resultado.status}`);
    if (relogio() >= limite) {
      throw new Error(`a consulta não terminou em ${teto}s; ainda ${resultado.status}. Janela larga: suba --teto`);
    }
    await esperar();
  }
}

export function lerArgumentos(argv) {
  const { values: v } = parseArgs({ args: argv, strict: true, options: {
    grupo: { type: 'string' }, regiao: { type: 'string' }, consulta: { type: 'string' }, desde: { type: 'string' },
    ate: { type: 'string' }, teto: { type: 'string' }, 'tempo-de-leitura': { type: 'string' },
    json: { type: 'boolean' }, help: { type: 'boolean', short: 'h' } } });
  if (v.help) return { ajuda: true };
  const faltam = ['grupo', 'regiao', 'consulta', 'desde'].filter((nome) => !v[nome]);
  if (faltam.length > 0) throw new Error(`falta ${faltam.map((nome) => `--${nome}`).join(', ')}\n${USO}`);
  // O Git Bash troca /aws/lambda/x por C:/Program Files/Git/aws/lambda/x antes de o Node ver.
  if (/^[A-Za-z]:[\\/]/.test(v.grupo)) {
    throw new Error(`o Git Bash trocou o grupo por caminho do Windows (${v.grupo}); rode com MSYS_NO_PATHCONV=1`
      + ' e o caminho do script relativo ou em X:/...');
  }
  const segundos = (nome, padrao) => {
    const valor = Number(v[nome] ?? padrao);
    if (!Number.isInteger(valor) || valor <= 0) throw new Error(`--${nome} pede segundos inteiros: ${v[nome]}`);
    return valor;
  };
  return { grupo: v.grupo, regiao: v.regiao, consulta: v.consulta, desde: v.desde, ate: v.ate ?? 'agora',
    teto: segundos('teto', 60), tempoDeLeitura: segundos('tempo-de-leitura', 120), json: Boolean(v.json) };
}

async function principal(argv) {
  const pedido = lerArgumentos(argv);
  if (pedido.ajuda) return console.log(USO);
  const { inicio, fim } = janela(pedido.desde, pedido.ate);
  for (const aviso of avisosDaConsulta(pedido.consulta)) console.error(aviso);
  const linhas = linhasDoResultado(await disparar({ ...pedido, inicio, fim }));
  console.log(pedido.json ? JSON.stringify(linhas, null, 2) : emColunas(linhas));
}

const chamadoDireto = process.argv[1]
  && import.meta.url.toLowerCase() === pathToFileURL(resolve(process.argv[1])).href.toLowerCase();
if (chamadoDireto) {
  principal(process.argv.slice(2)).catch((erro) => {
    console.error(`consultar-logs: ${erro.message}`);
    process.exitCode = 1;
  });
}
