import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import YAML from 'yaml';
import { adapters } from '../src/adapters/index.js';
import { listSkills } from '../src/core/resolver.js';

const root = resolve('.');

function splitSkill(source: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  if (!match) throw new Error('Invalid SKILL.md frontmatter');
  return {
    frontmatter: YAML.parse(match[1]!),
    body: match[2]!.trim(),
  };
}

describe('installable plugin package', () => {
  it('declares matching portable and host manifests', async () => {
    const portable = JSON.parse(await readFile(join(root, 'plugin.json'), 'utf8'));
    const codex = JSON.parse(await readFile(join(root, '.codex-plugin/plugin.json'), 'utf8'));
    const claude = JSON.parse(await readFile(join(root, '.claude-plugin/plugin.json'), 'utf8'));

    expect(portable.$schema).toBe('https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
    expect([portable.name, codex.name, claude.name]).toEqual(['ergon', 'ergon', 'ergon']);
    expect([portable.version, codex.version, claude.version]).toEqual(['1.0.0', '1.0.0', '1.0.0']);
    expect(codex.skills).toBe('./skills/');
  });

  it('can build its CLI when installed directly from GitHub', async () => {
    const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
    expect(packageJson.bin).toEqual({ ergon: 'bin/ergon.js' });
    expect(packageJson.scripts.prepare).toBe('npm run build');
    expect(packageJson.repository.url).toBe('git+https://github.com/EJDonato/Ergon.git');
  });

  it('publishes the same nine canonical workflows as plugin skills', async () => {
    const canonical = await listSkills();
    const pluginDirectories = (await readdir(join(root, 'skills'), { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => name !== 'specialists')
      .sort();

    expect(pluginDirectories).toEqual(canonical.map((skill) => skill.manifest.id).sort());

    for (const skill of canonical) {
      const source = await readFile(join(root, 'skills', skill.manifest.id, 'SKILL.md'), 'utf8');
      const parsed = splitSkill(source);
      expect(parsed.frontmatter.name).toBe(skill.manifest.id);
      expect(typeof parsed.frontmatter.description).toBe('string');
      expect(parsed.body).toBe(skill.prompt.trim());
    }
  });

  it('exposes Ergon from both repository marketplaces', async () => {
    const codex = JSON.parse(await readFile(join(root, '.agents/plugins/marketplace.json'), 'utf8'));
    const claude = JSON.parse(await readFile(join(root, '.claude-plugin/marketplace.json'), 'utf8'));

    expect(codex.name).toBe('ergon-marketplace');
    expect(codex.plugins[0]).toMatchObject({ name: 'ergon', source: { source: 'url' } });
    expect(claude.name).toBe('ergon-marketplace');
    expect(claude.owner.name).toBe('EJDonato');
    expect(claude.plugins[0]).toMatchObject({ name: 'ergon', source: '.' });
  });

  it('ships workspace-native Antigravity slash commands', async () => {
    for (const skill of await listSkills()) {
      const expected = adapters.agy.transform(skill.manifest, skill.prompt);
      const source = await readFile(join(root, expected.path), 'utf8');
      expect(source).toBe(expected.content);
    }
  });
});
