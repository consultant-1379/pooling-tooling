const { makeFakePool } = require('../../__test__/fixtures/pool.spec.js');

const { dbOperator } = require('../../data-access');

async function testSetup() {
  const fakePool = makeFakePool({
    assignedTestEnvironmentIds: [],
  });

  await dbOperator.insert(fakePool, 'pools');

  return {
    pools: [fakePool],
  };
}

module.exports = { testSetup };
