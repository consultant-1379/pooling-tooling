function makeKickOffSpinnakerFlow(triggerSpinnakerPipelineExecution, logger) {
  return async function kickOffSpinnakerFlow(testEnvironment, spinnakerApplication, spinnakerPipeline) {
    const loggingTags = {
      service: 'Schedules (use-cases)',
      action: 'kickOffSpinnakerFlow',
      actionParameters: {},
    };
    logger.info(loggingTags, `Test environment status = ${testEnvironment.status}, RPT Mode = ${process.env.NODE_ENV}.`);

    if (spinnakerApplication === '' || spinnakerPipeline === '') {
      logger.info(loggingTags, 'Spinnaker Application/Pipeline name have not been set correctly; there may be an issue with projectArea in Schedule');
      return false;
    }
    logger.info(loggingTags, `Spinnaker application = ${spinnakerApplication}, Spinnaker pipeline = ${spinnakerPipeline}`);

    if (process.env.NODE_ENV !== 'TEST' && process.env.NODE_ENV !== 'TEST_LOCAL_MONGO') {
      await triggerSpinnakerPipelineExecution(
        spinnakerApplication,
        spinnakerPipeline,
        {
          parameters: {
            ENV_NAME: testEnvironment.name,
          },
        },
      );
      logger.info(loggingTags, `Schedule entity with name: ${testEnvironment.name} has kicked off the refresh flow.`);
    }
    return true;
  };
}

module.exports = { makeKickOffSpinnakerFlow };
