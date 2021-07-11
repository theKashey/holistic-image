// @ts-ignore
import { join, basename, dirname } from 'path';

import { ImagePool } from '@squoosh/lib';
import glob from 'glob';

import { defaultConverters, HOLISTIC_SIGNATURE, TargetFormat } from '../constants';
import { derivedFiles } from '../utils/derived-files';

const is2X = (file: string) => file.includes('2x');

const getTargets = (baseSource: string, extensions: string[]): string[] => {
  const source = baseSource.substr(0, baseSource.indexOf(HOLISTIC_SIGNATURE));
  const sizeSource: string[] = [is2X(source) && (source.replace('2x', '1x') as any), source];

  return [
    ...sizeSource.flatMap((file) => extensions.map((ext) => join(dirname(file), `derived.${basename(file)}.${ext}`))),
    `${source}.meta.js`,
  ];
};

const compress = async (targets: string[], source: any, converters: Record<string, TargetFormat>) => {
  const matching: Record<string, string> = {};
  const encodeOptions: Record<string, any> = {};
  const extensions = Object.keys(converters);

  extensions.forEach((ext) => {
    const target = targets.find((x) => x.match(new RegExp(`.${ext}$`)));

    if (target) {
      const encoder = converters[ext];
      encodeOptions[encoder.use] = encoder.options || {};
      matching[encoder.use] = target;
    }
  });

  console.log('processing:', targets);
  await source.encode(encodeOptions);
  console.log('finished:', targets);

  return Object.keys(matching).reduce((acc, key) => {
    acc[matching[key]] = Promise.resolve(source.encodedWith[key]).then((x) => x.binary);

    return acc;
  }, {} as Record<string, Promise<Buffer>>);
};

export const deriveHolisticImages = async (folder: string, mask: string, converters = defaultConverters) => {
  const pattern = `${folder}/${mask}${HOLISTIC_SIGNATURE}.{jpg,png}`;
  const icons = glob.sync(pattern);

  let imagePool: any;
  const extensions = Object.keys(converters);

  await Promise.all(
    icons.map((source) => {
      return derivedFiles(source, getTargets(source, extensions), async (sourceData, missingTargets) => {
        if (!imagePool) {
          imagePool = new ImagePool();
        }

        const imageSource = imagePool.ingestImage(sourceData);
        const imageInfo = await imageSource.decoded;

        const metaFileIndex = missingTargets.findIndex((x) => x.includes('.meta.js'));
        const metaResult: any = {};

        if (metaFileIndex >= 0) {
          const metaFile = missingTargets.splice(metaFileIndex, 1)[0];

          metaResult[
            metaFile
          ] = `export default { width: ${imageInfo.bitmap.width}, height: ${imageInfo.bitmap.height} }`;
        }

        if (is2X(source)) {
          const x2 = await compress(
            missingTargets.filter((x) => x.includes('@2x')),
            imageSource,
            converters
          );

          await imageSource.preprocess({
            resize: {
              enabled: true,
              width: imageInfo.bitmap.width / 2,
            },
          });

          const x1 = await compress(
            missingTargets.filter((x) => x.includes('@1x')),
            imageSource,
            converters
          );

          return { ...metaResult, ...x1, ...x2 };
        }

        return {
          ...metaResult,
          ...(await compress(missingTargets, imageSource, converters)),
        };
      });
    })
  );

  await imagePool.close();
};
