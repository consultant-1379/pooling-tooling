function makePopulateMissingProperties() {
  return function populateMissingProperties(testEnvironmentObject, httpRequest) {
    const propertiesObject = {};
    const testEnvironmentId = httpRequest.params;
    let testEnvironmentDataToEdit = {};

    const requiredTestEnvironmentPropertiesObject = {
      product: 'default_product',
      platformType: 'default_platformType',
      version: 'default_version',
      ccdVersion: 'default_ccdVersion',
    };
    const keysInTestEnvironmentObject = Object.keys(testEnvironmentObject.properties);

    const propertyKeys = Object.keys(requiredTestEnvironmentPropertiesObject).filter((key) => !keysInTestEnvironmentObject.includes(key));

    if (propertyKeys.length !== 0) {
      propertyKeys.forEach((key) => {
        propertiesObject[key] = requiredTestEnvironmentPropertiesObject[key];
      });
    }

    if (httpRequest.body.properties) {
      const keysInHttpRequestProperties = Object.keys(httpRequest.body.properties);

      keysInHttpRequestProperties.forEach((key) => {
        propertiesObject[key] = httpRequest.body.properties[key];
      });

      delete httpRequest.body.properties;

      const { ...testEnvironmentInfo } = httpRequest.body;
      testEnvironmentDataToEdit = {
        ...testEnvironmentId,
        ...testEnvironmentInfo,
        properties: propertiesObject,
      };
    } else {
      keysInTestEnvironmentObject.forEach((key) => {
        propertiesObject[key] = testEnvironmentObject.properties[key];
      });

      const { ...testEnvironmentInfo } = httpRequest.body;
      testEnvironmentDataToEdit = {
        ...testEnvironmentId,
        ...testEnvironmentInfo,
        properties: propertiesObject,
      };
    }

    return testEnvironmentDataToEdit;
  };
}

module.exports = { makePopulateMissingProperties };
