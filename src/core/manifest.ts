import { readFile } from 'node:fs/promises';
import YAML from 'yaml';
import { z } from 'zod';
import type { SkillManifest } from '../types/index.js';

export const RunnerTargetSchema = z.object({
  claude: z.string().min(1).optional(),
  codex: z.string().min(1).optional(),
  agy: z.string().min(1).optional(),
  cursor: z.string().min(1).optional(),
});

export const SkillManifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  persona: z.string().min(1),
  version: z.string().default('1.0.0'),
  description: z.string().min(5),
  triggers: z.array(z.string().min(1)).min(1),
  targets: RunnerTargetSchema.optional(),
  bundle: z.array(z.string().regex(/^[a-z0-9-]+$/)).optional(),
});

export function parseManifest(source: string): SkillManifest {
  let value: unknown;
  try {
    value = YAML.parse(source);
  } catch (error) {
    throw new Error(`Invalid YAML: ${error instanceof Error ? error.message : String(error)}`);
  }

  const result = SkillManifestSchema.safeParse(value);
  if (!result.success) {
    throw new Error(`Invalid skill manifest: ${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export async function loadManifest(path: string): Promise<SkillManifest> {
  return parseManifest(await readFile(path, 'utf8'));
}
