'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Image = void 0;
var tslib_1 = require('tslib');
var React = tslib_1.__importStar(require('react'));
var utils_1 = require('./utils');
var Source_1 = require('./Source');
var Image = function (_a) {
  var className = _a.className,
    width = _a.width,
    height = _a.height,
    alt = _a.alt,
    priorityImage = _a.priorityImage,
    src = _a.src,
    media = _a.media;
  var imagesBase = utils_1.toArray(src.base);
  return React.createElement(
    'picture',
    { className: className },
    React.createElement(Source_1.Source, { images: src, media: undefined }),
    Object
      ///
      .entries(media)
      .map(function (_a) {
        var point = _a[0],
          images = _a[1];
        return React.createElement(Source_1.Source, { images: images, media: point, key: point });
      }),
    React.createElement('img', {
      src: imagesBase[0],
      srcSet: utils_1.toDPISrcSet(imagesBase),
      width: width,
      height: height,
      loading: priorityImage ? 'eager' : 'lazy',
      alt: alt,
    })
  );
};
exports.Image = Image;
