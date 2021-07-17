import { TargetFormat } from './types';

// derived from https://github.com/GoogleChromeLabs/squoosh/blob/61de471e52147ecdc8ff674f3fcd3bbf69bb214a/libsquoosh/src/codecs.ts
export const defaultConverters: Record<string, TargetFormat> = {
  // with default 75
  jpg: { use: 'mozjpeg', options: ({ scale }) => (scale == 1 ? { quality: 80 } : { quality: 70 }) },
  // with default 75
  webp: { use: 'webp', options: ({ scale }) => (scale == 1 ? { quality: 85, method: 6 } : { quality: 75, method: 5 }) },
  // with default 33 (63-30)
  avif: {
    use: 'avif',
    options: ({ scale }) => (scale == 1 ? { cqLevel: 63 - 43, effort: 5 } : { cqLevel: 63 - 35, effort: 5 }),
  },
};

export const formats = {
  base: ['.jpg', '.png'],
  webp: ['.webp'],
  avif: ['.avif'],
};

// allow 1 second difference between original and derived file
export const MTIME_COMPARE_DELTA = 1000;

export const sizes = ['@1x', '@2x'];

export const DERIVED_PREFIX = 'derived.';
export const HOLISTIC_SIGNATURE = '.holistic.';
export const HOLISTIC_FOLDER = '.holistic';
