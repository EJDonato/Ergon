import { access, mkdir, mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { installSkills } from '../src/core/install.js';

describe('installSkills', () => {
  it('installs one skill for one runner', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ergon-install-'));
    const results = await installSkills({ root, target: 'market', runners: ['claude'] });
    expect(results).toMatchObject([{ skill: 'market', runner: 'claude', status: 'created' }]);
    const content = await readFile(join(root, '.claude/commands/market.md'), 'utf8');
    expect(content).toContain('Cyra');
  });

  it('installs the default suite for multiple runners', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ergon-install-'));
    await mkdir(join(root, '.codex'));
    const results = await installSkills({ root, target: 'default', runners: ['codex', 'cursor'] });
    expect(results).toHaveLength(18);
    await expect(access(join(root, '.codex/skills/sec/SKILL.md'))).resolves.toBeUndefined();
    await expect(access(join(root, '.cursor/rules/foundation.mdc'))).resolves.toBeUndefined();
  });

  it('installs AGY skills in the Antigravity slash-command layout', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ergon-install-'));
    await installSkills({ root, target: 'backend', runners: ['agy'] });
    const content = await readFile(join(root, '.agents/skills/ergon-kael/SKILL.md'), 'utf8');
    expect(content).toMatch(/^---\nname: ergon-kael\ndescription:/);
    expect(content).not.toContain('{{arguments}}');
  });
});
