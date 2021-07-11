import { dirname, basename, relative } from 'path';
import glob from 'glob';
import { formats, sizes } from '../constants';
var findExt = function (source) {
  var match = Object
    ///
    .entries(formats)
    .filter(function (_a) {
      var _ = _a[0],
        v = _a[1];
      return v.some(function (predicate) {
        return source.includes(predicate);
      });
    })
    .map(function (_a) {
      var k = _a[0];
      return k;
    })[0];
  return match;
};
var findSize = function (source) {
  var index = sizes.findIndex(function (predicate) {
    return source.includes(predicate);
  });
  return Math.max(0, index);
};
function holisticImageLoader() {
  var baseSource = this.resource;
  var basePath = dirname(baseSource);
  var source = baseSource.substr(0, baseSource.indexOf('@'));
  var sourceName = basename(source);
  var imports = [];
  var exports = {};
  var images = glob.sync(basePath + '/derived.' + sourceName + '@*');
  images.forEach(function (image) {
    if (image === baseSource) {
      return;
    }
    var size = findSize(image);
    var type = findExt(image);
    if (type) {
      if (!exports[type]) {
        exports[type] = [];
      }
      var name_1 = relative(basePath, image);
      exports[type][size] = 'i' + imports.length;
      imports.push([name_1, size + ' - ' + type]);
    }
  });
  var newSource =
    '\n\t' +
    imports
      .map(function (file, index) {
        return 'import i' + index + " from './" + file[0] + "';// " + file[1];
      })
      .join('\n') +
    ";\n\t\n\timport metaInformation from './" +
    sourceName +
    ".meta.js';\n\timport {IMAGE_META_DATA} from 'holistic-image'; \n  \n  const imageDef = " +
    JSON.stringify(exports, null, 2).replace(/"/g, '') +
    ';\n  imageDef[IMAGE_META_DATA] = metaInformation; \n  export default imageDef;\n  ';
  return this.callback(null, newSource);
}
export default holisticImageLoader;
