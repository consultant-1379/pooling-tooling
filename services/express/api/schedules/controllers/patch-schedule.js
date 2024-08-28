function makePatchSchedule(modifySchedule, scheduleDb, httpServer, logger) {
  return async function patchSchedule(httpRequest) {
    const changes = httpRequest.body;
    const { id } = httpRequest.params;
    const loggingTags = {
      req: httpRequest,
      changes: logger.logFormatter([changes]),
      service: 'Schedules (controller)',
      action: 'patchSchedule',
      actionParameters: { ScheduleId: id },
    };
    try {
      const existingSchedule = await scheduleDb.findById(id, 'schedules');
      loggingTags.old = logger.logFormatter([existingSchedule]);

      const scheduleChanges = modifySchedule(existingSchedule, changes);

      const updatedSchedule = await scheduleDb.findOneAndUpdate(
        'schedules',
        { _id: id },
        scheduleChanges,
      );
      loggingTags.res = logger.logFormatter([updatedSchedule]);

      if (httpServer.emitter) {
        httpServer.emitter.emit('scheduleEvent', `schedules table updated ${updatedSchedule.scheduleName} `);
      }

      logger.info(
        loggingTags,
        `PATCH request to update Schedule object with name: ${updatedSchedule.scheduleName}.`,
      );

      return updatedSchedule;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };
      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
      throw error;
    }
  };
}

module.exports = { makePatchSchedule };
