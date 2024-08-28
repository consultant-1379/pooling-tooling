const { NotFoundError } = require('../interfaces/NotFoundError');

function makeExternalApi(request, url, eiaeHelmfileStorageLocation, logger) {
  async function getEiaeHelmfileArtifacts() {
    let helmfileArtifacts;
    try {
      await request.get(`${url}${eiaeHelmfileStorageLocation}`)
        .auth(process.env.TB_ARM_USER, process.env.TB_ARM_USER_PASSWORD)
        .then((response) => {
          helmfileArtifacts = JSON.parse(
            response.text,
          );
        });
      return helmfileArtifacts;
    } catch (err) {
      const loggingTags = {
        service: 'External APIs',
        action: 'getEiaeHelmfileArtifacts',
        actionParameters: {},
      };
      logger.error({ err, loggingTags }, '(External APIs) Error: Unable to get EIAE artifacts from Artifactory');
      throw new NotFoundError(`Unable to get EIAE artifacts, ${err}`);
    }
  }

  return Object.freeze({
    getEiaeHelmfileArtifacts,
  });
}

module.exports = { makeExternalApi };
