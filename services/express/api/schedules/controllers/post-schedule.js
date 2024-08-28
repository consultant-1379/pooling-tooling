function makePostSchedule(createSchedule, schedulesDb, logger) {
  return async function postSchedule(httpRequest) {
    const { ...scheduleInfo } = httpRequest.body;

    const loggingTags = {
      req: httpRequest,
      service: 'Schedules (controller)',
      action: 'postSchedule',
    };

    try {
      const scheduleWithSameName = await schedulesDb.findBySearchQuery({ scheduleName: httpRequest.body.scheduleName }, 'schedules');

      const createdSchedule = createSchedule(scheduleWithSameName, scheduleInfo);

      const postedSchedule = await schedulesDb.insert(createdSchedule, 'schedules');

      logger.info(loggingTags, `POST request to update Schedule object with name:${httpRequest.body.scheduleName}.`);

      return postedSchedule;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };

      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}: ${error.message}`,
      );

      throw error;
    }
  };
}

module.exports = { makePostSchedule };
