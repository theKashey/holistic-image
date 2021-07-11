'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.HOLISTIC_SIGNATURE = exports.sizes = exports.formats = exports.defaultConverters = void 0;
exports.defaultConverters = {
  jpg: { use: 'mozjpeg', options: {} },
  webp: { use: 'webp', options: {} },
  avif: { use: 'avif', options: {} },
};
exports.formats = {
  base: ['.jpg', '.png'],
  webp: ['.webp'],
  avif: ['.avif'],
};
exports.sizes = ['@1x', '@2x'];
exports.HOLISTIC_SIGNATURE = '.holistic';
