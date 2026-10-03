import { execFile } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const binary = resolve('bin/ergon.js');

describe('compiled CLI', () => {
  it('lists bundled skills', async () => {
    const { stdout } = await execFileAsync(process.execPath, [binary, 'list']);
    expect(stdout).toContain('Cyra');
    expect(stdout).toContain('specialists');
  });

  it('adds a skill and honors overwrite protection', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ergon-cli-'));
    await execFileAsync(process.execPath, [binary, 'add', 'backend', '--runner', 'codex'], { cwd: root });
    const target = join(root, '.codex/skills/backend/SKILL.md');
    const original = await readFile(target, 'utf8');
    await execFileAsync(process.execPath, [binary, 'add', 'backend', '--runner', 'codex'], { cwd: root });
    expect(await readFile(target, 'utf8')).toBe(original);
  });

  it('initializes every built-in skill', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ergon-cli-'));
    const { stdout } = await execFileAsync(process.execPath, [binary, 'init', '--runner', 'cursor'], { cwd: root });
    expect(stdout).toContain('9 files written');
    expect(await readFile(join(root, '.cursor/rules/foundation.mdc'), 'utf8')).toContain('Four-pass');
  });
});
