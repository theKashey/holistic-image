import { dirname, basename, relative } from 'path';

import glob from 'glob';
// @ts-ignore // conflict with wp4/wp5
import { getOptions } from 'loader-utils';

import { formats, HOLISTIC_FOLDER, HOLISTIC_SIGNATURE, sizes } from '../constants';
import { deriveHolisticImage } from '../generator/image-converter';
import { getDeriveTargets } from '../generator/targets';
import { getMissingDeriveTargets } from '../utils/derived-files';
import { getConfiguration } from '../utils/get-config';

const findExt = (source: string): keyof typeof formats | undefined => {
  const match = Object
    ///
    .entries(formats)
    .filter(([_, v]) => v.some((predicate) => source.includes(predicate)))
    .map(([k]) => k)[0];

  return match as any;
};

const findSize = (source: string): number => {
  const index = sizes.findIndex((predicate) => source.includes(predicate));

  return Math.max(0, index);
};

const locks = new Map<string, Promise<void>>();

const acquireFileLock = async (fileName: string): Promise<{ release(): void }> => {
  if (locks.has(fileName)) {
    await locks.get(fileName);

    return acquireFileLock(fileName);
  } else {
    let resolver: any;

    locks.set(
      fileName,
      new Promise((res) => {
        resolver = res;
      })
    );

    return {
      release() {
        locks.delete(fileName);
        resolver();
      },
    };
  }
};

async function holisticImageLoader(this: any) {
  const callback = this.async();
  const options = {
    // enable autogenerate only in dev mode
    autogenerate: this.mode === 'development',
    ...getConfiguration(),

    ...getOptions(this),
  };

  const baseSource: string = this.resource;
  const basePath = dirname(baseSource);
  const source = baseSource.substr(0, baseSource.indexOf(HOLISTIC_SIGNATURE));
  const sourceName = basename(source);

  if (options.autogenerate) {
    const lock = await acquireFileLock(baseSource);

    try {
      await deriveHolisticImage(
        baseSource,
        await getMissingDeriveTargets(baseSource, getDeriveTargets(baseSource, Object.keys(options.converters)), {
          era: options.era,
        }),
        options.converters
      );
    } finally {
      lock.release();
    }
  }

  const imports: string[][] = [];
  const exports: Record<string, string[]> = {};

  const expectedFolder = `${basePath}/${HOLISTIC_FOLDER}/${sourceName}`;
  this.addContextDependency(expectedFolder);

  const images = glob.sync(`${expectedFolder}/*`);
  const metaFileIndex = images.findIndex((x) => x.includes('.meta.js'));
  const metaFile = metaFileIndex >= 0 ? images.splice(metaFileIndex, 1)[0] : undefined;

  if (!metaFile || !images.length) {
    console.log('missing derivatives for ', baseSource, { expectedFolder, images, metaFile });

    return this.callback(new Error(`holistic-images: no files have been derived for "${baseSource}"`), undefined);
  }

  images.forEach((image) => {
    this.addDependency(image);

    const size = findSize(image);
    const type = findExt(image);

    if (type) {
      if (!exports[type]) {
        exports[type] = [];
      }

      const name = relative(basePath, image);
      exports[type][size] = `i${imports.length}`;
      imports.push([name, `${size} - ${type}`]);
    }
  });

  const newSource = `
	${imports.map((file, index) => `import i${index} from './${file[0]}';// ${file[1]}`).join('\n')};
	
	import metaInformation from './${relative(basePath, metaFile)}';
	import {IMAGE_META_DATA} from 'holistic-image'; 
  
  const imageDef = ${JSON.stringify(exports, null, 2).replace(/"/g, '')};
  imageDef[IMAGE_META_DATA] = metaInformation; 
  export default imageDef;
  `;

  return callback(null, newSource);
}

export default holisticImageLoader;
