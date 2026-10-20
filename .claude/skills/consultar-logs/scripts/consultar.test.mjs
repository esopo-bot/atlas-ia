// Partes puras do consultar.mjs, sem aws: node consultar.test.mjs (ou node --test nesta pasta).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  SEM_LINHA, argumentosDoAws, avisosDaConsulta, disparar, emColunas, instanteEmEpoch, janela, lerArgumentos,
  linhasDoResultado,
} from './consultar.mjs';

const MEIA_NOITE_UTC = Date.UTC(2026, 8, 1) / 1000; // 2026-09-01T00:00:00Z
const fields = { status: 'Complete', results: [[{ field: '@timestamp', value: '2026-09-01 08:00:00.000' },
  { field: '@message', value: 'erro na rota' }, { field: '@ptr', value: 'Cg...' }]] };
const stats = { status: 'Complete', results: [[{ field: 'rota', value: '/x' }, { field: 'quantas', value: '42' }],
  [{ field: 'rota', value: '/y' }, { field: 'quantas', value: '9' }]] };

test('fields vira coluna e o @ptr fica de fora', () => {
  assert.deepEqual(linhasDoResultado(fields),
    [{ '@timestamp': '2026-09-01 08:00:00.000', '@message': 'erro na rota' }]);
});

test('stats vira coluna sem assumir nome de campo (o formato que voltava vazio calado)', () => {
  assert.deepEqual(linhasDoResultado(stats), [{ rota: '/x', quantas: '42' }, { rota: '/y', quantas: '9' }]);
});

test('resultado vazio é recado, não erro', () => {
  assert.deepEqual(linhasDoResultado({ results: [] }), []);
  assert.deepEqual(linhasDoResultado({}), []);
  assert.equal(emColunas([]), SEM_LINHA);
});

test('as colunas trazem o cabeçalho e uma linha por resultado, alinhadas', () => {
  const saida = emColunas(linhasDoResultado(stats)).split('\n');
  assert.deepEqual(saida, ['rota  quantas', '/x    42', '/y    9']);
});

test('epoch em segundos atravessa como número', () => {
  assert.equal(instanteEmEpoch('1756713600', '--desde'), 1756713600);
});

test('ISO: o fuso escrito vale; sem fuso, UTC, qualquer que seja o fuso da máquina', () => {
  assert.equal(instanteEmEpoch('2026-09-01T00:00:00Z', '--desde'), MEIA_NOITE_UTC);
  assert.equal(instanteEmEpoch('2026-09-01T00:00:00+00:00', '--desde'), MEIA_NOITE_UTC);
  assert.equal(instanteEmEpoch('2026-09-01T00:00:00-03:00', '--desde'), MEIA_NOITE_UTC + 3 * 3600);
  assert.equal(instanteEmEpoch('2026-09-01T00:00:00-0300', '--desde'), MEIA_NOITE_UTC + 3 * 3600);
  assert.equal(instanteEmEpoch('2026-09-01T00:00:00', '--desde'), MEIA_NOITE_UTC);
  assert.equal(instanteEmEpoch('2026-09-01 08:00', '--desde'), MEIA_NOITE_UTC + 8 * 3600);
  assert.equal(instanteEmEpoch('2026-09-01T00:00:00.123456Z', '--desde'), MEIA_NOITE_UTC);
  assert.equal(instanteEmEpoch('2026-09-01', '--desde'), MEIA_NOITE_UTC);
});

test('janela inválida é recusada na fronteira, inclusive dia que não existe', () => {
  for (const valor of ['ontem de manhã', '2026-02-30T00:00:00Z', '2026-13-01', '2h30m', '']) {
    assert.throws(() => instanteEmEpoch(valor, '--desde', 1756713600), /janela inválida em --desde/, valor);
  }
});

test("'agora' é o relógio, não um epoch escrito à mão", () => {
  assert.equal(instanteEmEpoch('agora', '--ate', undefined, 1756713600), 1756713600);
  assert.ok(Math.abs(instanteEmEpoch('agora', '--ate') - Date.now() / 1000) <= 1);
});

test('duração para trás se calcula a partir da referência', () => {
  assert.equal(instanteEmEpoch('2h', '--desde', 1756713600), 1756713600 - 7200);
  assert.equal(instanteEmEpoch('1d', '--desde', 1756713600), 1756713600 - 86400);
  assert.equal(instanteEmEpoch('30m', '--desde', 1756713600), 1756713600 - 1800);
});

test('duração sem referência é recusada (--ate não aceita 2h)', () => {
  assert.throws(() => instanteEmEpoch('2h', '--ate'), /janela inválida em --ate/);
  assert.throws(() => janela('1h', '2h', 1756713600), /janela inválida em --ate/);
});

