import { TargetFormat } from '../constants';

export declare const deriveHolisticImages: (
  folder: string,
  mask: string,
  converters?: Record<string, TargetFormat>
) => Promise<void>;
