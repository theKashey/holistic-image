export var defaultConverters = {
  jpg: { use: 'mozjpeg', options: {} },
  webp: { use: 'webp', options: {} },
  avif: { use: 'avif', options: {} },
};
export var formats = {
  base: ['.jpg', '.png'],
  webp: ['.webp'],
  avif: ['.avif'],
};
export var sizes = ['@1x', '@2x'];
export var HOLISTIC_SIGNATURE = '.holistic';
