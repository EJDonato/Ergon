import { Command, InvalidArgumentError } from 'commander';
import pc from 'picocolors';
import { pathToFileURL } from 'node:url';
import { addCommand } from './commands/add.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { parseRunner } from './commands/shared.js';

export function createProgram(): Command {
  const program = new Command();
  program
    .name('ergon')
    .description('Install portable AI-agent skills into any repository')
    .version('1.0.0')
    .showHelpAfterError();

  const runnerOption = ['-r, --runner <runner>', 'target runner (claude, codex, agy, cursor)', (value: string) => {
    try {
      return parseRunner(value);
    } catch (error) {
      throw new InvalidArgumentError((error as Error).message);
    }
  }] as const;

  program
    .command('init')
    .description('Install the complete foundation and specialist suite')
    .option(...runnerOption)
    .option('-f, --force', 'replace existing skill files')
    .action(initCommand);

  program
    .command('add')
    .description('Install a skill or bundle')
    .argument('<target>', 'skill ID or bundle (foundation, specialists)')
    .option(...runnerOption)
    .option('-f, --force', 'replace existing skill files')
    .action(addCommand);

  program.command('list').description('List bundled skills').action(listCommand);
  return program;
}

export async function run(argv = process.argv): Promise<void> {
  await createProgram().parseAsync(argv);
}

const isEntryPoint = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isEntryPoint) {
  run().catch((error: unknown) => {
    console.error(pc.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    process.exitCode = 1;
  });
}
