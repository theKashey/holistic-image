import { HOLISTIC_SIGNATURE } from '../constants';
export var holisticImage = {
  test: new RegExp(HOLISTIC_SIGNATURE + '.(jpg|png)$'),
  use: require.resolve('./holistic-image-loader'),
  type: 'javascript/auto',
};
