// @ts-ignore
import { ImagePool } from '@squoosh/lib';

let imagePoolRef: any;

export const imagePool = () => {
  if (!imagePoolRef) {
    imagePoolRef = new ImagePool();

    // autoclear pool ref on pool close
    const clearRef = imagePoolRef;

    imagePoolRef.workerPool.done.then(() => {
      if (clearRef === imagePoolRef) {
        imagePoolRef = undefined;
      }
    });
  }

  return imagePoolRef;
};
