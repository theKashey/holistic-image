export declare type TargetFormat = {
  use: 'mozjpeg' | 'webp' | 'avif';
  options: any;
};
export declare const defaultConverters: Record<string, TargetFormat>;
export declare const formats: {
  base: string[];
  webp: string[];
  avif: string[];
};
export declare const sizes: string[];
export declare const HOLISTIC_SIGNATURE = '.holistic';
