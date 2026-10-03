import { access, link, mkdir, open, rename, unlink } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

export type WriteStatus = 'created' | 'overwritten' | 'skipped';

export async function writeAtomic(
  root: string,
  target: string,
  content: string,
  overwrite = false,
): Promise<WriteStatus> {
  const rootPath = resolve(root);
  const targetPath = resolve(rootPath, target);
  const fromRoot = relative(rootPath, targetPath);
  if (isAbsolute(target) || fromRoot.startsWith('..') || isAbsolute(fromRoot)) {
    throw new Error(`Refusing to write outside workspace: ${target}`);
  }

  await mkdir(dirname(targetPath), { recursive: true });
  let existed = true;
  try {
    await access(targetPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    existed = false;
  }

  if (existed && !overwrite) return 'skipped';

  const tempPath = `${targetPath}.tmp.${process.pid}.${Date.now()}`;
  try {
    const handle = await open(tempPath, 'wx');
    await handle.writeFile(content, 'utf8');
    await handle.sync();
    await handle.close();
    if (overwrite) {
      await rename(tempPath, targetPath);
    } else {
      try {
        await link(tempPath, targetPath);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'EEXIST') return 'skipped';
        throw error;
      } finally {
        await unlink(tempPath).catch(() => undefined);
      }
    }
  } catch (error) {
    await unlink(tempPath).catch(() => undefined);
    throw error;
  }
  return existed ? 'overwritten' : 'created';
}
