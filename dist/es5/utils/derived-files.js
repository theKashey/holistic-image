'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.derivedFiles = void 0;
var tslib_1 = require('tslib');
var fs_1 = tslib_1.__importDefault(require('fs'));
var util_1 = require('util');
var readAsync = util_1.promisify(fs_1.default.readFile);
var writeAsync = util_1.promisify(fs_1.default.writeFile);
var stat = util_1.promisify(fs_1.default.stat);
var isNewer = function (source, target) {
  if (!source) {
    return false;
  }
  if (!target) {
    return true;
  }
  return source > target;
};
var derivedFiles = function (source, targets, generator, options) {
  if (options === void 0) {
    options = {};
  }
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var sourceStat, targetsStat, sourceTime, targetsTime, missingTargets, newData, _a;
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          sourceStat = stat(source).catch(function () {
            return undefined;
          });
          targetsStat = targets.map(function (target) {
            return stat(target).catch(function () {
              return undefined;
            });
          });
          return [4 /*yield*/, sourceStat];
        case 1:
          sourceTime = (_b.sent() || {}).mtime;
          return [4 /*yield*/, Promise.all(targetsStat)];
        case 2:
          targetsTime = _b.sent().map(function (stat) {
            return stat ? stat.mtime : 0;
          });
          missingTargets = targets.filter(function (_, index) {
            return isNewer(sourceTime, targetsTime[index]) || (options.era && isNewer(options.era, targetsTime[index]));
          });
          _a = generator;
          return [4 /*yield*/, readAsync(source)];
        case 3:
          return [4 /*yield*/, _a.apply(void 0, [_b.sent(), missingTargets])];
        case 4:
          newData = _b.sent();
          return [
            2 /*return*/,
            Promise.all(
              Object.keys(newData).map(function (target) {
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                  var _a, _b;
                  return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                      case 0:
                        _a = writeAsync;
                        _b = [target];
                        return [4 /*yield*/, newData[target]];
                      case 1:
                        return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                    }
                  });
                });
              })
            ),
          ];
      }
    });
  });
};
exports.derivedFiles = derivedFiles;
