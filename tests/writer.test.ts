import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { writeAtomic } from '../src/core/writer.js';

describe('writeAtomic', () => {
  it('creates parents and preserves files by default', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ergon-writer-'));
    await expect(writeAtomic(root, '.codex/skills/a/SKILL.md', 'one')).resolves.toBe('created');
    await expect(writeAtomic(root, '.codex/skills/a/SKILL.md', 'two')).resolves.toBe('skipped');
    await expect(readFile(join(root, '.codex/skills/a/SKILL.md'), 'utf8')).resolves.toBe('one');
  });

  it('atomically replaces files when forced', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ergon-writer-'));
    await writeAtomic(root, 'file.md', 'one');
    await expect(writeAtomic(root, 'file.md', 'two', true)).resolves.toBe('overwritten');
    await expect(readFile(join(root, 'file.md'), 'utf8')).resolves.toBe('two');
  });

  it('rejects paths outside the workspace', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ergon-writer-'));
    await expect(writeAtomic(root, '../escape.md', 'no')).rejects.toThrow(/outside workspace/);
  });
});
