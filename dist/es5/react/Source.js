'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Source = void 0;
var tslib_1 = require('tslib');
var React = tslib_1.__importStar(require('react'));
var utils_1 = require('./utils');
var Source = function (_a) {
  var images = _a.images,
    media = _a.media;
  var imagesBase = utils_1.toArray(images.base);
  var imagesWebp = utils_1.toArray(images.webp);
  var imagesAvif = utils_1.toArray(images.avif);
  return React.createElement(
    React.Fragment,
    null,
    imagesAvif.length
      ? React.createElement('source', { media: media, type: 'image/avif', srcSet: utils_1.toDPISrcSet(imagesAvif) })
      : null,
    imagesWebp.length
      ? React.createElement('source', { media: media, type: 'image/webp', srcSet: utils_1.toDPISrcSet(imagesWebp) })
      : null,
    imagesBase.length ? React.createElement('source', { media: media, srcSet: utils_1.toDPISrcSet(imagesBase) }) : null
  );
};
exports.Source = Source;
