import { adapters } from '../adapters/index.js';
import type { InstallResult, Runner } from '../types/index.js';
import { resolveSkills } from './resolver.js';
import { writeAtomic } from './writer.js';

export async function installSkills(options: {
  root: string;
  target: string;
  runners: Runner[];
  force?: boolean;
  registryRoot?: string;
}): Promise<InstallResult[]> {
  const skills = await resolveSkills(options.target, options.registryRoot);
  const results: InstallResult[] = [];
  for (const skill of skills) {
    for (const runner of options.runners) {
      const output = adapters[runner].transform(skill.manifest, skill.prompt);
      const status = await writeAtomic(options.root, output.path, output.content, options.force);
      results.push({ skill: skill.manifest.id, runner, path: output.path, status });
    }
  }
  return results;
}
