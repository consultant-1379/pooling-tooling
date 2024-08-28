const { makeSortElements } = require('./sort-elements');
const { makeFlattenObject } = require('./flatten-object');

const sortElements = makeSortElements();
const flattenObject = makeFlattenObject();

const utilitiesService = Object.freeze({
  sortElements,
  flattenObject,
});

module.exports = {
  utilitiesService,
  sortElements,
  flattenObject,
};
