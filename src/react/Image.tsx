import * as React from 'react';
import type { FC } from 'react';

import { HolisticalImageDefinition } from '../types';
import { Source } from './Source';
import { toArray, toDPISrcSet } from './utils';

type ImageType = {
  className?: string;
  alt: string;
  /**
   * sets image to be eager, lazy if false
   */
  priorityImage?: boolean;
  /**
   * setting of the image dimensions is enforced
   */
  width: number | `${number}%`;
  /**
   * setting of the image dimensions is enforced
   */
  height: number | `${number}%`;
  /**
   * Holistic image source
   */
  src: HolisticalImageDefinition;
  /**
   * Image settings for different media points
   * @example
   * <Image
   *   src={bigImage}
   *   media={{
   *     '(max-width: 767px)': smallerImage
   *   }}
   * />
   */
  media: Record<string, HolisticalImageDefinition>;
};

type ComponentType = ImageType;

export const Image: FC<ComponentType> = ({ className, width, height, alt, priorityImage, src, media }) => {
  const imagesBase = toArray(src.base);

  return (
    <picture className={className}>
      <Source images={src} media={undefined} />
      {Object
        ///
        .entries(media)
        .map(([point, images]) => (
          <Source images={images} media={point} key={point} />
        ))}
      <img
        src={imagesBase[0]}
        srcSet={toDPISrcSet(imagesBase)}
        width={width}
        height={height}
        loading={priorityImage ? 'eager' : 'lazy'}
        alt={alt}
      />
    </picture>
  );
};
