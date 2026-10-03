import type { RunnerAdapter } from './base.js';
import { yamlString } from './base.js';

export const codexAdapter: RunnerAdapter = {
  runner: 'codex',
  transform(manifest, prompt) {
    const path = manifest.targets?.codex ?? `.codex/skills/${manifest.id}/SKILL.md`;
    const content = `---\nname: ${manifest.id}\ndescription: ${yamlString(manifest.description)}\n---\n\n${prompt.trim()}\n`;
    return { path, content };
  },
};
