import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { alvoSoLeitura, lerLista, slugDaUrl } from './somente-leitura.mjs';

const AQUI = fileURLToPath(new URL('.', import.meta.url));
const SETTINGS = fileURLToPath(new URL('../settings.json', import.meta.url));
const LISTA = lerLista('# só leitura\ndono/so-leitura.git\n\nOutro/Repo # comentário\n');
const remotosDe = (mapa) => (pasta) => mapa[pasta] ?? [];
const bash = (command, cwd = '/x/livre', remotos = remotosDe({ '/x/so': ['dono/so-leitura'], '/x/livre': ['dono/livre'] })) =>
  alvoSoLeitura({ ferramenta: 'Bash', entrada: { command }, cwd, lista: LISTA, remotos });

function pastaTemporaria(t) {
  const pasta = mkdtempSync(join(tmpdir(), 'so-leitura-'));
  t.after(() => rmSync(pasta, { recursive: true, force: true }));
  return pasta;
}

test('a lista ignora comentário e linha vazia e normaliza caixa e .git', () => {
  assert.deepEqual([...LISTA], ['dono/so-leitura', 'outro/repo']);
});

test('slugDaUrl lê o GitHub por https, ssh e scp, e nada fora dele', () => {
  assert.equal(slugDaUrl('https://github.com/Dono/So-Leitura.git'), 'dono/so-leitura');
  // O usuário do ssh vem montado, para a guarda de dados pessoais não ler a URL como e-mail.
  const ssh = ['git', 'github.com'].join('@');
  assert.equal(slugDaUrl(`${ssh}:dono/so-leitura.git`), 'dono/so-leitura');
  assert.equal(slugDaUrl(`ssh://${ssh}/dono/so-leitura`), 'dono/so-leitura');
  assert.equal(slugDaUrl('https://exemplo.invalid/dono/so-leitura.git'), null);
});

test('push, commit, branch nova e tag num clone só leitura são recusados', () => {
  for (const comando of ['git push origin HEAD:main', 'git commit -m x', 'git checkout -b nova', 'git switch -c nova',
    'git branch nova', 'git tag v1', 'git -c core.x=1 push']) {
    assert.equal(bash(comando, '/x/so'), 'dono/so-leitura', comando);
  }
});

test('ler, testar e atualizar o clone só leitura passa', () => {
  for (const comando of ['git pull', 'git fetch origin', 'git status', 'git log --oneline -5', 'git branch',
    'git branch -a', 'git checkout main', 'npm test', 'git diff HEAD~1']) {
    assert.equal(bash(comando, '/x/so'), null, comando);
  }
});

test('o alvo vem do -C e do cd que vêm antes, não só da pasta da sessão', () => {
  assert.equal(bash('git -C /x/so push'), 'dono/so-leitura');
  assert.equal(bash('cd /x/so && git commit -m x'), 'dono/so-leitura');
  assert.equal(bash('cd /x/so && git status; cd /x/livre && git push'), null);
});

test('a URL na própria linha conta, mesmo de outro clone', () => {
  assert.equal(bash('git push https://github.com/dono/so-leitura.git HEAD:main'), 'dono/so-leitura');
});

test('gh de escrita no repositório só leitura é recusado, pelo -R, pelo caminho da api ou pela pasta', () => {
  assert.equal(bash('gh pr create -R dono/so-leitura --title x'), 'dono/so-leitura');
  assert.equal(bash('GH_TOKEN=x gh pr merge 3 --repo DONO/SO-LEITURA'), 'dono/so-leitura');
  assert.equal(bash('gh api repos/dono/so-leitura/issues -f title=x'), 'dono/so-leitura');
  assert.equal(bash('gh api -X PATCH repos/dono/so-leitura/pulls/1'), 'dono/so-leitura');
  assert.equal(bash('gh issue comment 5 --body x', '/x/so'), 'dono/so-leitura');
  assert.equal(bash('gh workflow run ci.yml', '/x/so'), 'dono/so-leitura');
});

