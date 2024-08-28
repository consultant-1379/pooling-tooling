const { NotFoundError } = require('../../interfaces/NotFoundError');

function makeSearchForPipelineExecutionUsingCriteria(request, url, functionalUserIsAvailableOrTesting, logger) {
  return async function searchForPipelineExecutionUsingCriteria(applicationName, pipelineName, pipelineStatus) {
    if (functionalUserIsAvailableOrTesting()) {
      const loggingTags = {
        service: 'Spinnaker (use-cases)',
        action: 'searchForPipelineExecutionUsingCriteria',
        actionParameters: {
          ApplicationName: applicationName,
          PipelineName: pipelineName,
          PipelineStatus: pipelineStatus,
        },
      };
      let listOfPipelineExecutionSearchedUsingCriteria = {};
      try {
        await request
          .get(`${url}/applications/${applicationName}/executions/search?pipelineName=${pipelineName}&statuses=${pipelineStatus}`)
          .auth(process.env.TB_FUNCTIONAL_USER, process.env.TB_FUNCTIONAL_USER_PASSWORD)
          .then((listOfPipelineExecutionSearchedUsingCriteriaData) => {
            listOfPipelineExecutionSearchedUsingCriteria = JSON.parse(
              listOfPipelineExecutionSearchedUsingCriteriaData.text,
            );
          });
        logger.info(loggingTags, `GET request to retrieve execution for ${pipelineName} based on criteria.`);
        return listOfPipelineExecutionSearchedUsingCriteria;
      } catch (err) {
        const errorInfo = {
          error: err,
          message: 'Unable to find the pipeline execution using provided criteria.',
        };
        logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
        throw new NotFoundError(errorInfo.message);
      }
    }
    console.log('DEV: Pipeline Execution: %s', pipelineName);
  };
}

module.exports = { makeSearchForPipelineExecutionUsingCriteria };
