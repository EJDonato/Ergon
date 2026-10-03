import * as p from '@clack/prompts';
import pc from 'picocolors';
import { RUNNERS, type InstallResult, type Runner } from '../types/index.js';

export function parseRunner(value: string): Runner {
  if (!RUNNERS.includes(value as Runner)) {
    throw new Error(`Invalid runner '${value}'. Expected one of: ${RUNNERS.join(', ')}`);
  }
  return value as Runner;
}

export async function chooseRunners(): Promise<Runner[]> {
  if (!process.stdin.isTTY) {
    throw new Error(`No runner detected. Pass --runner <${RUNNERS.join('|')}> or create a runner configuration directory.`);
  }
  const answer = await p.multiselect<Runner>({
    message: 'Which agent runners should Ergon configure?',
    options: RUNNERS.map((runner) => ({ value: runner, label: runner })),
    required: true,
  });
  if (p.isCancel(answer)) {
    p.cancel('Installation cancelled.');
    throw new Error('Installation cancelled.');
  }
  return answer;
}

export function printResults(results: InstallResult[]): void {
  for (const result of results) {
    const marker = result.status === 'skipped' ? pc.yellow('skip') : pc.green(result.status === 'created' ? 'create' : 'replace');
    console.log(`  ${marker}  ${pc.dim(result.runner)}  ${result.path}`);
  }
  const changed = results.filter((result) => result.status !== 'skipped').length;
  const skipped = results.length - changed;
  console.log(`\n${pc.bold(`${changed} file${changed === 1 ? '' : 's'} written`)}` + (skipped ? pc.dim(`, ${skipped} skipped (use --force to replace)`) : ''));
}
