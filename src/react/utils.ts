export const toArray = <T extends any>(x: T | T[]) => (x ? (Array.isArray(x) ? x : [x]) : []);

export const toDPISrcSet = (images: Array<string | undefined>) =>
  images
    .map((img, index) => (img ? `${img} ${index + 1}x` : ''))
    .filter(Boolean)
    .join(', ');
