const expect = require('expect');

const { makeUpdateViewIndices } = require('../../use-cases/update-view-indices-for-delete');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Update view indices for delete use case', () => {
  it('mocks the update of a test environment view indices for delete', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({ priorityInfo: { viewIndices: { testEnvironmentViewIndex: 0, pool: 0 } } });
    const fakeTestEnvironmentTwo = makeFakeTestEnvironment({ priorityInfo: { viewIndices: { testEnvironmentViewIndex: 1, pool: 1 } } });
    const fakeTestEnvironmentThree = makeFakeTestEnvironment({ priorityInfo: { viewIndices: { testEnvironmentViewIndex: 2, pool: 2 } } });
    const updateViewIndices = makeUpdateViewIndices();

    const updatedTestEnvironments = updateViewIndices([fakeTestEnvironmentOne, fakeTestEnvironmentTwo, fakeTestEnvironmentThree], 'testEnvironmentViewIndex', 1);

    expect(updatedTestEnvironments[0].priorityInfo.viewIndices.testEnvironmentViewIndex).toEqual(0);
    expect(updatedTestEnvironments[1].priorityInfo.viewIndices.testEnvironmentViewIndex).toEqual(0);
    expect(updatedTestEnvironments[2].priorityInfo.viewIndices.testEnvironmentViewIndex).toEqual(1);
  });

  it('mocks the update of a test environment pool view indices for delete', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({ priorityInfo: { viewIndices: { testEnvironmentViewIndex: 0, pool: 0 } } });
    const fakeTestEnvironmentTwo = makeFakeTestEnvironment({ priorityInfo: { viewIndices: { testEnvironmentViewIndex: 1, pool: 1 } } });
    const fakeTestEnvironmentThree = makeFakeTestEnvironment({ priorityInfo: { viewIndices: { testEnvironmentViewIndex: 2, pool: 2 } } });
    const updateViewIndices = makeUpdateViewIndices();

    const updatedTestEnvironments = updateViewIndices([fakeTestEnvironmentOne, fakeTestEnvironmentTwo, fakeTestEnvironmentThree], 'pool', 1);

    expect(updatedTestEnvironments[0].priorityInfo.viewIndices.pool).toEqual(0);
    expect(updatedTestEnvironments[1].priorityInfo.viewIndices.pool).toEqual(0);
    expect(updatedTestEnvironments[2].priorityInfo.viewIndices.pool).toEqual(1);
  });
});
