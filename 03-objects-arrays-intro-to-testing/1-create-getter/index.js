/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathArr = path.split('.');

  return function getValue(obj) {
    return pathArr.reduce((accum, currentKey) => {
      if (typeof accum === 'object' && accum !== null && Object.keys(accum).includes(currentKey)) {
        return accum[currentKey];
      }
      return undefined;
    }, obj);
  }
}
