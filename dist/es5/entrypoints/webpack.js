'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.holisticImage = exports.holisticImageLoader = void 0;
var tslib_1 = require('tslib');
var holistic_image_loader_1 = tslib_1.__importDefault(require('../webpack/holistic-image-loader'));
exports.holisticImageLoader = holistic_image_loader_1.default;
var preset_1 = require('../webpack/preset');
Object.defineProperty(exports, 'holisticImage', {
  enumerable: true,
  get: function () {
    return preset_1.holisticImage;
  },
});
