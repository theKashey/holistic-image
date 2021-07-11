import type webpack from 'webpack';

import { HOLISTIC_SIGNATURE } from '../constants';

export const holisticImage: webpack.RuleSetRule = {
  test: new RegExp(`${HOLISTIC_SIGNATURE}.(jpg|png)$`),
  use: require.resolve('./holistic-image-loader'),
  type: 'javascript/auto',
};
