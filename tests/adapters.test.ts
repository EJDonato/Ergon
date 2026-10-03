import { describe, expect, it } from 'vitest';
import { adapters } from '../src/adapters/index.js';
import type { SkillManifest } from '../src/types/index.js';

const manifest: SkillManifest = {
  id: 'demo',
  name: 'Demo Skill',
  persona: 'Demo',
  version: '1.0.0',
  description: 'Demonstrates adapter behavior.',
  triggers: ['demo'],
};

describe('runner adapters', () => {
  it('renders Claude commands with runtime arguments', () => {
    const output = adapters.claude.transform(manifest, '# Prompt');
    expect(output.path).toBe('.claude/commands/demo.md');
    expect(output.content).toContain('$ARGUMENTS');
  });

  it('renders Codex skill frontmatter', () => {
    const output = adapters.codex.transform(manifest, '# Prompt');
    expect(output.path).toBe('.codex/skills/demo/SKILL.md');
    expect(output.content).toMatch(/^---\nname: demo\n/);
  });

  it('renders Antigravity metadata and argument binding', () => {
    const output = adapters.agy.transform(manifest, '# Prompt');
    expect(output.path).toBe('.agy/skills/demo.md');
    expect(output.content).toContain('{{arguments}}');
  });

  it('renders Cursor MDC metadata', () => {
    const output = adapters.cursor.transform(manifest, '# Prompt');
    expect(output.path).toBe('.cursor/rules/demo.mdc');
    expect(output.content).toContain('alwaysApply: false');
  });
});
