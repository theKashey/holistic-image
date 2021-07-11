'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var tslib_1 = require('tslib');
var path_1 = require('path');
var glob_1 = tslib_1.__importDefault(require('glob'));
var constants_1 = require('../constants');
var findExt = function (source) {
  var match = Object
    ///
    .entries(constants_1.formats)
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
  var index = constants_1.sizes.findIndex(function (predicate) {
    return source.includes(predicate);
  });
  return Math.max(0, index);
};
function holisticImageLoader() {
  var baseSource = this.resource;
  var basePath = path_1.dirname(baseSource);
  var source = baseSource.substr(0, baseSource.indexOf('@'));
  var sourceName = path_1.basename(source);
  var imports = [];
  var exports = {};
  var images = glob_1.default.sync(basePath + '/derived.' + sourceName + '@*');
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
      var name_1 = path_1.relative(basePath, image);
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
exports.default = holisticImageLoader;
