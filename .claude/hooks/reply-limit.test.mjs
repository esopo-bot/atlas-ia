import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { contarLinhas, lerTeto, motivoParaReescrever } from './reply-limit.mjs';

const PERFIL = '## Ajustes\n\n- conversa: 12 linhas na mensagem final do turno [8 | 20]\n- issue: 15 linhas\n';
const linhas = (n) => Array.from({ length: n }, (_, i) => `linha ${i + 1}`).join('\n');

test('contarLinhas ignora linha vazia e conta uma a cada 120 caracteres', () => {
  assert.equal(contarLinhas(`a\n\n${'x'.repeat(121)}\n`), 3);
});

test('contarLinhas conta o texto inteiro, também depois de um <details>, que no chat sai cru', () => {
  assert.equal(contarLinhas(`${linhas(3)}\n<details>\n${linhas(40)}\n</details>`), 45);
});

test('contarLinhas conta caractere fora do BMP como um, como o awk em C.UTF-8', () => {
  assert.equal(contarLinhas('😀'.repeat(120)), 1);
});

test('contarLinhas conta linha só de NBSP, que o awk não trata como vazia', () => {
  assert.equal(contarLinhas(' '), 1);
});

test('lerTeto lê o número do ajuste conversa', () => {
  assert.equal(lerTeto(PERFIL), 12);
});

test('lerTeto devolve null quando o ajuste não existe', () => {
  assert.equal(lerTeto('## Ajustes\n- issue: 15 linhas\n'), null);
});

test('motivoParaReescrever pede reescrita com 13 linhas e teto 12', () => {
  const motivo = motivoParaReescrever({ last_assistant_message: linhas(13), stop_hook_active: false }, 12);
  assert.match(motivo, /13 linhas/);
  assert.match(motivo, /teto da conversa é 12/);
});

test('motivoParaReescrever aceita exatamente o teto', () => {
  assert.equal(motivoParaReescrever({ last_assistant_message: linhas(12), stop_hook_active: false }, 12), null);
});

test('motivoParaReescrever não pede segunda reescrita no mesmo turno', () => {
  assert.equal(motivoParaReescrever({ last_assistant_message: linhas(30), stop_hook_active: true }, 12), null);
});

test('motivoParaReescrever oferece a dispensa das exceções do perfil', () => {
  const motivo = motivoParaReescrever({ last_assistant_message: linhas(13), stop_hook_active: false }, 12);
  assert.match(motivo, /formato pedido por quem chamou/);
  assert.match(motivo, /sem o dono/);
  assert.match(motivo, /erro, teste falho, segurança ou confirmação destrutiva/);
  assert.match(motivo, /repita a mesma resposta/);
});

const GANCHO = fileURLToPath(new URL('./reply-limit.mjs', import.meta.url));
const rodarGancho = (entrada) => spawnSync(process.execPath, [GANCHO], { input: entrada, encoding: 'utf8' });

test('o gancho bloqueia de ponta a ponta com 13 linhas, lendo o teto do .claude/rules/communication.md', () => {
  const saida = rodarGancho(JSON.stringify({ last_assistant_message: linhas(13), stop_hook_active: false }));
  assert.equal(JSON.parse(saida.stdout).decision, 'block');
});

test('o gancho fica calado de ponta a ponta com 12 linhas', () => {
  const saida = rodarGancho(JSON.stringify({ last_assistant_message: linhas(12), stop_hook_active: false }));
  assert.equal(saida.stdout, '');
  assert.equal(saida.status, 0);
});

test('o gancho avisa não medido e não bloqueia com entrada inválida', () => {
  const saida = rodarGancho('isto não é json');
  assert.equal(saida.stdout, '');
  assert.match(saida.stderr, /não medido/);
});

test('motivoParaReescrever não decide sem teto lido nem mensagem', () => {
  assert.equal(motivoParaReescrever({ last_assistant_message: linhas(30) }, null), null);
  assert.equal(motivoParaReescrever({ stop_hook_active: false }, 12), null);
});
