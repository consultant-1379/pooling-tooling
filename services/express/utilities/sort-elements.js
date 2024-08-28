const { BadRequestError } = require('../interfaces/BadRequestError');

function makeSortElements() {
  return function sortElements(compareFunction, elements) {
    if (!elements || elements.length === 0) {
      throw new BadRequestError('No elements passed, unable to sort');
    }
    const sortedElements = elements.sort(
      (element1, element2) => compareFunction(element1, element2),
    );
    return sortedElements;
  };
}

module.exports = { makeSortElements };
