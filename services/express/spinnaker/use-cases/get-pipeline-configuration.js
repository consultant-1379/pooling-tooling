function makeGetPipelineConfiguration(request, url, functionalUserIsAvailableOrTesting, logger) {
  return async function getPipelineConfiguration(applicationName, pipelineName) {
    if (functionalUserIsAvailableOrTesting()) {
      const loggingTags = {
        service: 'Spinnaker (use-cases)',
        action: 'getPipelineConfiguration',
        actionParameters: {
          ApplicationName: applicationName,
          PipelineName: pipelineName,
        },
      };
      let pipelineConfiguration = {};
      try {
        await request
          .get(`${url}/applications/${applicationName}/pipelineConfigs/${pipelineName}`)
          .auth(process.env.TB_FUNCTIONAL_USER, process.env.TB_FUNCTIONAL_USER_PASSWORD)
          .then((pipelineConfigurationData) => {
            pipelineConfiguration = JSON.parse(
              pipelineConfigurationData.text,
            );
          });
        logger.info(loggingTags, `GET request to retrieve pipeline configurtion for ${pipelineName} pipeline in ${applicationName} application.`);
        return pipelineConfiguration;
      } catch (err) {
        const errorInfo = {
          error: err,
          message: 'Unable to GET pipeline configuration.',
        };
        logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
        throw new Error(errorInfo.message);
      }
    }
    console.log('DEV : Pipeline Configuration: %s', pipelineName);
  };
}

module.exports = { makeGetPipelineConfiguration };
