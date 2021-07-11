import * as React from 'react';
import { toArray, toDPISrcSet } from './utils';
export var Source = function (_a) {
  var images = _a.images,
    media = _a.media;
  var imagesBase = toArray(images.base);
  var imagesWebp = toArray(images.webp);
  var imagesAvif = toArray(images.avif);
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
