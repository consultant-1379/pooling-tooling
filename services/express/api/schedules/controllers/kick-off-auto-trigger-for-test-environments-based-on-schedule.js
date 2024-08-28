function makeKickOffAutoTriggerForTestEnvironmentsBasedOnSchedule(
  getTestEnvironmentById,
  kickOffSpinnakerFlow,
  logger,
) {
  return async function kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule(
    schedule,
  ) {
    const loggingTags = {
      req: {},
      res: {},
      service: 'Schedules (controller)',
      action: 'kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule',
      actionParameters: {},
    };
    for (const testEnvironmentId of schedule.refreshData.itemsToScheduleIds) {
      try {
        const [testEnvironment] = await getTestEnvironmentById({
          params: { id: testEnvironmentId },
        });
        await kickOffSpinnakerFlow(
          testEnvironment,
          schedule.refreshData.spinnakerPipelineApplicationName,
          schedule.refreshData.spinnakerPipelineName,
        );
        logger.info(
          loggingTags,
          `Kicking off ${schedule.refreshData.spinnakerPipelineName} pipeline with test environment ${testEnvironment.name}.`,
        );
      } catch (error) {
        const errorInfo = {
          message: error.message,
        };
        logger.error(
          { errorInfo, loggingTags },
          `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
        );
      }
    }
    return true;
  };
}

module.exports = { makeKickOffAutoTriggerForTestEnvironmentsBasedOnSchedule };
