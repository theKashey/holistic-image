import { defaultConverters } from '../constants';
import { deriveHolisticImage } from './image-converter';
import { imagePool } from './image-pool';
import { findDeriveTargets } from './targets';

/**
 * derives missing files
 */
export const deriveHolisticImages = async (folder: string, mask: string, converters = defaultConverters) => {
  const jobs = await findDeriveTargets(folder, mask, Object.keys(converters));

  await Promise.all(jobs.map(({ source, targets }) => deriveHolisticImage(source, targets, converters)));

  await imagePool().close();
};
