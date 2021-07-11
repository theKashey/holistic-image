export var toArray = function (x) {
  return x ? (Array.isArray(x) ? x : [x]) : [];
};
export var toDPISrcSet = function (images) {
  return images
    .map(function (img, index) {
      return img ? img + ' ' + (index + 1) + 'x' : '';
    })
    .filter(Boolean)
    .join(', ');
};
