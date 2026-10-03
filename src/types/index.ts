export const RUNNERS = ['claude', 'codex', 'agy', 'cursor'] as const;

export type Runner = (typeof RUNNERS)[number];

export interface SkillManifest {
  id: string;
  name: string;
  persona: string;
  version: string;
  description: string;
  triggers: string[];
  targets?: Partial<Record<Runner, string>>;
  bundle?: string[];
}

export interface ResolvedSkill {
  manifest: SkillManifest;
  prompt: string;
  directory: string;
}

export interface AdapterOutput {
  path: string;
  content: string;
}

export interface InstallResult {
  skill: string;
  runner: Runner;
  path: string;
  status: 'created' | 'overwritten' | 'skipped';
}
