export const defaultConverters = {
  jpg: { use: 'mozjpeg', options: {} },
  webp: { use: 'webp', options: {} },
  avif: { use: 'avif', options: {} },
};
export const formats = {
  base: ['.jpg', '.png'],
  webp: ['.webp'],
  avif: ['.avif'],
};
export const sizes = ['@1x', '@2x'];
export const HOLISTIC_SIGNATURE = '.holistic';
