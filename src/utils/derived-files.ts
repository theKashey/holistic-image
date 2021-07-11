import fs from 'fs';

import { promisify } from 'util';

const readAsync = promisify(fs.readFile);
const writeAsync = promisify(fs.writeFile);
const stat = promisify(fs.stat);

const isNewer = (source: Date | number | undefined, target: Date | number | undefined): boolean => {
  if (!source) {
    return false;
  }

  if (!target) {
    return true;
  }

  return source > target;
};

type Writeable = string | Buffer;

export const derivedFiles = async (
  source: string,
  targets: string[],
  generator: (data: Buffer, missingTargets: string[]) => Promise<Record<string, Promise<Writeable> | Writeable>>,
  options: { era?: Date } = {}
) => {
  const sourceStat = stat(source).catch(() => undefined);
  const targetsStat = targets.map((target) => stat(target).catch(() => undefined));
  const { mtime: sourceTime } = (await sourceStat) || {};
  const targetsTime = (await Promise.all(targetsStat)).map((stat) => (stat ? stat.mtime : 0));

  const missingTargets = targets.filter(
    (_, index) => isNewer(sourceTime, targetsTime[index]) || (options.era && isNewer(options.era, targetsTime[index]))
  );

  const newData = await generator(await readAsync(source), missingTargets);

  return Promise.all(Object.keys(newData).map(async (target) => writeAsync(target, await newData[target])));
};
