import { IMAGE_META_DATA } from './public-constants';

export type HolisticalImageDefinition = {
  avif?: string[];
  webp?: string[];
  base: string[];

  [IMAGE_META_DATA]: { width: number; height: number };
};
