function makeKickOffAutoRefreshForTestEnvironmentsBasedOnSchedule(
  getTestEnvironmentById,
  kickOffSpinnakerFlow,
  logger,
) {
  return async function kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule(
    schedule,
  ) {
    const loggingTags = {
      req: {},
      res: {},
      service: 'Schedules (controller)',
      action: 'kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule',
      actionParameters: {},
    };
    for (const testEnvironmentToBeRefreshedId of schedule.refreshData
      .itemsToScheduleIds) {
      try {
        const [testEnvironment] = await getTestEnvironmentById({
          params: { id: testEnvironmentToBeRefreshedId },
        });
        await kickOffSpinnakerFlow(
          testEnvironment,
          schedule.refreshData.spinnakerPipelineApplicationName,
          schedule.refreshData.spinnakerPipelineName,
        );
        logger.info(
          loggingTags,
          `Test environment refresh. Refreshing test environment with ID :${testEnvironmentToBeRefreshedId}.`,
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

module.exports = { makeKickOffAutoRefreshForTestEnvironmentsBasedOnSchedule };
