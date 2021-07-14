import { basename, dirname, join } from 'path';

import glob from 'glob';

import { defaultConverters, DERIVED_PREFIX, HOLISTIC_FOLDER, HOLISTIC_SIGNATURE } from '../constants';
import { getMissingDeriveTargets } from '../utils/derived-files';

export type Mask = string | { include: string; exclude: string };

export const is2X = (file: string) => file.includes('@2x');

export const getDeriveTargets = (baseSource: string, extensions: string[]): string[] => {
  const source = baseSource.substr(0, baseSource.indexOf(HOLISTIC_SIGNATURE));
  const sizeSource: string[] = [is2X(source) && (source.replace('2x', '1x') as any), source];
  const baseFile = basename(source);

  const dir = join(dirname(source), HOLISTIC_FOLDER, baseFile);

  return [
    ...sizeSource.flatMap((file) => extensions.map((ext) => join(dir, `${DERIVED_PREFIX}${basename(file)}.${ext}`))),
    join(dir, `${DERIVED_PREFIX}${basename(source)}.meta.js`),
  ];
};

const findSource = (folder: string, mask: Mask): string[] => {
  if (typeof mask === 'string') {
    return (
      glob
        //
        .sync(`${folder}/${mask}${HOLISTIC_SIGNATURE}{jpg,png}`)
    );
  }

  return (
    glob
      //
      .sync(`${folder}/${mask.include}${HOLISTIC_SIGNATURE}{jpg,png}`, {
        ignore: mask.exclude,
      })
  );
};

/**
 * finds files yet to be derived
 */
export const findDeriveTargets = async (
  folder: string,
  mask: Mask,
  extensions: string[] = Object.keys(defaultConverters)
) => {
  const icons = findSource(folder, mask);

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
export const findLooseDerivatives = (folder: string, mask: Mask): string[] => {
  const sources = new Set(
    findSource(folder, mask)
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
