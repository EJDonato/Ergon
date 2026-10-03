import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadManifest } from './manifest.js';
import type { ResolvedSkill } from '../types/index.js';

export const BUNDLES: Record<string, string[]> = {
  foundation: ['market', 'prd', 'arch', 'plan', 'foundation'],
  specialists: ['backend', 'frontend', 'qa', 'sec'],
  default: ['market', 'prd', 'arch', 'plan', 'foundation', 'backend', 'frontend', 'qa', 'sec'],
};

export function defaultRegistryRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [resolve(here, '..', 'skills'), resolve(here, '..', '..', 'skills')];
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0]!;
}

async function directories(root: string): Promise<string[]> {
  const groups = await readdir(root, { withFileTypes: true });
  const found: string[] = [];
  for (const group of groups.filter((entry) => entry.isDirectory())) {
    const children = await readdir(join(root, group.name), { withFileTypes: true });
    for (const child of children.filter((entry) => entry.isDirectory())) {
      found.push(join(root, group.name, child.name));
    }
  }
  return found;
}

export async function listSkills(registryRoot = defaultRegistryRoot()): Promise<ResolvedSkill[]> {
  const loaded = await Promise.all(
    (await directories(registryRoot)).map(async (directory) => ({
      manifest: await loadManifest(join(directory, 'skill.yaml')),
      prompt: await readFile(join(directory, 'prompt.md'), 'utf8'),
      directory,
    })),
  );
  return loaded.sort((a, b) => a.manifest.id.localeCompare(b.manifest.id));
}

export async function resolveSkills(target: string, registryRoot = defaultRegistryRoot()): Promise<ResolvedSkill[]> {
  const skills = await listSkills(registryRoot);
  const ids = BUNDLES[target] ?? [target];
  const byId = new Map(skills.map((skill) => [skill.manifest.id, skill]));
  const resolved = ids.map((id) => byId.get(id));
  const missing = ids.filter((_, index) => !resolved[index]);
  if (missing.length > 0) {
    const available = [...Object.keys(BUNDLES).filter((id) => id !== 'default'), ...byId.keys()].sort();
    throw new Error(`Unknown skill or bundle '${target}'. Available: ${available.join(', ')}`);
  }
  return resolved as ResolvedSkill[];
}
