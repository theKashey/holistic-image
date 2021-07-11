import type { FC } from 'react';

import { HolisticalImageDefinition } from '../types';

declare type ImageType = {
  className?: string;
  alt: string;
  priorityImage?: boolean;
  width: number | `${number}%`;
  height: number | `${number}%`;
  src: HolisticalImageDefinition;
  media: Record<string, HolisticalImageDefinition>;
};
declare type ComponentType = ImageType;

export declare const Image: FC<ComponentType>;
export {};
