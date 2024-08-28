function makeGetListOfApplicationPipelineExecutions(request, url, functionalUserIsAvailableOrTesting, logger) {
  return async function getListOfApplicationPipelineExecutions(applicationName, limit) {
    if (functionalUserIsAvailableOrTesting()) {
      const loggingTags = {
        service: 'Spinnaker (use-cases)',
        action: 'getListOfApplicationPipelineExecutions',
        actionParameters: {
          ApplicationName: applicationName,
          Limit: limit,
        },
      };
      let listOfAppPipelineExecutions = [];
      try {
        await request
          .get(`${url}/applications/${applicationName}/pipelines?limit=${limit}`)
          .auth(process.env.TB_FUNCTIONAL_USER, process.env.TB_FUNCTIONAL_USER_PASSWORD)
          .then((listOfAppPipelineExecutionsData) => {
            listOfAppPipelineExecutions = JSON.parse(
              listOfAppPipelineExecutionsData.text,
            );
          });
        logger.info(loggingTags, `GET request to retrieve pipeline executions from ${applicationName} application.`);
        return listOfAppPipelineExecutions;
      } catch (err) {
        const errorInfo = {
          error: err,
          message: 'Unable to GET list of application\'s pipelines executions.',
        };
        logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
        throw new Error(errorInfo.message);
      }
    }
  };
}

module.exports = { makeGetListOfApplicationPipelineExecutions };
