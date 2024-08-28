const expect = require('expect');

const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { sortTestEnvironmentsByVersion } = require('../../use-cases');

describe('Unit Test: (Test Environment service) sort test environments by version', () => {
  it('the first environment should be the newest', () => {
    const fakeTestEnvironments = [
      makeFakeTestEnvironment({
        name: 'env_1_ID',
        status: 'Standby',
        properties: { version: '1.2.0' },
      }),
      makeFakeTestEnvironment({
        name: 'env_2_ID',
        status: 'Available',
        properties: { version: '1.1.1' },
      }),
      makeFakeTestEnvironment({
        name: 'env_3_ID',
        status: 'Available',
        properties: { version: '1.3.0' },
      }),
    ];
    const sortedFakeTestEnvironments = sortTestEnvironmentsByVersion(fakeTestEnvironments);
    expect(sortedFakeTestEnvironments[0].name).toBe('env_3_ID');
    expect(sortedFakeTestEnvironments[2].name).toBe('env_2_ID');
  });

  it('it sorts semver versions correctly', () => {
    const fakeTestEnvironments = [
      makeFakeTestEnvironment({
        name: 'env_1_ID',
        status: 'Standby',
        properties: { version: '1.1.0-473' },
      }),
      makeFakeTestEnvironment({
        name: 'env_2_ID',
        status: 'Available',
        properties: { version: '1.1.0-490' },
      }),
      makeFakeTestEnvironment({
        name: 'env_3_ID',
        status: 'Available',
        properties: { version: '1.1.0-473' },
      }),
      makeFakeTestEnvironment({
        name: 'env_4_ID',
        status: 'Available',
        properties: { version: '1.1.0-471' },
      }),
    ];
    const sortedFakeTestEnvironments = sortTestEnvironmentsByVersion(fakeTestEnvironments);
    expect(sortedFakeTestEnvironments[0].name).toBe('env_2_ID');
    expect(sortedFakeTestEnvironments[3].name).toBe('env_4_ID');
  });

  it('it handles invalid versions', () => {
    const fakeTestEnvironments = [
      makeFakeTestEnvironment({
        name: 'env_1_ID',
        status: 'Standby',
        properties: { version: 'as' },
      }),
      makeFakeTestEnvironment({
        name: 'env_2_ID',
        status: 'Available',
        properties: { version: '1.1.0-490' },
      }),
      makeFakeTestEnvironment({
        name: 'env_3_ID',
        status: 'Available',
        properties: { version: '1.1.0-471' },
      }),
    ];
    expect(() => sortTestEnvironmentsByVersion(fakeTestEnvironments)).toThrow('One or more of the passed environments version has invalid semver syntax');
  });

  it('it handles an empty array', () => {
    const fakeTestEnvironments = [];
    expect(() => sortTestEnvironmentsByVersion(fakeTestEnvironments)).toThrow('No test environments passed, unable to sort by version');
  });

  it('it handles when no test environments are passed in', () => {
    expect(() => sortTestEnvironmentsByVersion()).toThrow('No test environments passed, unable to sort by version');
  });
});
