const { dbOperator } = require('../../../data-access');
const httpServer = require('../../../server');
const logger = require('../../../logger/logger');

const { makeGetSchedules } = require('./get-schedules');
const { makePostSchedule } = require('./post-schedule');
const { makeGetSchedulesBasedOnType } = require('./get-schedules-based-on-type');
const { makeKickOffAutoRefreshForPoolsBasedOnSchedule } = require('./kick-off-auto-refresh-for-pools-based-on-schedule');
const { makeKickOffAutoRefreshForTestEnvironmentsBasedOnSchedule } = require('./kick-off-auto-refresh-for-test-environments-based-on-schedule');
const { makeKickOffAutoTriggerForPoolsBasedOnSchedule } = require('./kick-off-auto-trigger-for-pools-based-on-schedule');
const { makeKickOffAutoTriggerForTestEnvironmentsBasedOnSchedule } = require('./kick-off-auto-trigger-for-test-environments-based-on-schedule');
const { makeGetScheduleByName } = require('./get-schedule-by-name');
const { makePatchSchedule } = require('./patch-schedule');
const { makeDeleteSchedule } = require('./delete-schedule');

const { getTestEnvironment } = require('../../test-environments/controllers');
const { getPoolById } = require('../../pools/controllers');
const { determineTestEnvironmentsToBeRefreshed } = require('../use-cases');
const { getSortedEiapVersions } = require('../../../rptCron/use-cases');

const {
  createNewSchedule,
  kickOffSpinnakerFlow,
  updateSchedule,
} = require('../use-cases');

const getSchedules = makeGetSchedules(dbOperator, logger);
const postSchedule = makePostSchedule(createNewSchedule, dbOperator, logger);
const getSchedulesBasedOnType = makeGetSchedulesBasedOnType(dbOperator, logger);

const kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule = makeKickOffAutoRefreshForTestEnvironmentsBasedOnSchedule(
  getTestEnvironment, kickOffSpinnakerFlow, logger,
);
const kickOffAutoRefreshForPoolsBasedOnSchedule = makeKickOffAutoRefreshForPoolsBasedOnSchedule(
  getPoolById, determineTestEnvironmentsToBeRefreshed, getTestEnvironment, logger, kickOffSpinnakerFlow, getSortedEiapVersions,
);
const kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule = makeKickOffAutoTriggerForTestEnvironmentsBasedOnSchedule(
  getTestEnvironment, kickOffSpinnakerFlow, logger,
);
const kickOffAutoTriggerForPoolsBasedOnSchedule = makeKickOffAutoTriggerForPoolsBasedOnSchedule(
  getPoolById, getTestEnvironment, logger, kickOffSpinnakerFlow,
);

const getScheduleByName = makeGetScheduleByName(dbOperator, logger);
const patchSchedule = makePatchSchedule(updateSchedule, dbOperator, httpServer, logger);
const deleteSchedule = makeDeleteSchedule(dbOperator, logger);

const scheduleController = Object.freeze({
  getSchedules,
  postSchedule,
  getSchedulesBasedOnType,
  kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule,
  kickOffAutoRefreshForPoolsBasedOnSchedule,
  kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule,
  kickOffAutoTriggerForPoolsBasedOnSchedule,
  getScheduleByName,
  patchSchedule,
  deleteSchedule,
});

module.exports = {
  scheduleController,
  getSchedules,
  postSchedule,
  getSchedulesBasedOnType,
  kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule,
  kickOffAutoRefreshForPoolsBasedOnSchedule,
  kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule,
  kickOffAutoTriggerForPoolsBasedOnSchedule,
  getScheduleByName,
  patchSchedule,
  deleteSchedule,
};
