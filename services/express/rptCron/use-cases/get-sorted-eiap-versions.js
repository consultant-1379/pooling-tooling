function makeGetSortedEiapVersions(useExternalApiService, compare, sortElements, logger) {
  function compareFunction(eiapVersion1, eiapVersion2) {
    return compare(eiapVersion1, eiapVersion2, '<=') ? 1 : -1;
  }

  return async function getSortedEiapVersions() {
    const loggingTags = {
      service: 'RPT CRON (use-cases)',
      action: 'getSortedEiapVersions',
      actionParameters: {},
    };
    const artifactoryResponse = await useExternalApiService.useExternalApi.getEiaeHelmfileArtifacts();

    const uris = artifactoryResponse.children.map((artifact) => artifact.uri);

    const regexToMatchFileEnding = /\.[^/.]+$/;
    const regexToMatchSemver = /\d+\.?-?/g;

    const eiapVersions = uris.map((uri) => uri.replace(regexToMatchFileEnding, '').match(regexToMatchSemver).join(''));

    const sortedEiapVersions = sortElements(compareFunction, eiapVersions);
    logger.info(loggingTags, 'Returning sorted EIAP versions.');
    return sortedEiapVersions;
  };
}

module.exports = { makeGetSortedEiapVersions };
