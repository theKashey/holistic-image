import fs from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';

import { MTIME_COMPARE_DELTA } from '../constants';

const writeAsync = promisify(fs.writeFile);
const stat = promisify(fs.stat);

const isNewer = (source: Date | number | undefined, target: Date | number | undefined): boolean => {
  if (!source) {
    return false;
  }

  if (!target) {
    return true;
  }

  return +source - +target > MTIME_COMPARE_DELTA;
};

type Writeable = string | Buffer;

export const getMissingDeriveTargets = async (source: string, targets: string[], options: { era?: Date } = {}) => {
  const sourceStat = stat(source).catch(() => undefined);
  const targetsStat = targets.map((target) => stat(target).catch(() => undefined));
  const { mtime: sourceTime } = (await sourceStat) || {};
  const targetsTime = (await Promise.all(targetsStat)).map((stat) => (stat ? stat.mtime : 0));

  return targets.filter(
    (_, index) => isNewer(sourceTime, targetsTime[index]) || (options.era && isNewer(options.era, targetsTime[index]))
  );
};

export const deriveFiles = async (
  missingTargets: string[],
  generator: (missingTargets: string[]) => Promise<Record<string, Promise<Writeable> | Writeable>>
) => {
  const newData = await generator(missingTargets);

  const fileList = Object.keys(newData);

  if (fileList.length > 0) {
    const targetFolder = dirname(fileList[0]);

    if (!fs.existsSync(targetFolder)) {
      console.log('create folder: ', targetFolder);
      fs.mkdirSync(targetFolder, { recursive: true });
    }
  }

  return Promise.all(
    fileList.map(async (target) => {
      return writeAsync(target, await newData[target]);
    })
  );
};
