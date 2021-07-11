import * as React from 'react';
import { toArray, toDPISrcSet } from './utils';
export const Source = ({ images, media }) => {
  const imagesBase = toArray(images.base);
  const imagesWebp = toArray(images.webp);
  const imagesAvif = toArray(images.avif);
  return React.createElement(
    React.Fragment,
    null,
    imagesAvif.length
      ? React.createElement('source', { media: media, type: 'image/avif', srcSet: toDPISrcSet(imagesAvif) })
      : null,
    imagesWebp.length
      ? React.createElement('source', { media: media, type: 'image/webp', srcSet: toDPISrcSet(imagesWebp) })
      : null,
    imagesBase.length ? React.createElement('source', { media: media, srcSet: toDPISrcSet(imagesBase) }) : null
  );
};
