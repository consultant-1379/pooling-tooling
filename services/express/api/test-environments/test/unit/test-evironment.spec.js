const expect = require('expect');

const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeTestEnvironment } = require('../../entities');

describe('Unit Test: (Test Environment service) Test Environment entity', () => {
  it('must create a test environment successfully', () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const createdTestEnvironment = makeTestEnvironment(fakeTestEnvironment);
    expect(createdTestEnvironment.getId()).toBe(fakeTestEnvironment.id);
    expect(createdTestEnvironment.getName()).toBe(fakeTestEnvironment.name);
    expect(createdTestEnvironment.getStatus()).toBe(fakeTestEnvironment.status);
    expect(createdTestEnvironment.getRequestId()).toBe(fakeTestEnvironment.requestId);
    expect(createdTestEnvironment.getPools()).toBe(fakeTestEnvironment.pools);
    expect(createdTestEnvironment.getProperties()).toBe(fakeTestEnvironment.properties);
    expect(createdTestEnvironment.getStage()).toBe(fakeTestEnvironment.stage);
    expect(createdTestEnvironment.getAdditionalInfo()).toBe(fakeTestEnvironment.additionalInfo);
    expect(createdTestEnvironment.getComments()).toBe(fakeTestEnvironment.comments);
    expect(createdTestEnvironment.getCreatedOn()).toBe(fakeTestEnvironment.createdOn);
    expect(createdTestEnvironment.getModifiedOn()).toBe(fakeTestEnvironment.modifiedOn);
  });

  it('must not create a test environment with an invalid ID', () => {
    const testEnvironmentInvalidId = makeFakeTestEnvironment({ id: 'invalid' });
    expect(() => makeTestEnvironment(testEnvironmentInvalidId)).toThrow('Test Environment entity must have a valid id.');
    const testEnvironmentNoId = makeFakeTestEnvironment({ id: null });
    expect(() => makeTestEnvironment(testEnvironmentNoId)).toThrow('Test Environment entity must have a valid id.');
  });

  it('must not create a test environment without a pool', () => {
    const testEnvironmentInvalidId = makeFakeTestEnvironment({ pools: [] });
    const expectedErrorMessage = 'No pools were provided when making test environment';
    expect(() => makeTestEnvironment(testEnvironmentInvalidId)).toThrow(expectedErrorMessage);
  });

  it('must not create a test environment without all required properties', () => {
    const expectedErrorMessage = 'When making a test environment, not every required parameter was provided.';
    let fakeTestEnvironment = makeFakeTestEnvironment({ name: null });
    expect(() => makeTestEnvironment(fakeTestEnvironment)).toThrow(expectedErrorMessage);
    fakeTestEnvironment = makeFakeTestEnvironment({ status: null });
    expect(() => makeTestEnvironment(fakeTestEnvironment)).toThrow(expectedErrorMessage);
    fakeTestEnvironment = makeFakeTestEnvironment({ properties: null });
    expect(() => makeTestEnvironment(fakeTestEnvironment)).toThrow(expectedErrorMessage);
  });

  it('must not create a test environment with an invalid status', () => {
    const expectedErrorMessage = 'Invalid status \'invalidStatus\' provided when making test environment';
    const fakeTestEnvironment = makeFakeTestEnvironment({ status: 'invalidStatus' });
    expect(() => makeTestEnvironment(fakeTestEnvironment)).toThrow(expectedErrorMessage);
  });

  it('must not create a test environment with an invalid property', () => {
    const expectedErrorMessage = 'Invalid test environment properties provided when making request';
    const fakeTestEnvironment = makeFakeTestEnvironment();
    delete fakeTestEnvironment.properties.product;
    expect(() => makeTestEnvironment(fakeTestEnvironment)).toThrow(expectedErrorMessage);
  });
});
