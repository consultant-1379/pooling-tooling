function makeKickOffAutoRefreshSchedules(getSchedulesBasedOnType, determineSchedulesToRunBasedOnTime,
  kickOffAutoRefreshForPoolsBasedOnSchedule, kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule, logger) {
  return async function kickOffAutoRefreshSchedules() {
    const loggingTags = {
      req: {},
      res: {},
      service: 'RPT Cron (controller)',
      action: 'Kick off auto refresh schedules',
    };
    try {
      const autoRefreshSchedules = await getSchedulesBasedOnType({ params: { typeOfItemsToSchedule: 'auto-refresh' } });
      const schedulesAtCurrentTime = determineSchedulesToRunBasedOnTime(autoRefreshSchedules);
      for (const schedule of schedulesAtCurrentTime) {
        if (schedule.scheduleEnabled) {
          if (schedule.typeOfItemsToSchedule === 'test-environment') {
            await kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule(schedule);
          } else if (schedule.typeOfItemsToSchedule === 'pool') {
            await kickOffAutoRefreshForPoolsBasedOnSchedule(schedule);
          }
        }
      }
      logger.info(
        loggingTags,
        `Kicking off auto refresh schedules. Schedules kicked off: ${schedulesAtCurrentTime.length}`,
      );
      return true;
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

module.exports = { makeKickOffAutoRefreshSchedules };
