import type webpack from 'webpack';

import { HOLISTIC_SIGNATURE } from '../constants';
import type { TargetFormat } from '../types';

export const holisticImage: webpack.RuleSetRule = {
  test: new RegExp(`${HOLISTIC_SIGNATURE}(jpg|png)$`),
  use: require.resolve('./holistic-image-loader'),
  type: 'javascript/auto',
};

export const holisticImagePresetFactory = (options: {
  autogenerate?: boolean;
  converters?: Record<string, TargetFormat>;
}): webpack.RuleSetRule => ({
  test: new RegExp(`${HOLISTIC_SIGNATURE}(jpg|png)$`),
  use: {
    loader: require.resolve('./holistic-image-loader'),
    options: options,
  },
  type: 'javascript/auto',
});
