function makeKickOffAutoTriggerSchedules(getSchedulesBasedOnType, determineSchedulesToRunBasedOnTime,
  kickOffAutoTriggerForPoolsBasedOnSchedule, kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule, logger) {
  return async function kickOffSpinnakerPipelineSchedules() {
    const loggingTags = {
      req: {},
      res: {},
      service: 'RPT Cron (controller)',
      action: 'Kick off auto trigger schedules',
    };
    try {
      const spinnakerPipelineSchedules = await getSchedulesBasedOnType({ params: { typeOfItemsToSchedule: 'auto-trigger' } });
      const schedulesAtCurrentTime = determineSchedulesToRunBasedOnTime(spinnakerPipelineSchedules);
      for (const schedule of schedulesAtCurrentTime) {
        if (schedule.scheduleEnabled) {
          if (schedule.typeOfItemsToSchedule === 'test-environment') {
            await kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule(schedule);
          } else if (schedule.typeOfItemsToSchedule === 'pool') {
            await kickOffAutoTriggerForPoolsBasedOnSchedule(schedule);
          }
        }
      }
      logger.info(
        loggingTags,
        `Kicking off auto trigger schedules. Schedules kicked off: ${schedulesAtCurrentTime.length}`,
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

module.exports = { makeKickOffAutoTriggerSchedules };
