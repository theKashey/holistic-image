'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.toDPISrcSet = exports.toArray = void 0;
var toArray = function (x) {
  return x ? (Array.isArray(x) ? x : [x]) : [];
};
exports.toArray = toArray;
var toDPISrcSet = function (images) {
  return images
    .map(function (img, index) {
      return img ? img + ' ' + (index + 1) + 'x' : '';
    })
    .filter(Boolean)
    .join(', ');
};
exports.toDPISrcSet = toDPISrcSet;
