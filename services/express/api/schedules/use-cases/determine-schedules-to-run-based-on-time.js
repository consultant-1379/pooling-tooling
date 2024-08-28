function makeDetermineSchedulesToRunBasedOnTime(getCurrentTimeFormatted, cronParser, logger) {
  return function determineSchedulesToRunBasedOnTime(schedules) {
    const loggingTags = {
      req: {},
      res: {},
      service: 'Schedules (controller)',
      action: 'determineSchedulesToRunBasedOnTime',
    };
    try {
      const schedulesToRun = [];
      for (const schedule of schedules) {
        const interval = cronParser.parseExpression(schedule.scheduleOptions.cronSchedule);
        if (interval.prev().toISOString().substring(11, 16) === getCurrentTimeFormatted()) {
          schedulesToRun.push(schedule);
        }
      }
      const schedulesToRunString = schedulesToRun.map((schedule) => JSON.stringify(schedule));
      logger.info(loggingTags, `Schedules to Run: ${schedulesToRunString.join(', ')}`);
      return schedulesToRun;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };
      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
    }
  };
}

module.exports = { makeDetermineSchedulesToRunBasedOnTime };
