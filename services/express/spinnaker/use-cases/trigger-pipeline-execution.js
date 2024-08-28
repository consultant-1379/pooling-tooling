function makeTriggerPipelineExecution(request, url, functionalUserIsAvailableOrTesting, logger) {
  return async function triggerPipelineExecution(applicationName, pipelineNameOrId, payload) {
    if (functionalUserIsAvailableOrTesting()) {
      const loggingTags = {
        service: 'Spinnaker (use-cases)',
        action: 'triggerPipelineExecution',
        actionParameters: {
          ApplicationName: applicationName,
          PipelineNameOrId: pipelineNameOrId,
          Payload: payload,
        },
      };
      let triggeredPipelineId = {};
      try {
        await request
          .post(`${url}/pipelines/${applicationName}/${pipelineNameOrId}`)
          .send(payload)
          .auth(process.env.TB_FUNCTIONAL_USER, process.env.TB_FUNCTIONAL_USER_PASSWORD)
          .then((triggeredPipelineIdData) => {
            triggeredPipelineId = JSON.parse(
              triggeredPipelineIdData.text,
            );
          });
        logger.info(loggingTags, `POST request to trigger an execution for ${pipelineNameOrId} in ${applicationName} application.`);
        return triggeredPipelineId;
      } catch (err) {
        const errorInfo = {
          error: err,
          message: `Unable to trigger the pipeline execution for ${pipelineNameOrId}.`,
        };
        logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
        throw new Error(errorInfo.message);
      }
    }
    console.log('DEV: Trigger Pipeline: %s', pipelineNameOrId);
  };
}

module.exports = { makeTriggerPipelineExecution };
