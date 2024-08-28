const { makeKickOffAutoRefreshSchedules } = require('./kick-off-auto-refresh-schedules');
const { makeKickOffAutoRemoveOldRequests } = require('./kick-off-auto-remove-old-requests');
const { makeKickOffAutoTriggerSchedules } = require('./kick-off-auto-trigger-schedules');

const {
  getSchedulesBasedOnType,
  kickOffAutoRefreshForPoolsBasedOnSchedule,
  kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule,
  kickOffAutoTriggerForPoolsBasedOnSchedule,
  kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule,
} = require('../../api/schedules/controllers');

const { determineSchedulesToRunBasedOnTime } = require('../../api/schedules/use-cases');

const logger = require('../../logger/logger');
const { dbOperator } = require('../../data-access');

const kickOffAutoRefreshSchedules = makeKickOffAutoRefreshSchedules(getSchedulesBasedOnType,
  determineSchedulesToRunBasedOnTime, kickOffAutoRefreshForPoolsBasedOnSchedule, kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule, logger);

const kickOffAutoTriggerSchedules = makeKickOffAutoTriggerSchedules(getSchedulesBasedOnType,
  determineSchedulesToRunBasedOnTime, kickOffAutoTriggerForPoolsBasedOnSchedule, kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule, logger);

const kickOffAutoRemoveOldRequests = makeKickOffAutoRemoveOldRequests(logger, dbOperator);

const cronService = Object.freeze({
  kickOffAutoRefreshSchedules,
  kickOffAutoRemoveOldRequests,
  kickOffAutoTriggerSchedules,
});

module.exports = {
  cronService,
  kickOffAutoRefreshSchedules,
  kickOffAutoRemoveOldRequests,
  kickOffAutoTriggerSchedules,
};
