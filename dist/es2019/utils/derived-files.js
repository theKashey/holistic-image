import fs from 'fs';
import { promisify } from 'util';
const readAsync = promisify(fs.readFile);
const writeAsync = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const isNewer = (source, target) => {
  if (!source) {
    return false;
  }
  if (!target) {
    return true;
  }
  return source > target;
};
export const derivedFiles = async (source, targets, generator, options = {}) => {
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
