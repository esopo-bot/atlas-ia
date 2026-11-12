import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SHA_HEXADECIMAL = /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/;
const CAMPOS = new Set(['versao', 'sha', 'graves_provados']);

export class ErroDeRecibo extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroDeRecibo';
  }
}

const falhar = (mensagem) => { throw new ErroDeRecibo(mensagem); };
const shaValido = (sha) => typeof sha === 'string' && SHA_HEXADECIMAL.test(sha);
const objeto = (valor) => typeof valor === 'object' && valor !== null && !Array.isArray(valor);

function pularEspacos(texto, indice) {
  while (/\s/.test(texto[indice] ?? '')) indice += 1;
  return indice;
}

function fimDaString(texto, inicio) {
  for (let indice = inicio + 1; indice < texto.length; indice += 1) {
    if (texto[indice] === '\\') indice += 1;
    else if (texto[indice] === '"') return indice;
  }
  falhar('JSON inválido');
}

function fimDoValor(texto, inicio) {
  let profundidade = 0;
  for (let indice = inicio; indice < texto.length; indice += 1) {
    if (texto[indice] === '"') {
      indice = fimDaString(texto, indice);
      continue;
    }
    if (texto[indice] === '{' || texto[indice] === '[') profundidade += 1;
    else if (texto[indice] === '}' || texto[indice] === ']') {
      if (profundidade === 0) return indice;
      profundidade -= 1;
    } else if (texto[indice] === ',' && profundidade === 0) return indice;
  }
  falhar('JSON inválido');
}

function rejeitarChavesDuplicadas(texto) {
  const chaves = new Set();
  let indice = pularEspacos(texto, 0);
  if (texto[indice] !== '{') falhar('objeto inválido');
  indice = pularEspacos(texto, indice + 1);
  while (texto[indice] !== '}') {
    if (texto[indice] !== '"') falhar('JSON inválido');
    const fim = fimDaString(texto, indice);
    const chave = JSON.parse(texto.slice(indice, fim + 1));
    if (chaves.has(chave)) falhar('campo duplicado');
    chaves.add(chave);
    indice = pularEspacos(texto, fim + 1);
    if (texto[indice] !== ':') falhar('JSON inválido');
    indice = pularEspacos(texto, indice + 1);
    indice = pularEspacos(texto, fimDoValor(texto, indice));
    if (texto[indice] === ',') indice = pularEspacos(texto, indice + 1);
    else if (texto[indice] !== '}') falhar('JSON inválido');
  }
}

function dentroDaRaiz(raiz, caminho) {
  const trecho = relative(raiz, caminho);
  return !isAbsolute(trecho) && trecho !== '..' && !trecho.startsWith(`..${sep}`);
}

function normalizar(caminho) {
  return process.platform === 'win32' ? caminho.toLocaleLowerCase() : caminho;
}

export function validarRecibo(texto, shaEsperado) {
  if (!shaValido(shaEsperado)) falhar('SHA esperado inválido');

  let recibo;
  try {
    recibo = JSON.parse(texto);
  } catch {
    falhar('JSON inválido');
  }

  if (!objeto(recibo)) falhar('objeto inválido');
  rejeitarChavesDuplicadas(texto);
  for (const campo of Object.keys(recibo)) if (!CAMPOS.has(campo)) falhar('campo desconhecido');
  for (const campo of CAMPOS) if (!Object.hasOwn(recibo, campo)) falhar('campo ausente');
  if (recibo.versao !== 1) falhar('versão inválida');
  if (!shaValido(recibo.sha)) falhar('SHA inválido');
  if (recibo.sha !== shaEsperado) falhar('SHA divergente');
  if (!Array.isArray(recibo.graves_provados)) falhar('graves_provados inválido');
  if (recibo.graves_provados.length !== 0) falhar('grave provado');

  return recibo;
}

export function validarArquivo(raiz, caminhoDoRecibo, shaEsperado) {
  if (isAbsolute(caminhoDoRecibo)) falhar('caminho precisa ser relativo');

  let raizReal;
  try {
    raizReal = realpathSync(raiz);
  } catch {
    falhar('raiz indisponível');
  }

  const candidato = resolve(raizReal, caminhoDoRecibo);
  if (!dentroDaRaiz(raizReal, candidato)) falhar('caminho fora da raiz');

  let estado;
  try {
    estado = lstatSync(candidato);
  } catch (erro) {
    if (erro?.code === 'ENOENT') falhar('recibo ausente');
    falhar('recibo indisponível');
  }
  if (!estado.isFile() || estado.isSymbolicLink()) falhar('caminho simbólico ou não é arquivo');

  let caminhoReal;
  try {
    caminhoReal = realpathSync(candidato);
  } catch {
    falhar('recibo indisponível');
  }
  if (!dentroDaRaiz(raizReal, caminhoReal) || normalizar(caminhoReal) !== normalizar(candidato)) {
    falhar('caminho simbólico');
  }

  let texto;
  try {
    texto = readFileSync(caminhoReal, 'utf8');
  } catch {
    falhar('recibo indisponível');
  }
  return validarRecibo(texto, shaEsperado);
}

export function executar(argumentos = process.argv.slice(2), raiz = process.cwd()) {
  if (argumentos.length !== 2) falhar('uso inválido');
  const [shaEsperado, caminhoDoRecibo] = argumentos;
  validarArquivo(raiz, caminhoDoRecibo, shaEsperado);
  process.stdout.write('recibo válido\n');
}

function principal() {
  try {
    executar();
  } catch (erro) {
    const mensagem = erro instanceof ErroDeRecibo ? erro.message : 'falha desconhecida';
    process.stderr.write(`recibo inválido: ${mensagem}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) principal();
