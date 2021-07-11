'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.holisticImage = void 0;
var constants_1 = require('../constants');
exports.holisticImage = {
  test: new RegExp(constants_1.HOLISTIC_SIGNATURE + '.(jpg|png)$'),
  use: require.resolve('./holistic-image-loader'),
  type: 'javascript/auto',
};
