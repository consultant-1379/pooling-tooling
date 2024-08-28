require('../../config/config');

const faker = require('faker');
const cuid = require('cuid');

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

function makeFakeSchedule(overrides) {
  const validTypesOfItemsToSchedule = ['pool', 'test-environment'];
  const validSpinnakerPipelineApplicationName = ['thunderbeetest'];
  const validSpinnakerPipelineName = ['Fake_Test_Refresh_Flow_Fake'];
  const validScheduleTypes = ['auto-refresh', 'auto-trigger'];
  const validCronSchedules = ['*/15 * * * *', '0 */2 * * *', '0 3 * * *'];
  const validProjectAreas = ['pso', 'release', 'aas', 'autoapp'];
  const schedule = {
    id: Id.makeId(),
    scheduleName: faker.name.findName(),
    scheduleEnabled: true,
    typeOfItemsToSchedule: faker.random.arrayElement(validTypesOfItemsToSchedule),
    refreshData: {
      spinnakerPipelineApplicationName: faker.random.arrayElement(validSpinnakerPipelineApplicationName),
      spinnakerPipelineName: faker.random.arrayElement(validSpinnakerPipelineName),
      itemsToScheduleIds: [
        Id.makeId(),
        Id.makeId(),
      ],
    },
    retentionPolicyData: {
      retentionPolicyEnabled: false,
      numOfStanbyEnvsToBeRetained: 0,
      numOfEiapReleaseForComparison: 0,
    },
    scheduleOptions: {
      scheduleType: faker.random.arrayElement(validScheduleTypes),
      cronSchedule: faker.random.arrayElement(validCronSchedules),
      projectArea: faker.random.arrayElement(validProjectAreas),
    },
    createdOn: new Date(Date.now()),
    modifiedOn: new Date(Date.now()),
  };

  return {
    ...schedule,
    ...overrides,
  };
}

module.exports = { makeFakeSchedule };
