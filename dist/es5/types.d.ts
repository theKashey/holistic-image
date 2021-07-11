import { IMAGE_META_DATA } from './public-constants';

export declare type HolisticalImageDefinition = {
  avif?: string[];
  webp?: string[];
  base: string[];
  [IMAGE_META_DATA]: {
    width: number;
    height: number;
  };
};
