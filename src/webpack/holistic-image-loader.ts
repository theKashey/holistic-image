import { dirname, basename, relative } from 'path';

import glob from 'glob';
// @ts-ignore // conflict with wp4/wp5
import { getOptions } from 'loader-utils';

import { defaultConverters, formats, sizes } from '../constants';
import { deriveHolisticImage } from '../generator/image-converter';
import { getDeriveTargets } from '../generator/targets';
import { getMissingDeriveTargets } from '../utils/derived-files';

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

async function holisticImageLoader(this: any) {
  const callback = this.async();
  const options = {
    autogenerate: true,
    converters: defaultConverters,
    ...getOptions(this),
  };

  const baseSource: string = this.resource;
  const basePath = dirname(baseSource);
  const source = baseSource.substr(0, baseSource.indexOf('@'));
  const sourceName = basename(source);

  if (options.autogenerate) {
    await deriveHolisticImage(
      source,
      await getMissingDeriveTargets(source, getDeriveTargets(source, Object.keys(options.converters))),
      options.converters
    );
  }

  const imports: string[][] = [];
  const exports: Record<string, string[]> = {};

  const expectedFolder = `${basePath}/derived/${sourceName}`;
  this.addContextDependency(expectedFolder);

  const images = glob.sync(`${expectedFolder}/*`);
  const metaFileIndex = images.findIndex((x) => x.includes('.meta.js'));
  const metaFile = metaFileIndex >= 0 ? images.splice(metaFileIndex, 1)[0] : undefined;

  if (!metaFile || !images.length) {
    return this.callback(new Error('holistic-images: no files have been derived'), undefined);
  }

  images.forEach((image) => {
    this.addDepenency(image);

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
	
	import metaInformation from '${relative(basePath, metaFile)}';
	import {IMAGE_META_DATA} from 'holistic-image'; 
  
  const imageDef = ${JSON.stringify(exports, null, 2).replace(/"/g, '')};
  imageDef[IMAGE_META_DATA] = metaInformation; 
  export default imageDef;
  `;

  return callback(null, newSource);
}

export default holisticImageLoader;
