import type { FC } from 'react';

import { HolisticalImageDefinition } from '../types';

declare type SourceType = {
  images: Partial<HolisticalImageDefinition>;
  media: string | undefined;
};

export declare const Source: FC<SourceType>;
export {};
