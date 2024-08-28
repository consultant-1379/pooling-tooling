const expect = require('expect');

const {
  makeUpdateTestEnvironment,
} = require('../../use-cases/update-test-environment');
const {
  makeFakeTestEnvironment,
} = require('../../../../__test__/fixtures/test-environment.spec.js');

const { flattenObject } = require('../../../../utilities');

describe('Unit Test: (Test Environment service) Update test environment use case', () => {
  it('mocks the update of a test environment', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const updateTestEnvironment = makeUpdateTestEnvironment({
      info: () => 'Test log',
      error: () => 'Test error log',
    }, flattenObject);
    const testChanges = {
      requestId: 'abc',
      createdOn: 'test',
      id: '222',
      status: 'test',
    };
    const updatedTestEnvironment = await updateTestEnvironment(
      {},
      fakeTestEnvironment,
      testChanges,
    ).$set;

    expect(updatedTestEnvironment.requestId).toEqual('abc');
    expect(new Date(updatedTestEnvironment.modifiedOn)).toBeTruthy();
    expect(updatedTestEnvironment.createdOn).toBeFalsy();
    expect(updatedTestEnvironment.id).toBeFalsy();
    expect(updatedTestEnvironment.status).toEqual('test');
  });

  it('should throw an error if no test environment is found', async () => {
    const expectedErrorMessage = 'Test Environment not found';

    const updateTestEnvironment = makeUpdateTestEnvironment({
      info: () => 'Test log',
      error: (err) => err,
    }, flattenObject);
    try {
      await updateTestEnvironment([], null, { name: 'fakeName' });
    } catch (error) {
      expect(error.message).toEqual(expectedErrorMessage);
    }
  });

  it('should allow the update of test environment entity when the name is to be modified and there is no other test environment with that name', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ name: 'fakeName' });
    const fakeUpdatedTestEnvironment = Object.freeze({
      getId: () => fakeTestEnvironment.id,
      getName: () => 'fakeNameChanged',
      getStatus: () => fakeTestEnvironment.status,
      getRequestId: () => fakeTestEnvironment.requestId,
      getPools: () => fakeTestEnvironment.pools,
      getProperties: () => fakeTestEnvironment.properties,
      getPriorityInfo: () => fakeTestEnvironment.priorityInfo,
      getStage: () => fakeTestEnvironment.stage,
      getAdditionalInfo: () => fakeTestEnvironment.additionalInfo,
      getComments: () => fakeTestEnvironment.comments,
      getCreatedOn: () => fakeTestEnvironment.createdOn,
      getModifiedOn: () => fakeTestEnvironment.modifiedOn,
    });

    const updateTestEnvironment = makeUpdateTestEnvironment({
      info: () => 'Test log',
      error: () => 'Test error log',
    }, flattenObject);
    const updatedTestEnvironment = await updateTestEnvironment(
      [],
      fakeTestEnvironment,
      { name: 'fakeNameChanged' },
    ).$set;

    expect(updatedTestEnvironment.name).toEqual(
      fakeUpdatedTestEnvironment.getName(),
    );
  });
  it('should throw an error if the test environment name to be updated already exists in the database', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      id: 'fakeId1',
      name: 'fakeName',
    });
    const fakeAnotherTestEnvironment = makeFakeTestEnvironment({
      id: 'fakeId2',
      name: 'fakeAnotherName',
    });

    const expectedErrorMessage = `A test environment named ${fakeAnotherTestEnvironment.name} already exists. `
      + 'Can not update test environment with the same name.';

    const updateTestEnvironment = makeUpdateTestEnvironment({
      info: () => 'Test log',
      error: () => 'Test error log',
    }, flattenObject);
    try {
      await updateTestEnvironment(
        [fakeAnotherTestEnvironment],
        fakeTestEnvironment,
        { name: 'fakeAnotherName' },
      );
    } catch (error) {
      expect(error.message).toEqual(expectedErrorMessage);
    }
  });

  it('should flatten an object', async () => {
    const updateTestEnvironment = makeUpdateTestEnvironment({
      info: () => 'Test log',
      error: () => 'Test error log',
    }, flattenObject);
    const testValue = 'test';
    const testChanges = {
      id: '222',
      status: 'test',
      properties: {
        product: testValue,
        platformType: testValue,
        version: testValue,
      },
      priorityInfo: {
        viewIndices: {
          testEnvironmentViewIndex: 0,
          Pool: 0,
        },
      },
    };
    const updatedTestEnvironment = await updateTestEnvironment(
      {},
      {},
      testChanges,
    ).$set;
    expect(updatedTestEnvironment.properties).toBeFalsy();
    expect(updatedTestEnvironment['properties.product']).toEqual(testValue);
    expect(updatedTestEnvironment['properties.platformType']).toEqual(testValue);
    expect(updatedTestEnvironment['properties.version']).toEqual(testValue);
    expect(updatedTestEnvironment['properties.ccdVersion']).toBeFalsy();

    expect(updatedTestEnvironment.priorityInfo).toBeFalsy();
    expect(
      updatedTestEnvironment[
        'priorityInfo.viewIndices.testEnvironmentViewIndex'
      ],
    ).toEqual(0);
    expect(updatedTestEnvironment['priorityInfo.viewIndices.Pool']).toEqual(0);
    expect(updatedTestEnvironment['priorityInfo.viewIndices.testEnvironmentViewIndex']).toEqual(0);
  });
});
