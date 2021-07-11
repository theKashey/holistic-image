import { dirname, basename, relative } from 'path';
import glob from 'glob';
import { formats, sizes } from '../constants';
const findExt = (source) => {
  const match = Object
    ///
    .entries(formats)
    .filter(([_, v]) => v.some((predicate) => source.includes(predicate)))
    .map(([k]) => k)[0];
  return match;
};
const findSize = (source) => {
  const index = sizes.findIndex((predicate) => source.includes(predicate));
  return Math.max(0, index);
};
function holisticImageLoader() {
  const baseSource = this.resource;
  const basePath = dirname(baseSource);
  const source = baseSource.substr(0, baseSource.indexOf('@'));
  const sourceName = basename(source);
  const imports = [];
  const exports = {};
  const images = glob.sync(`${basePath}/derived.${sourceName}@*`);
  images.forEach((image) => {
    if (image === baseSource) {
      return;
    }
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
	
	import metaInformation from './${sourceName}.meta.js';
	import {IMAGE_META_DATA} from 'holistic-image'; 
  
  const imageDef = ${JSON.stringify(exports, null, 2).replace(/"/g, '')};
  imageDef[IMAGE_META_DATA] = metaInformation; 
  export default imageDef;
  `;
  return this.callback(null, newSource);
}
export default holisticImageLoader;
