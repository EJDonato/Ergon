import type { Runner } from '../types/index.js';
import type { RunnerAdapter } from './base.js';
import { agyAdapter } from './agy.js';
import { claudeAdapter } from './claude.js';
import { codexAdapter } from './codex.js';
import { cursorAdapter } from './cursor.js';

export const adapters: Record<Runner, RunnerAdapter> = {
  claude: claudeAdapter,
  codex: codexAdapter,
  agy: agyAdapter,
  cursor: cursorAdapter,
};
