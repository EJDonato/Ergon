import type { AdapterOutput, Runner, SkillManifest } from '../types/index.js';

export interface RunnerAdapter {
  readonly runner: Runner;
  transform(manifest: SkillManifest, prompt: string): AdapterOutput;
}

export function yamlString(value: string): string {
  return JSON.stringify(value);
}
