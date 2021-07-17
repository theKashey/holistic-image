import { IMAGE_META_DATA } from './public-constants';

type MozJPGoptions = {
  quality: number;
  baseline: boolean;
  arithmetic: boolean;
  progressive: boolean;
  optimize_coding: boolean;
  smoothing: number;
  color_space: number;
  quant_table: number;
  trellis_multipass: boolean;
  trellis_opt_zero: boolean;
  trellis_opt_table: boolean;
  trellis_loops: number;
  auto_subsample: boolean;
  chroma_subsample: number;
  separate_chroma_quality: boolean;
  chroma_quality: number;
};

type WebPOptions = {
  quality: number;
  target_size: number;
  target_PSNR: number;
  method: number;
  sns_strength: number;
  filter_strength: number;
  filter_sharpness: number;
  filter_type: number;
  partitions: number;
  segments: number;
  pass: number;
  show_compressed: number;
  preprocessing: number;
  autofilter: number;
  partition_limit: number;
  alpha_compression: number;
  alpha_filtering: number;
  alpha_quality: number;
  lossless: number;
  exact: number;
  image_hint: number;
  emulate_jpeg_size: number;
  thread_level: number;
  low_memory: number;
  near_lossless: number;
  use_delta_palette: number;
  use_sharp_yuv: number;
};

type AvifOptions = {
  cqLevel: number;
  cqAlphaLevel: -1;
  denoiseLevel: number;
  tileColsLog2: number;
  tileRowsLog2: number;
  speed: number;
  subsample: number;
  chromaDeltaQ: boolean;
  sharpness: number;
  tune: number;
};

export type SourceOptions = { scale: 1 | 2 };
export type DeriveSettings = { era?: number };

export type OptionsFor<T> = T extends () => any ? never : T | T[] | ((x: SourceOptions) => T);

export type TargetFormat =
  | {
      use: 'mozjpeg';
      options: OptionsFor<Partial<MozJPGoptions>>;
    }
  | {
      use: 'webp';
      options: OptionsFor<Partial<WebPOptions>>;
    }
  | {
      use: 'avif';
      options: OptionsFor<Partial<AvifOptions>>;
    };

export type HolisticalImageDefinition = {
  avif?: string[];
  webp?: string[];
  base: string[];

  [IMAGE_META_DATA]: { width: number; height: number; ratio: number };
};
