import { defaultConverters } from '../constants';
import type { TargetFormat, SourceOptions } from '../types';
import { deriveFiles } from '../utils/derived-files';
import { imagePool } from './image-pool';
import { is2X } from './targets';

const compress = async (
  targets: string[],
  source: any,
  converters: Record<string, TargetFormat>,
  options: SourceOptions
): Promise<Record<string, Promise<Buffer>>> => {
  if (!targets.length) {
    return {};
  }

  const matching: Record<string, string> = {};
  const encodeOptions: Record<string, any> = {};
  const extensions = Object.keys(converters);

  extensions.forEach((ext) => {
    const target = targets.find((x) => x.match(new RegExp(`.${ext}$`)));

    if (target) {
      const encoder = converters[ext];
      const codecOptions = encoder.options || {};
      encodeOptions[encoder.use] = typeof codecOptions === 'function' ? codecOptions(options) : codecOptions;
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

/**
 * derives missing files
 */
export const deriveHolisticImage = async (source: string, targets: string[], converters = defaultConverters) => {
  if (!targets.length) {
    return;
  }

  return deriveFiles(targets, async (missingTargets) => {
    const imageSource = imagePool().ingestImage(source);
    const imageInfo = await imageSource.decoded;

    const metaFileIndex = missingTargets.findIndex((x) => x.includes('.meta.js'));
    const metaResult: any = {};
    const imageIs2X = is2X(source);

    if (metaFileIndex >= 0) {
      const metaFile = missingTargets.splice(metaFileIndex, 1)[0];

      const metaSizeFactor = imageIs2X ? 0.5 : 1;

      metaResult[metaFile] = `
/* AUTO GENERATED FILE! */
/* eslint-disable */
export default { 
  width: ${imageInfo.bitmap.width * metaSizeFactor}, 
  height: ${imageInfo.bitmap.height * metaSizeFactor}, 
  ratio: ${(imageInfo.bitmap.width / imageInfo.bitmap.height) * metaSizeFactor}, 
}`;
    }

    if (imageIs2X) {
      const x2 = await compress(
        missingTargets.filter((x) => x.includes('@2x.')),
        imageSource,
        converters,
        {
          scale: 2,
        }
      );

      await imageSource.preprocess({
        resize: {
          enabled: true,
          width: imageInfo.bitmap.width / 2,
        },
      });

      const x1 = await compress(
        missingTargets.filter((x) => x.includes('@1x.')),
        imageSource,
        converters,
        {
          scale: 1,
        }
      );

      return { ...metaResult, ...x1, ...x2 };
    }

    return {
      ...metaResult,
      ...(await compress(missingTargets, imageSource, converters, {
        scale: 1,
      })),
    };
  });
};
