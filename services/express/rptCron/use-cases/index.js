const { compare } = require('compare-versions');
const logger = require('../../logger/logger');

const { makeGetSortedEiapVersions } = require('./get-sorted-eiap-versions');
const { makeSortElements } = require('../../utilities/sort-elements');

const { useExternalApiService } = require('../../external-apis');

const sortElements = makeSortElements();
const getSortedEiapVersions = makeGetSortedEiapVersions(useExternalApiService, compare, sortElements, logger);

const rptCronService = Object.freeze({
  getSortedEiapVersions,
  sortElements,
});

module.exports = {
  rptCronService,
  getSortedEiapVersions,
  makeGetSortedEiapVersions,
  sortElements,
};
