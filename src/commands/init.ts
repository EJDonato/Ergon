import { resolve } from 'node:path';
import { detectRunners } from '../core/detector.js';
import { installSkills } from '../core/install.js';
import type { Runner } from '../types/index.js';
import { chooseRunners, printResults } from './shared.js';

export interface InitOptions {
  runner?: Runner;
  force?: boolean;
  cwd?: string;
}

export async function initCommand(options: InitOptions): Promise<void> {
  const root = resolve(options.cwd ?? process.cwd());
  let runners = options.runner ? [options.runner] : await detectRunners(root);
  if (runners.length === 0) runners = await chooseRunners();
  const results = await installSkills({ root, target: 'default', runners, force: options.force });
  printResults(results);
}
