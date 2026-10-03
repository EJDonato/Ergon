import type { RunnerAdapter } from './base.js';
import { yamlString } from './base.js';

export const claudeAdapter: RunnerAdapter = {
  runner: 'claude',
  transform(manifest, prompt) {
    const path = manifest.targets?.claude ?? `.claude/commands/${manifest.id}.md`;
    const content = `---\ndescription: ${yamlString(manifest.description)}\nargument-hint: ${yamlString('[instructions]')}\n---\n\n${prompt.trim()}\n\n## Additional request\n\n$ARGUMENTS\n`;
    return { path, content };
  },
};
