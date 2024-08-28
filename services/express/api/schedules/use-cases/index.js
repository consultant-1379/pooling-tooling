const cronParser = require('cron-parser');
const { compare } = require('compare-versions');
const semverValid = require('semver/functions/valid');

const { makeCreateSchedule } = require('./create-schedule');
const { makeUpdateSchedule } = require('./update-schedule');
const { makeGetCurrentTimeFormatted } = require('./get-current-time-formatted');
const { makeDetermineSchedulesToRunBasedOnTime } = require('./determine-schedules-to-run-based-on-time');
const { makeKickOffSpinnakerFlow } = require('./kick-off-spinnaker-flow');

const { makeDetermineTestEnvironmentsToBeRefreshed } = require('./determine-test-environments-to-be-refreshed');
const { getTestEnvironment } = require('../../test-environments/controllers');
const { makeSortElements } = require('../../../utilities/sort-elements');
const { getSortedEiapVersions } = require('../../../rptCron/use-cases');

const { makeSchedule } = require('../entities');
const { useSpinnakerApiService } = require('../../../spinnaker/use-cases');
const logger = require('../../../logger/logger');
const { flattenObject } = require('../../../utilities');

const createNewSchedule = makeCreateSchedule(makeSchedule, logger);
const updateSchedule = makeUpdateSchedule(logger, flattenObject);
const getCurrentTimeFormatted = makeGetCurrentTimeFormatted();
const determineSchedulesToRunBasedOnTime = makeDetermineSchedulesToRunBasedOnTime(getCurrentTimeFormatted, cronParser, logger);
const kickOffSpinnakerFlow = makeKickOffSpinnakerFlow(useSpinnakerApiService.triggerPipelineExecution, logger);

const sortElements = makeSortElements();
const determineTestEnvironmentsToBeRefreshed = makeDetermineTestEnvironmentsToBeRefreshed(getTestEnvironment, semverValid, compare,
  sortElements, getSortedEiapVersions, logger);

const scheduleService = Object.freeze({
  createNewSchedule,
  updateSchedule,
  getCurrentTimeFormatted,
  determineSchedulesToRunBasedOnTime,
  kickOffSpinnakerFlow,
  determineTestEnvironmentsToBeRefreshed,
});

module.exports = {
  scheduleService,
  createNewSchedule,
  updateSchedule,
  getCurrentTimeFormatted,
  determineSchedulesToRunBasedOnTime,
  kickOffSpinnakerFlow,
  determineTestEnvironmentsToBeRefreshed,
};
