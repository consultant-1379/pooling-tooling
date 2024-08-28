/**
 * Flatten nested objects, preserving parent-child relationships.
 *
 * @param {Object} obj - The nested object to flatten. (e.g., { foo: x, bar: { baz: y } })
 * @param {string} parentKey - The object name. (e.g., 'foobar')
 * @param {string} separator - The separator to join strings. (e.g., '.')
 * @returns {Object} flattened - the flattened object. (e.g., { 'foobar.foo': x, 'foobar.bar.baz': y })
 */
function makeFlattenObject() {
  return function flattenObject(obj, parentKey = '', separator = '.') {
    const flattened = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = parentKey ? `${parentKey}${separator}${key}` : key;

        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenObject(obj[key], newKey, separator));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    return flattened;
  };
}

module.exports = { makeFlattenObject };
