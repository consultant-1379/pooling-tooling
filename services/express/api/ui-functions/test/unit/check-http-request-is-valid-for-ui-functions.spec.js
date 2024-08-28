const expect = require('expect');
const logger = require('../../../../logger/logger');

const { makeCheckHttpRequestIsValidForUiFunctions } = require('../../use-cases/check-http-request-is-valid-for-ui-functions');

const checkHttpRequestIsValidForUiFunctions = makeCheckHttpRequestIsValidForUiFunctions(logger);

describe('Unit Test: (UI Functions service) Testing the HTTP Request sent to the patch controller', () => {
  it('should return the HTTP Request if it is valid.', () => {
    const fakeHttpRequest = {
      body: {
        additionalInfo: 'userId: ERICSSON',
      },
      params: { id: 'testenvironmentid123' },
    };

    const expectedResponse = {
      body: {
        additionalInfo: fakeHttpRequest.body.additionalInfo,
      },
      params: { id: fakeHttpRequest.params.id },
    };
    expect(checkHttpRequestIsValidForUiFunctions(fakeHttpRequest)).toEqual(expectedResponse);
  });
  it('should throw an error if the HTTP Request is not valid.', () => {
    const fakeHttpRequest = {
      body: {
        additionalInfo: { userId: 'ERICSSON' },
      },
      params: { id: 'testenvironmentid123' },
    };
    expect(() => checkHttpRequestIsValidForUiFunctions(fakeHttpRequest)).toThrow('Invalid http request to update Test Environment and/or Request entity.');
  });
  it('should throw an error if not enough data is sent in the HTTP Request.', () => {
    const fakeHttpRequest = {
      body: {
        additionalInfo: '',
      },
      params: { id: 'testenvironmentid123' },
    };
    expect(() => checkHttpRequestIsValidForUiFunctions(fakeHttpRequest)).toThrow('Not enough data to update the Test Environment and/or Request entities.');
  });
});
