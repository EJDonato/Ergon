import type { RunnerAdapter } from './base.js';
import { yamlString } from './base.js';

export const cursorAdapter: RunnerAdapter = {
  runner: 'cursor',
  transform(manifest, prompt) {
    const path = manifest.targets?.cursor ?? `.cursor/rules/${manifest.id}.mdc`;
    const content = `---\ndescription: ${yamlString(manifest.description)}\nglobs: "*"\nalwaysApply: false\n---\n\n${prompt.trim()}\n`;
    return { path, content };
  },
};
