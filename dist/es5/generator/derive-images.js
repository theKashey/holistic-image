'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.deriveHolisticImages = void 0;
var tslib_1 = require('tslib');
// @ts-ignore
var lib_1 = require('@squoosh/lib');
var glob_1 = tslib_1.__importDefault(require('glob'));
var path_1 = require('path');
var constants_1 = require('../constants');
var derived_files_1 = require('../utils/derived-files');
var is2X = function (file) {
  return file.includes('2x');
};
var getTargets = function (baseSource, extensions) {
  var source = baseSource.substr(0, baseSource.indexOf(constants_1.HOLISTIC_SIGNATURE));
  var sizeSource = [is2X(source) && source.replace('2x', '1x'), source];
  return tslib_1.__spreadArray(
    tslib_1.__spreadArray(
      [],
      sizeSource.flatMap(function (file) {
        return extensions.map(function (ext) {
          return path_1.join(path_1.dirname(file), 'derived.' + path_1.basename(file) + '.' + ext);
        });
      })
    ),
    [source + '.meta.js']
  );
};
var compress = function (targets, source, converters) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var matching, encodeOptions, extensions;
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          matching = {};
          encodeOptions = {};
          extensions = Object.keys(converters);
          extensions.forEach(function (ext) {
            var target = targets.find(function (x) {
              return x.match(new RegExp('.' + ext + '$'));
            });
            if (target) {
              var encoder = converters[ext];
              encodeOptions[encoder.use] = encoder.options || {};
              matching[encoder.use] = target;
            }
          });
          console.log('processing:', targets);
          return [4 /*yield*/, source.encode(encodeOptions)];
        case 1:
          _a.sent();
          console.log('finished:', targets);
          return [
            2 /*return*/,
            Object.keys(matching).reduce(function (acc, key) {
              acc[matching[key]] = Promise.resolve(source.encodedWith[key]).then(function (x) {
                return x.binary;
              });
              return acc;
            }, {}),
          ];
      }
    });
  });
};
var deriveHolisticImages = function (folder, mask, converters) {
  if (converters === void 0) {
    converters = constants_1.defaultConverters;
  }
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var pattern, icons, imagePool, extensions;
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          pattern = folder + '/' + mask + constants_1.HOLISTIC_SIGNATURE + '.{jpg,png}';
          icons = glob_1.default.sync(pattern);
          extensions = Object.keys(converters);
          return [
            4 /*yield*/,
            Promise.all(
              icons.map(function (source) {
                return derived_files_1.derivedFiles(
                  source,
                  getTargets(source, extensions),
                  function (sourceData, missingTargets) {
                    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                      var imageSource, imageInfo, metaFileIndex, metaResult, metaFile, x2, x1, _a;
                      return tslib_1.__generator(this, function (_b) {
                        switch (_b.label) {
                          case 0:
                            if (!imagePool) {
                              imagePool = new lib_1.ImagePool();
                            }
                            imageSource = imagePool.ingestImage(sourceData);
                            return [4 /*yield*/, imageSource.decoded];
                          case 1:
                            imageInfo = _b.sent();
                            metaFileIndex = missingTargets.findIndex(function (x) {
                              return x.includes('.meta.js');
                            });
                            metaResult = {};
                            if (metaFileIndex >= 0) {
                              metaFile = missingTargets.splice(metaFileIndex, 1)[0];
                              metaResult[metaFile] =
                                'export default { width: ' +
                                imageInfo.bitmap.width +
                                ', height: ' +
                                imageInfo.bitmap.height +
                                ' }';
                            }
                            if (!is2X(source)) return [3 /*break*/, 5];
                            return [
                              4 /*yield*/,
                              compress(
                                missingTargets.filter(function (x) {
                                  return x.includes('@2x');
                                }),
                                imageSource,
                                converters
                              ),
                            ];
                          case 2:
                            x2 = _b.sent();
                            return [
                              4 /*yield*/,
                              imageSource.preprocess({
                                resize: {
                                  enabled: true,
                                  width: imageInfo.bitmap.width / 2,
                                },
                              }),
                            ];
                          case 3:
                            _b.sent();
                            return [
                              4 /*yield*/,
                              compress(
                                missingTargets.filter(function (x) {
                                  return x.includes('@1x');
                                }),
                                imageSource,
                                converters
                              ),
                            ];
                          case 4:
                            x1 = _b.sent();
                            return [
                              2 /*return*/,
                              tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, metaResult), x1), x2),
                            ];
                          case 5:
                            _a = [tslib_1.__assign({}, metaResult)];
                            return [4 /*yield*/, compress(missingTargets, imageSource, converters)];
                          case 6:
                            return [2 /*return*/, tslib_1.__assign.apply(void 0, _a.concat([_b.sent()]))];
                        }
                      });
                    });
                  }
                );
              })
            ),
          ];
        case 1:
          _a.sent();
          return [4 /*yield*/, imagePool.close()];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
exports.deriveHolisticImages = deriveHolisticImages;
