/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  if (param === 'asc') {
    return new Array(...arr).sort(sortFuncASC);
  }
  return new Array(...arr).sort(sortFuncDESC);
}

function sortFuncASC(a, b) {
  return a.localeCompare(b, 'ru-RU', { sensitivity: 'variant', caseFirst: 'upper'});
}
function sortFuncDESC(a, b) {
  return b.localeCompare(a, 'ru-RU', { sensitivity: 'variant', caseFirst: 'upper'});
}
