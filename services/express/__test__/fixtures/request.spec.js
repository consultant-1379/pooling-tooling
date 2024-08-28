require('../../config/config');

const faker = require('faker');
const cuid = require('cuid');

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

function makeFakeRequest(overrides) {
  const validStatusOptions = ['Reserved', 'Unreserved', 'Pending', 'Queued', 'Timeout', 'Aborted'];
  const randomStatus = faker.random.arrayElement(validStatusOptions);
  const request = {
    id: Id.makeId(),
    testEnvironmentId: '',
    poolName: faker.name.findName(),
    requestorDetails: {
      name: faker.name.findName(),
      area: faker.name.findName(),
      executionId: '01FWP2EGGMTNKGK6KJ2G001ZZ4',
    },
    status: randomStatus,
    requestTimeout: 7200000,
    createdOn: new Date(Date.now()),
    modifiedOn: new Date(Date.now()),
  };

  return {
    ...request,
    ...overrides,
  };
}

module.exports = { makeFakeRequest };
