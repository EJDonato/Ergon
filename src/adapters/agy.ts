import { basename, dirname } from 'node:path';
import type { RunnerAdapter } from './base.js';
import { yamlString } from './base.js';

export const agyAdapter: RunnerAdapter = {
  runner: 'agy',
  transform(manifest, prompt) {
    const path = manifest.targets?.agy ?? `.agents/skills/ergon-${manifest.id}/SKILL.md`;
    const command = basename(dirname(path));
    const content = `---\nname: ${command}\ndescription: ${yamlString(manifest.description)}\n---\n\n${prompt.trim()}\n`;
    return { path, content };
  },
};
