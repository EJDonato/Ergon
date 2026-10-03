import { describe, expect, it } from 'vitest';
import { listSkills, resolveSkills } from '../src/core/resolver.js';

describe('skill resolver', () => {
  it('loads all built-in skills', async () => {
    const skills = await listSkills();
    expect(skills).toHaveLength(9);
    expect(skills.map((skill) => skill.manifest.id)).toContain('foundation');
  });

  it('expands bundles in workflow order', async () => {
    const skills = await resolveSkills('foundation');
    expect(skills.map((skill) => skill.manifest.id)).toEqual(['market', 'prd', 'arch', 'plan', 'foundation']);
  });

  it('rejects unknown skills', async () => {
    await expect(resolveSkills('missing')).rejects.toThrow(/Unknown skill or bundle/);
  });
});
