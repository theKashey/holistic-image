import * as React from 'react';
import { toArray, toDPISrcSet } from './utils';
import { Source } from './Source';
export var Image = function (_a) {
  var className = _a.className,
    width = _a.width,
    height = _a.height,
    alt = _a.alt,
    priorityImage = _a.priorityImage,
    src = _a.src,
    media = _a.media;
  var imagesBase = toArray(src.base);
  return React.createElement(
    'picture',
    { className: className },
    React.createElement(Source, { images: src, media: undefined }),
    Object
      ///
      .entries(media)
      .map(function (_a) {
        var point = _a[0],
          images = _a[1];
        return React.createElement(Source, { images: images, media: point, key: point });
      }),
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
