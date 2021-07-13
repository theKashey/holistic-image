import { basename, dirname, join } from 'path';

import glob from 'glob';

import { defaultConverters, HOLISTIC_FOLDER, HOLISTIC_SIGNATURE } from '../constants';
import { getMissingDeriveTargets } from '../utils/derived-files';

export const is2X = (file: string) => file.includes('@2x');

export const getDeriveTargets = (baseSource: string, extensions: string[]): string[] => {
  const source = baseSource.substr(0, baseSource.indexOf(HOLISTIC_SIGNATURE));
  const sizeSource: string[] = [is2X(source) && (source.replace('2x', '1x') as any), source];
  const baseFile = basename(source);

  const dir = join(dirname(source), HOLISTIC_FOLDER, baseFile);

  return [
    ...sizeSource.flatMap((file) => extensions.map((ext) => join(dir, `derived.${basename(file)}.${ext}`))),
    join(dir, `derived.${basename(source)}.meta.js`),
  ];
};

/**
 * finds files yet to be derived
 */
export const findDeriveTargets = async (
  folder: string,
  mask: string,
  extensions: string[] = Object.keys(defaultConverters)
) => {
  const pattern = `${folder}/${mask}${HOLISTIC_SIGNATURE}.{jpg,png}`;
  const icons = glob.sync(pattern);

  const pairs = await Promise.all(
    icons.map(async (source) => ({
      source,
      targets: await getMissingDeriveTargets(source, getDeriveTargets(source, extensions)),
    }))
  );

  return pairs.filter((pair) => pair.targets.length);
};

/**
 * finds the derivatives with no holistic sources (a clean up)
 * @param folder
 * @param mask
 */
export const findLooseDerivatives = (folder: string, mask: string): string[] => {
  const sources = new Set(
    glob
      //
      .sync(`${folder}/${mask}${HOLISTIC_SIGNATURE}.{jpg,png}`)
      .map((name) => name.substr(0, name.indexOf(HOLISTIC_SIGNATURE)))
      // prefix normalization
      .map((name) => join('', name))
  );

  const reported = new Set<string>();
  const derived = glob.sync(`${folder}/${mask}/holistic/*`);

  derived.forEach((file) => {
    const sourceName = basename(file);
    const parentName = join(dirname(dirname(file)), sourceName);

    if (!sources.has(parentName)) {
      reported.add(parentName);
    }
  });

  return Array.from(reported.values());
};
