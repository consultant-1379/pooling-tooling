const { BadRequestError } = require('../../../interfaces/BadRequestError');

function buildMakeSchedule(IdGenerator, nodeCron) {
  return function makeSchedule({
    id = IdGenerator.makeId(),
    scheduleName,
    scheduleEnabled,
    typeOfItemsToSchedule,
    refreshData,
    retentionPolicyData,
    scheduleOptions,
    createdOn = new Date(Date.now()),
    modifiedOn = new Date(Date.now()),
  } = {}) {
    const requiredScheduleParameters = [scheduleName, scheduleEnabled, typeOfItemsToSchedule, refreshData, retentionPolicyData, scheduleOptions];
    const validTypeOfItemsToScheduleOptions = ['pool', 'test-environment'];

    if (!IdGenerator.isValidId(id)) {
      throw new BadRequestError('Schedule entity must have a valid id.');
    }

    if (!requiredScheduleParameters.every((element) => element || typeof element === 'boolean')) {
      throw new BadRequestError('When making a schedule, not every required parameter was provided.');
    }

    if (typeof scheduleEnabled !== 'boolean' || scheduleEnabled === null) {
      throw new BadRequestError('Invalid scheduleEnabled value provided when making schedule, please enter a boolean.');
    }

    if (!validTypeOfItemsToScheduleOptions.includes(typeOfItemsToSchedule)) {
      throw new BadRequestError(`Invalid typeOfItemsToSchedule ${typeOfItemsToSchedule} provided when making schedule.`);
    }

    if (typeof scheduleOptions !== 'object' || scheduleOptions === null
        || !Object.prototype.hasOwnProperty.call(scheduleOptions, 'scheduleType')
        || !Object.prototype.hasOwnProperty.call(scheduleOptions, 'cronSchedule')
        || !Object.prototype.hasOwnProperty.call(scheduleOptions, 'projectArea')) {
      throw new BadRequestError('Invalid scheduleOptions provided when making schedule.');
    }

    if (typeof refreshData !== 'object' || refreshData === null
        || !Object.prototype.hasOwnProperty.call(refreshData, 'spinnakerPipelineApplicationName')
        || !Object.prototype.hasOwnProperty.call(refreshData, 'spinnakerPipelineName')
        || !Object.prototype.hasOwnProperty.call(refreshData, 'itemsToScheduleIds')
    ) {
      throw new BadRequestError('Invalid refreshData provided when making schedule.');
    }

    for (const itemId of refreshData.itemsToScheduleIds) {
      if (!IdGenerator.isValidId(itemId)) {
        throw new BadRequestError(`Invalid ID ${itemId} provided in refreshData.itemsToScheduleIds. Please ensure all IDs are valid.`);
      }
    }

    if (typeof retentionPolicyData !== 'object' || retentionPolicyData === null
        || !Object.prototype.hasOwnProperty.call(retentionPolicyData, 'retentionPolicyEnabled')
        || typeof retentionPolicyData.retentionPolicyEnabled !== 'boolean') {
      throw new BadRequestError('Invalid retentionPolicyData provided when making schedule.');
    }

    if (retentionPolicyData.retentionPolicyEnabled) {
      if (!Object.prototype.hasOwnProperty.call(retentionPolicyData, 'numOfStanbyEnvsToBeRetained')
          || !Object.prototype.hasOwnProperty.call(retentionPolicyData, 'numOfEiapReleaseForComparison')) {
        throw new BadRequestError('Invalid input. numOfStanbyEnvsToBeRetained & numOfEiapReleaseForComparison required when retentionPolicyEnabled is true');
      }

      if (typeof retentionPolicyData.numOfStanbyEnvsToBeRetained !== 'number' || retentionPolicyData.numOfStanbyEnvsToBeRetained < 1) {
        throw new BadRequestError('Invalid input for numOfStanbyEnvsToBeRetained provided when making schedule. Must be a positive integer');
      }

      if (typeof retentionPolicyData.numOfEiapReleaseForComparison !== 'number' || retentionPolicyData.numOfEiapReleaseForComparison < 1) {
        throw new BadRequestError('Invalid input for numOfEiapReleaseForComparison provided when making schedule. Must be a positive integer');
      }
    }

    if (!nodeCron.validate(scheduleOptions.cronSchedule)) {
      throw new BadRequestError('The cronSchedule parameter passed into scheduleOptions must be in a valid crontab format.');
    }

    return Object.freeze({
      getId: () => id,
      getScheduleName: () => scheduleName,
      getScheduleEnabled: () => scheduleEnabled,
      getTypeOfItemsToSchedule: () => typeOfItemsToSchedule,
      getRefreshData: () => refreshData,
      getRetentionPolicyData: () => retentionPolicyData,
      getScheduleOptions: () => scheduleOptions,
      getCreatedOn: () => createdOn,
      getModifiedOn: () => modifiedOn,
    });
  };
}

module.exports = { buildMakeSchedule };
