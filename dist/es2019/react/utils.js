export const toArray = (x) => (x ? (Array.isArray(x) ? x : [x]) : []);
export const toDPISrcSet = (images) =>
  images
    .map((img, index) => (img ? `${img} ${index + 1}x` : ''))
    .filter(Boolean)
    .join(', ');
