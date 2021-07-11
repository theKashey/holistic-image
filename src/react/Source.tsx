import type { FC } from 'react';
import * as React from 'react';

import { HolisticalImageDefinition } from '../types';
import { toArray, toDPISrcSet } from './utils';

type SourceType = {
  images: Partial<HolisticalImageDefinition>;
  media: string | undefined;
};

export const Source: FC<SourceType> = ({ images, media }) => {
  const imagesBase = toArray(images.base);
  const imagesWebp = toArray(images.webp);
  const imagesAvif = toArray(images.avif);

  return (
    <>
      {imagesAvif.length ? <source media={media} type="image/avif" srcSet={toDPISrcSet(imagesAvif)} /> : null}
      {imagesWebp.length ? <source media={media} type="image/webp" srcSet={toDPISrcSet(imagesWebp)} /> : null}
      {imagesBase.length ? <source media={media} srcSet={toDPISrcSet(imagesBase)} /> : null}
    </>
  );
};