test('janela: --desde conta de --ate, e início depois do fim é recusado', () => {
  assert.deepEqual(janela('2h', 'agora', 1756713600), { inicio: 1756713600 - 7200, fim: 1756713600 });
  assert.deepEqual(janela('30m', '2026-09-01T00:00:00Z'), { inicio: MEIA_NOITE_UTC - 1800, fim: MEIA_NOITE_UTC });
  assert.throws(() => janela('2026-09-02T00:00:00Z', '2026-09-01T00:00:00Z'), /começa depois de terminar/);
});

test('toda chamada ao aws leva --cli-read-timeout e saída json', () => {
  assert.deepEqual(argumentosDoAws(['logs', 'start-query'], 'r', 120),
    ['logs', 'start-query', '--region', 'r', '--output', 'json', '--cli-read-timeout', '120']);
});

test('parse com alias repetido é avisado', () => {
  const avisos = avisosDaConsulta("parse @message '* *' as a, b | parse @message '*' as a | limit 5");
  assert.equal(avisos.length, 1);
  assert.match(avisos[0], /alias "a" mais de uma vez/);
});

test('alias do parse igual a campo do fields é avisado', () => {
  const avisos = avisosDaConsulta("fields @timestamp, status | parse @message 'status=*' as status");
  assert.equal(avisos.length, 1);
  assert.match(avisos[0], /alias "status" do parse tem o nome de um campo do fields/);
});

test('consulta sem colisão não recebe aviso', () => {
  assert.deepEqual(avisosDaConsulta("fields @timestamp | parse @message '*' as rota | stats count() by rota"), []);
});

test('o "as" do stats depois de um parse com regex não vira alias do parse', () => {
  assert.deepEqual(avisosDaConsulta('fields status | parse @message /(?<x>\\S+)/ | stats count() as status'), []);
});

function awsFalso(respostas) {
  const chamadas = [];
  return { chamadas, executar: (argumentos) => { chamadas.push(argumentos); return respostas.shift(); } };
}
const pedido = { grupo: '/aws/lambda/f', regiao: 'r', consulta: 'fields @message', inicio: 1, fim: 2 };

test('disparar: abre, espera enquanto Running e devolve o Complete', async () => {
  const aws = awsFalso([{ queryId: 'q1' }, { status: 'Running' }, { status: 'Scheduled' }, stats]);
  let esperas = 0;
  const resultado = await disparar(pedido, { executar: aws.executar, esperar: async () => { esperas += 1; } });
  assert.equal(resultado, stats);
  assert.equal(esperas, 2);
  assert.deepEqual(aws.chamadas[0].slice(0, 10), ['logs', 'start-query', '--log-group-name', '/aws/lambda/f',
    '--start-time', '1', '--end-time', '2', '--query-string', 'fields @message']);
  assert.deepEqual(aws.chamadas[1].slice(0, 4), ['logs', 'get-query-results', '--query-id', 'q1']);
  assert.ok(aws.chamadas.every((argumentos) => argumentos.includes('--cli-read-timeout')));
});

test('disparar: status de falha, falta de queryId e teto estourado viram erro com a causa', async () => {
  await assert.rejects(disparar(pedido, awsFalso([{ queryId: 'q' }, { status: 'Failed' }])), /terminou em Failed/);
  await assert.rejects(disparar(pedido, awsFalso([{}])), /não devolveu queryId/);
  let agora = 0;
  const lento = awsFalso([{ queryId: 'q' }, { status: 'Running' }, { status: 'Running' }]);
  await assert.rejects(disparar({ ...pedido, teto: 1 }, { executar: lento.executar, relogio: () => agora,
    esperar: async () => { agora += 1000; } }), /não terminou em 1s; ainda Running/);
});

test('argumentos: obrigatórios, padrões e recusas', () => {
  assert.deepEqual(lerArgumentos(['--grupo', 'g', '--regiao', 'r', '--consulta', 'c', '--desde', '2h']),
    { grupo: 'g', regiao: 'r', consulta: 'c', desde: '2h', ate: 'agora', teto: 60, tempoDeLeitura: 120, json: false });
  assert.equal(lerArgumentos(['--grupo', 'g', '--regiao', 'r', '--consulta', 'c', '--desde', '2h', '--json',
    '--teto', '300']).teto, 300);
  assert.throws(() => lerArgumentos(['--grupo', 'g']), /falta --regiao, --consulta, --desde/);
  assert.throws(() => lerArgumentos(['--grupo', 'g', '--regiao', 'r', '--consulta', 'c', '--desde', '2h',
    '--teto', 'muito']), /--teto pede segundos inteiros/);
  assert.throws(() => lerArgumentos(['--perfil', 'x']), /--perfil/);
  assert.throws(() => lerArgumentos(['--grupo', 'C:/Program Files/Git/aws/lambda/f', '--regiao', 'r', '--consulta',
    'c', '--desde', '2h']), /MSYS_NO_PATHCONV=1/);
  assert.deepEqual(lerArgumentos(['-h']), { ajuda: true });
});
