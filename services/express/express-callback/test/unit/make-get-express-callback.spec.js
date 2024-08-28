const sinon = require('sinon');
const { makeGetExpressCallback } = require('../../make-get-express-callback');

describe('Unit Test: (Express-callback) Test makeGetExpressCallback', () => {
  xit('Should log the error when the controller throws an error', async () => {
    const mockRequest = {
      body: {},
      query: {},
      params: {},
      method: 'GET',
      path: '/test',
      get: (headerName) => (headerName === 'Content-Type' ? 'application/json' : 'test-agent'),
    };

    const mockResponse = {
      set: sinon.spy(),
      status: sinon.stub().returnsThis(),
      type: sinon.spy(),
      send: sinon.spy(),
    };

    const error = new Error('Faking something going wrong!');

    const controller = sinon.stub().returns(Promise.reject(error));

    const mockLogger = {
      error: sinon.spy(),
    };

    const getExpressCallback = makeGetExpressCallback(controller, mockLogger);

    try {
      await getExpressCallback(mockRequest, mockResponse);
    } catch (e) {
      // lint error if empty "Empty block statement"
    }

    sinon.assert.calledOnce(mockLogger.error);

    sinon.assert.calledWith(mockLogger.error, sinon.match.any, `Error making get Express Callback. Error: ${error.message}`);
  });
});
