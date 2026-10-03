import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { detectRunners } from '../src/core/detector.js';

describe('detectRunners', () => {
  it('returns no runners for an empty workspace', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ergon-detector-'));
    await expect(detectRunners(root)).resolves.toEqual([]);
  });

  it('detects directory and file markers in stable order', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ergon-detector-'));
    await mkdir(join(root, '.codex'));
    await mkdir(join(root, '.cursor'));
    await mkdir(join(root, '.agents/skills'), { recursive: true });
    await writeFile(join(root, 'CLAUDE.md'), '');
    await expect(detectRunners(root)).resolves.toEqual(['claude', 'codex', 'agy', 'cursor']);
  });

  it('does not mistake a Codex plugin marketplace for Antigravity configuration', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ergon-detector-'));
    await mkdir(join(root, '.agents/plugins'), { recursive: true });
    await expect(detectRunners(root)).resolves.toEqual([]);
  });
});