test('gh de leitura passa no repositório só leitura, e o -R de outro repositório vale sobre a pasta', () => {
  for (const comando of ['gh api repos/dono/so-leitura/pulls', 'gh api -X GET repos/dono/so-leitura/issues -f q=x',
    'gh pr view 3 -R dono/so-leitura', 'gh pr list', 'gh issue view 5']) {
    assert.equal(bash(comando, '/x/so'), null, comando);
  }
  assert.equal(bash('gh pr create -R dono/livre --title x', '/x/so'), null);
});

test('o que escreve fora da lista passa, e sem lista tudo passa', () => {
  assert.equal(bash('git push', '/x/livre'), null);
  assert.equal(alvoSoLeitura({ ferramenta: 'Bash', entrada: { command: 'git push' }, cwd: '/x/so', lista: new Set(),
    remotos: () => ['dono/so-leitura'] }), null);
});

test('MCP do GitHub: escrita no repositório só leitura é recusada; leitura passa', () => {
  const mcp = (ferramenta, owner, repo) => alvoSoLeitura({ ferramenta, entrada: { owner, repo }, cwd: '/', lista: LISTA });

  assert.equal(mcp('mcp__github__create_pull_request', 'dono', 'so-leitura'), 'dono/so-leitura');
  assert.equal(mcp('mcp__github__add_issue_comment', 'Dono', 'So-Leitura'), 'dono/so-leitura');
  assert.equal(mcp('mcp__github__get_file_contents', 'dono', 'so-leitura'), null);
  assert.equal(mcp('mcp__github__create_pull_request', 'dono', 'livre'), null);
});

test('o gancho está ligado no settings.json para o Bash e o MCP do GitHub', () => {
  const grupos = JSON.parse(readFileSync(SETTINGS, 'utf8')).hooks.PreToolUse;
  const grupo = grupos.find((g) => g.hooks.some((h) => /somente-leitura\.mjs"$/.test(h.command)));

  assert.ok(grupo, JSON.stringify(grupos));
  assert.ok(new RegExp(`^(?:${grupo.matcher})$`).test('Bash'));
  assert.ok(new RegExp(`^(?:${grupo.matcher})$`).test('mcp__github__create_pull_request'));
});

test('de ponta a ponta: o gancho recusa o push num clone só leitura e cala no resto', (t) => {
  const base = pastaTemporaria(t);
  const atlas = join(base, 'atlas');
  execFileSync('git', ['init', '-q', '-b', 'main', atlas]);
  mkdirSync(join(atlas, '.claude', 'hooks'), { recursive: true });
  for (const f of ['somente-leitura.mjs', 'meu.mjs']) cpSync(join(AQUI, f), join(atlas, '.claude', 'hooks', f));
  mkdirSync(join(atlas, 'meu'));
  writeFileSync(join(atlas, 'meu', 'somente-leitura.txt'), 'dono/so-leitura\n');
  const clone = join(base, 'so-leitura');
  execFileSync('git', ['init', '-q', '-b', 'main', clone]);
  execFileSync('git', ['-C', clone, 'remote', 'add', 'origin', 'https://github.com/dono/so-leitura.git']);
  const gancho = (command) => spawnSync(process.execPath, [join(atlas, '.claude', 'hooks', 'somente-leitura.mjs')],
    { input: JSON.stringify({ tool_name: 'Bash', tool_input: { command }, cwd: clone }), encoding: 'utf8' });

  const recusa = gancho('git push origin HEAD:main');
  const leitura = gancho('git pull');

  assert.equal(recusa.status, 0, recusa.stderr);
  assert.equal(JSON.parse(recusa.stdout).hookSpecificOutput.permissionDecision, 'deny');
  assert.match(JSON.parse(recusa.stdout).hookSpecificOutput.permissionDecisionReason, /dono\/so-leitura é só leitura/);
  assert.equal(leitura.status, 0, leitura.stderr);
  assert.equal(leitura.stdout, '');
});
