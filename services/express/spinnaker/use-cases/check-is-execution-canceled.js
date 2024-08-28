function makeCheckIsExecutionCanceled(request, url, logger) {
  return async function checkIsExecutionCanceled(executionId) {
    const loggingTags = {
      service: 'Spinnaker (use-cases)',
      action: 'checkIsExecutionCanceled',
      actionParameters: { ExecutionId: executionId },
    };
    let isExecutionCanceled = false;
    try {
      await request
        .get(`${url}/executions?executionIds=${executionId}&expand=false`)
        .auth(process.env.TB_FUNCTIONAL_USER, process.env.TB_FUNCTIONAL_USER_PASSWORD)
        .then((pipelineExecutionData) => {
          isExecutionCanceled = JSON.parse(pipelineExecutionData.text)[0].canceled;
          if (isExecutionCanceled) {
            logger.info(loggingTags, `GET request detected canceled pipeline execution: ${executionId}`);
          }
        });
    } catch (err) {
      const errorInfo = {
        error: err,
        message: `Unable to GET pipeline executions status, url=${url}, executionId=${executionId}.`,
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new Error(errorInfo.message);
    }
    return isExecutionCanceled;
  };
}

module.exports = { makeCheckIsExecutionCanceled };
