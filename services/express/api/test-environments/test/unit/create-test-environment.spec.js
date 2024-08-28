const expect = require('expect');

const { makeCreateTestEnvironment } = require('../../use-cases/create-test-environment');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Create test environment use case', () => {
  it('must throw the appropriate error if testEnvironmentInfo is empty', () => {
    const fakeTestEnvironment = null;
    const createTestEnvironment = makeCreateTestEnvironment(
      () => true,
      { info: () => 'Test log', error: () => 'Test error log' },
    );
    expect(() => createTestEnvironment([fakeTestEnvironment], fakeTestEnvironment)).toThrow(
      'Test Environment information is empty',
    );
  });

  it('must throw the appropriate error if test environment already exists', () => {
    const fakeTestEnvironmentName = 'cluster1';
    const fakeTestEnvironment = makeFakeTestEnvironment({ name: fakeTestEnvironmentName });
    const createTestEnvironment = makeCreateTestEnvironment(
      () => true,
      { info: () => 'Test log', error: () => 'Test error log' },
    );
    expect(() => createTestEnvironment([fakeTestEnvironment], fakeTestEnvironment)).toThrow(
      `A test environment named ${fakeTestEnvironmentName} already exists. Not creating new test environment.`,
    );
  });

  it('mocks the creation of a test environment', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const fakeCreatedTestEnvironment = Object.freeze({
      getId: () => fakeTestEnvironment.id,
      getName: () => fakeTestEnvironment.name,
      getStatus: () => fakeTestEnvironment.status,
      getRequestId: () => fakeTestEnvironment.requestId,
      getPools: () => fakeTestEnvironment.pools,
      getProperties: () => fakeTestEnvironment.properties,
      getPriorityInfo: () => fakeTestEnvironment.priorityInfo,
      getStage: () => fakeTestEnvironment.stage,
      getAdditionalInfo: () => fakeTestEnvironment.additionalInfo,
      getComments: () => fakeTestEnvironment.comments,
      getCreatedOn: () => new Date(fakeTestEnvironment.createdOn),
      getModifiedOn: () => new Date(fakeTestEnvironment.modifiedOn),
    });
    const createTestEnvironment = makeCreateTestEnvironment(
      () => fakeCreatedTestEnvironment,
      { info: () => 'Test log', error: () => 'Test error log' },
    );

    const createdTestEnvironment = await createTestEnvironment([], fakeTestEnvironment);

    expect(createdTestEnvironment).toEqual(fakeTestEnvironment);
  });
});
