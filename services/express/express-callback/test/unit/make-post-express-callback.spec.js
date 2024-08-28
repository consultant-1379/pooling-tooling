const sinon = require('sinon');
const { makePostExpressCallback } = require('../../make-post-express-callback');

describe('Unit Test: (Express-callback) Test makePostExpressCallback', () => {
  xit('Should log the error when the controller throws an error', async () => {
    const mockRequest = {
      body: {},
      query: {},
      params: {},
      method: 'POST',
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

    const postExpressCallback = makePostExpressCallback(controller, mockLogger);

    try {
      await postExpressCallback(mockRequest, mockResponse);
    } catch (e) {
      // lint error if empty "Empty block statement"
    }

    sinon.assert.calledOnce(mockLogger.error);

    sinon.assert.calledWith(mockLogger.error, sinon.match.any, `Error making post Express Callback. Error: ${error.message}`);
  });
});
