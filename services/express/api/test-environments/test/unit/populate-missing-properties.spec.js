const expect = require('expect');

const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makePopulateMissingProperties } = require('../../entities/populate-missing-properties');

describe('Unit Test: (Test Environment service) Check and update if test environment is missing any key use-case ', () => {
  it('should return the data to patch to test environment (property object not sent in httpRequest)', () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const fakeHttpRequest = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        id: fakeTestEnvironment.id,
      },
      body: {
        status: fakeTestEnvironment.status,
        requestId: fakeTestEnvironment.requestId,
      },
    };

    const checkTestEnvironmentIsMissingAnyKey = makePopulateMissingProperties();

    const response = checkTestEnvironmentIsMissingAnyKey(fakeTestEnvironment, fakeHttpRequest);
    const expectedResponse = {
      id: fakeTestEnvironment.id,
      status: fakeTestEnvironment.status,
      requestId: fakeTestEnvironment.requestId,
      properties: {
        product: fakeTestEnvironment.properties.product,
        platformType: fakeTestEnvironment.properties.platformType,
        version: fakeTestEnvironment.properties.version,
        ccdVersion: fakeTestEnvironment.properties.ccdVersion,
      },
    };
    expect(response).toEqual(expectedResponse);
  });
  it('should return the data to patch to test environment (property object sent in httpRequest)', () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const fakeHttpRequest = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        id: fakeTestEnvironment.id,
      },
      body: {
        status: fakeTestEnvironment.status,
        requestId: fakeTestEnvironment.requestId,
        properties: {
          product: 'testProduct',
          platformType: 'testplatformType',
          version: 'testVersion',
          ccdVersion: fakeTestEnvironment.properties.ccdVersion,
        },
      },
    };

    const checkTestEnvironmentIsMissingAnyKey = makePopulateMissingProperties();
    const response = checkTestEnvironmentIsMissingAnyKey(fakeTestEnvironment, fakeHttpRequest);

    const expectedResponse = {
      id: fakeTestEnvironment.id,
      status: fakeTestEnvironment.status,
      requestId: fakeTestEnvironment.requestId,
      properties: {
        product: 'testProduct',
        platformType: 'testplatformType',
        version: 'testVersion',
        ccdVersion: fakeTestEnvironment.properties.ccdVersion,
      },
    };
    expect(response).toEqual(expectedResponse);
  });
  it('should fail if the property is not in the array. (If it fails, ensure to update \'requiredTestEnvironmentPropertiesObject\' array in use-case as well)', () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();

    const requiredTestEnvironmentPropertiesObject = {
      product: 'default_product',
      platformType: 'default_platformType',
      version: 'default_version',
      ccdVersion: 'default_cddVersion',
    };

    const keysInPropertiesObject = Object.keys(requiredTestEnvironmentPropertiesObject);
    const keysInFakeTestEnvironmentProperties = Object.keys(fakeTestEnvironment.properties);
    const property = keysInFakeTestEnvironmentProperties.filter((key) => !keysInPropertiesObject.includes(key));

    expect(property.length).toEqual(0);
  });
});
