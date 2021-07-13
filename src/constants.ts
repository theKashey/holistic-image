export type TargetFormat = {
  use: 'mozjpeg' | 'webp' | 'avif';
  options: any;
};

export const defaultConverters: Record<string, TargetFormat> = {
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

export const DERIVED_PREFIX = 'derived.';
export const HOLISTIC_SIGNATURE = '.holistic.';
export const HOLISTIC_FOLDER = '.holistic';
