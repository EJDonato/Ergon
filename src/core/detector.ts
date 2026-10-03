import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { RUNNERS, type Runner } from '../types/index.js';

const MARKERS: Record<Runner, string[]> = {
  claude: ['.claude', 'CLAUDE.md'],
  codex: ['.codex'],
  agy: ['.agents/skills', '.agents/workflows', 'antigravity.yaml'],
  cursor: ['.cursor', '.cursorrules'],
};

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function detectRunners(root: string): Promise<Runner[]> {
  const checks = RUNNERS.map(async (runner) => {
    const found = await Promise.all(MARKERS[runner].map((marker) => exists(join(root, marker))));
    return found.some(Boolean) ? runner : undefined;
  });
  return (await Promise.all(checks)).filter((runner): runner is Runner => runner !== undefined);
}
