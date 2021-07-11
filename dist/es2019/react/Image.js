import * as React from 'react';
import { toArray, toDPISrcSet } from './utils';
import { Source } from './Source';
export const Image = ({ className, width, height, alt, priorityImage, src, media }) => {
  const imagesBase = toArray(src.base);
  return React.createElement(
    'picture',
    { className: className },
    React.createElement(Source, { images: src, media: undefined }),
    Object
      ///
      .entries(media)
      .map(([point, images]) => React.createElement(Source, { images: images, media: point, key: point })),
    React.createElement('img', {
      src: imagesBase[0],
      srcSet: toDPISrcSet(imagesBase),
      width: width,
      height: height,
      loading: priorityImage ? 'eager' : 'lazy',
      alt: alt,
    })
  );
};
