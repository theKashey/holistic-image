// @ts-ignore
import { ImagePool } from '@squoosh/lib';
import glob from 'glob';
import { derivedFiles } from '../utils/derived-files';
import { defaultConverters, HOLISTIC_SIGNATURE } from '../constants';
const is2X = (file) => file.includes('2x');
const getTargets = (baseSource, extensions) => {
  const source = baseSource.substr(0, baseSource.indexOf(HOLISTIC_SIGNATURE));
  const sizeSource = [is2X(source) && source.replace('2x', '1x'), source];
  return [...sizeSource.flatMap((file) => extensions.map((ext) => `${file}.${ext}`)), `${source}.meta.js`];
};
const compress = async (targets, source, converters) => {
  const matching = {};
  const encodeOptions = {};
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
  }, {});
};
export const deriveHolisticImages = async (folder, mask, converters = defaultConverters) => {
  const pattern = `${folder}/${mask}${HOLISTIC_SIGNATURE}.{jpg,png}`;
  const icons = glob.sync(pattern);
  let imagePool;
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
        const metaResult = {};
        if (metaFileIndex >= 0) {
          const metaFile = missingTargets.splice(metaFileIndex, 1)[0];
          metaResult[metaFile] = {
            width: imageInfo.bitmap.width,
            height: imageInfo.bitmap.height,
          };
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
