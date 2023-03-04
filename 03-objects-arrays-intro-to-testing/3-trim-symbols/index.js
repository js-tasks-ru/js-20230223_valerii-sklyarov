/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size <= 0) {
    return '';
  }
  if (size >= string.length) {
    return string;
  }
  const charGroup = [...string].reduce((acc, char, i) => {
    if (i === 0 || char !== acc[acc.length - 1][0]) {
      acc.push([char]);
    } else {
      acc[acc.length - 1].push(char);
    }
    return acc;
  }, []);
  return charGroup
    .map(group => group.slice(0, size))
    .map(group => group.join(''))
    .join('');
}
