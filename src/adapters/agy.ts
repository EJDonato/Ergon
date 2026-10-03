import type { RunnerAdapter } from './base.js';
import { yamlString } from './base.js';

export const agyAdapter: RunnerAdapter = {
  runner: 'agy',
  transform(manifest, prompt) {
    const path = manifest.targets?.agy ?? `.agy/skills/${manifest.id}.md`;
    const content = `---\nid: ${manifest.id}\nname: ${yamlString(manifest.name)}\ndescription: ${yamlString(manifest.description)}\ncapabilities:\n  - read\n  - write\n  - shell\n---\n\n${prompt.trim()}\n\n## Input\n\n{{arguments}}\n`;
    return { path, content };
  },
};
