const { makeFakeRequest } = require('../../__test__/fixtures/request.spec.js');
const { makeFakePool } = require('../../__test__/fixtures/pool.spec.js');

const { dbOperator } = require('../../data-access');

async function testSetup() {
  const fakeRequest = makeFakeRequest();
  const fakePool = makeFakePool({ poolName: 'myPool' });

  await dbOperator.insert(fakeRequest, 'requests');
  await dbOperator.insert(fakePool, 'pools');

  return {
    requests: [fakeRequest],
  };
}

module.exports = { testSetup };
