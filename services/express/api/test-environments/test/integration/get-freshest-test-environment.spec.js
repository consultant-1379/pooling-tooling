const expect = require('expect');

const { getFreshestTestEnvironment } = require('../../controllers');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Test Environment service) Get freshest test environment controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
  it('successfully gets the freshest test environment when passed an httpRequest', async () => {
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ properties: { version: '0.0.9' } });
    const fakeTestEnvironment2 = makeFakeTestEnvironment({ properties: { version: '3.82.157' } });
    const fakeTestEnvironment3 = makeFakeTestEnvironment({ properties: { version: '2.118.3' } });
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment2, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment3, 'testEnvironments');

    const idString = `${fakeTestEnvironment1.id},${fakeTestEnvironment2.id},${fakeTestEnvironment3.id}`;

    const fakeHttpRequest = {
      params: {
        ids: idString,
      },
    };

    const freshestTestEnvironment = await getFreshestTestEnvironment(fakeHttpRequest);
    expect(freshestTestEnvironment).toEqual(fakeTestEnvironment2);
  });

  it('successfully gets the freshest test environment when passed an array of ids', async () => {
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ properties: { version: '0.0.9' } });
    const fakeTestEnvironment2 = makeFakeTestEnvironment({ properties: { version: '3.82.157' } });
    const fakeTestEnvironment3 = makeFakeTestEnvironment({ properties: { version: '2.118.3' } });
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment2, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment3, 'testEnvironments');

    const arrayOfIds = [fakeTestEnvironment1.id, fakeTestEnvironment2.id, fakeTestEnvironment3.id];

    const freshestTestEnvironment = await getFreshestTestEnvironment(arrayOfIds);
    expect(freshestTestEnvironment).toEqual(fakeTestEnvironment2);
  });

  it('should return one of multiple test environments having the same (freshest) version', async () => {
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ properties: { version: '0.0.9' } });
    const fakeTestEnvironment2 = makeFakeTestEnvironment({ properties: { version: '3.82.157' } });
    const fakeTestEnvironment3 = makeFakeTestEnvironment({ properties: { version: '2.118.3' } });
    const fakeTestEnvironment4 = makeFakeTestEnvironment({ properties: { version: '3.82.157' } });
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment2, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment3, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment4, 'testEnvironments');

    const idString = `${fakeTestEnvironment1.id},${fakeTestEnvironment2.id},${fakeTestEnvironment3.id},\
      ${fakeTestEnvironment4.id}`;

    const fakeHttpRequest = {
      params: {
        ids: idString,
      },
    };

    const validTestEnvironments = [];
    validTestEnvironments.push(fakeTestEnvironment2);
    validTestEnvironments.push(fakeTestEnvironment4);

    const freshestTestEnvironment = await getFreshestTestEnvironment(fakeHttpRequest);
    expect(validTestEnvironments).toContainEqual(freshestTestEnvironment);
    expect([freshestTestEnvironment].length).toEqual(1);
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
});
