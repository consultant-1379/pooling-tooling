require('../../config/config');

const faker = require('faker');
const cuid = require('cuid');

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

function makeFakePool(overrides) {
  const pool = {
    id: Id.makeId(),
    assignedTestEnvironmentIds: [
      Id.makeId(),
      Id.makeId(),
    ],
    poolName: faker.name.findName(),
    creatorDetails: {
      name: faker.name.findName(),
      area: faker.name.findName(),
    },
    additionalInfo: faker.lorem.sentence(),
    createdOn: new Date(Date.now()),
    modifiedOn: new Date(Date.now()),
  };

  return {
    ...pool,
    ...overrides,
  };
}

module.exports = { makeFakePool };
