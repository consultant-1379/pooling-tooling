require('../../config/config');

const faker = require('faker');
const cuid = require('cuid');

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

function makeFakeTestEnvironment(overrides) {
  const validStatusOptions = ['Available', 'Reserved', 'Quarantine', 'Standby', 'Refreshing'];
  const randomStatus = faker.random.arrayElement(validStatusOptions);
  const testEnvironment = {
    id: Id.makeId(),
    name: faker.name.findName(),
    status: randomStatus,
    requestId: Id.makeId(),
    pools: [faker.name.findName()],
    properties: {
      product: faker.lorem.word(1),
      platformType: faker.lorem.word(1),
      version: faker.lorem.words(1),
      ccdVersion: faker.lorem.words(1),
    },
    priorityInfo: {
      viewIndices: {
        testEnvironmentViewIndex: faker.datatype.number(0, 100),
        Pool: faker.datatype.number(0, 100),
      },
    },
    stage: faker.name.findName(),
    additionalInfo: faker.lorem.words(10),
    comments: faker.lorem.words(10),
    createdOn: new Date(Date.now()),
    modifiedOn: new Date(Date.now()),
  };

  if (overrides && overrides.properties) {
    overrides.properties = { ...testEnvironment.properties, ...overrides.properties };
  }

  return {
    ...testEnvironment,
    ...overrides,
  };
}

module.exports = { makeFakeTestEnvironment };
