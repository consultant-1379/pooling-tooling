const expect = require('expect');
const sinon = require('sinon');

const {
  makePatchExpressCallback,
} = require('../../make-patch-express-callback');

const {
  patchableTestEnvironmentSchema,
} = require('../../../api/test-environments/entities');
const {
  patchablePoolSchema,
} = require('../../../api/pools/entities');
const {
  patchableRequestSchema,
} = require('../../../api/requests/entities');
const {
  patchableScheduleSchema,
} = require('../../../api/schedules/entities');

const { makeFakePool } = require('../../../__test__/fixtures/pool.spec');
const { makeFakeTestEnvironment } = require('../../../__test__/fixtures/test-environment.spec');
const { makeFakeSchedule } = require('../../../__test__/fixtures/schedule.spec');
const { makeFakeRequest } = require('../../../__test__/fixtures/request.spec');

describe('Unit Test: (Express-callback) Test makePatchExpressCallback', () => {
  it('Should pass validation with additional properties', async () => {
    const mockRequest = {
      body: {
        name: 'test-env',
        status: 'Reserved',
        requestId: '11111cilf00220jhr819aa9nm',
        pools: [
          'test',
        ],
        properties: {
          category: 'test development',
          version: '0.0.0',
          ccdVersion: '1.0.0',
          template: 'N/A',
          kubeDashboard: 'https://cloud00a.athtem.eei.ericsson.se/dashboard/auth/login/ ',
          telemetryDashboard: 'https://cloud00a.athtem.eei.ericsson.se/dashboard/auth/login/ ',
          product: 'default_product',
          platformType: 'default_platformType',
        },
        stage: 'https://spinnaker.rnd.gic.ericsson.se/#/applications/thunderbeetest/executions/details/01FPA6HW5R11J06A9WF90CFM7S',
        additionalInfo: 'Reserved by Testing Test Flow',
        createdOn: '2021-10-01T12:59:41.000Z',
        modifiedOn: '2023-11-27T14:06:49.314Z',
        priorityInfo: {
          viewIndices: {
            'test-pool-1': 1,
            'test-pool-2': 19,
          },
        },
        comments: 'These are my comments',
      },
      query: {},
      params: {},
      method: 'PATCH',
      path: '/test-environments',
      get: (headerName) => (headerName === 'Content-Type' ? 'application/json' : 'test-agent'),
    };

    const mockResponse = {
      set: sinon.spy(),
      status: sinon.stub().returnsThis(),
      type: sinon.spy(),
      send: sinon.spy(),
    };

    const controller = sinon.stub().returns(true);

    const next = sinon.spy();

    const mockLogger = {
      info: sinon.spy(),
      error: sinon.spy(),
    };

    const patchExpressCallback = makePatchExpressCallback(
      controller,
      mockLogger,
      patchableTestEnvironmentSchema,
    );
    await patchExpressCallback(mockRequest, mockResponse, next);
  });

  xit('Should log the error when the controller throws an error', async () => {
    const mockRequest = {
      body: {},
      query: {},
      params: {},
      method: 'PATCH',
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

    const patchExpressCallback = makePatchExpressCallback(
      controller,
      mockLogger,
    );

    await patchExpressCallback(mockRequest, mockResponse);

    sinon.assert.calledOnce(mockLogger.error);

    sinon.assert.calledWith(
      mockLogger.error,
      sinon.match.any,
      `Error making patch Express Callback. Error: ${error.message}`,
    );
  });

  xit('Should log the error when the controller throws an Zod Error', async () => {
    const mockRequest = {
      body: {
        notAllowed: 'trash',
      },
      query: {},
      params: {},
      method: 'PATCH',
      path: '/test-environments',
      get: (headerName) => (headerName === 'Content-Type' ? 'application/json' : 'test-agent'),
    };

    const mockResponse = {
      set: sinon.spy(),
      status: sinon.stub().returnsThis(),
      type: sinon.spy(),
      send: sinon.spy(),
    };

    const controller = sinon.stub().returns((callback) => {
      setTimeout(callback, 1000);
    });

    const mockLogger = {
      error: sinon.spy(),
    };

    const patchExpressCallback = makePatchExpressCallback(
      controller,
      mockLogger,
      patchableTestEnvironmentSchema,
    );

    await patchExpressCallback(mockRequest, mockResponse);
    sinon.assert.calledOnce(mockLogger.error);

    sinon.assert.calledWith(
      mockLogger.error,
      sinon.match.any,
      "Error patching. Error(s): Unrecognized key(s) in object: 'notAllowed'",
    );
  });

  xit('Should log the error when the controller throws an error', async () => {
    const mockRequest = {
      body: {},
      query: {},
      params: {},
      method: 'PATCH',
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

    const patchExpressCallback = makePatchExpressCallback(
      controller,
      mockLogger,
    );

    await patchExpressCallback(mockRequest, mockResponse);

    sinon.assert.calledOnce(mockLogger.error);

    sinon.assert.calledWith(
      mockLogger.error,
      sinon.match.any,
      `Error making patch Express Callback. Error: ${error.message}`,
    );
  });

  it('Should pass validation with Pool schema', async () => {
    const pool = makeFakePool();
    pool.modifiedOn = pool.modifiedOn.toString();
    pool.createdOn = pool.createdOn.toString();
    expect(patchablePoolSchema.parse(pool)).toBeTruthy();
  });
  it('Should pass validation with TestEnvironment schema', async () => {
    const testEnvironment = makeFakeTestEnvironment();
    testEnvironment.modifiedOn = testEnvironment.modifiedOn.toString();
    testEnvironment.createdOn = testEnvironment.createdOn.toString();
    expect(patchableTestEnvironmentSchema.parse(testEnvironment)).toBeTruthy();
  });
  it('Should pass validation with Schedule schema', async () => {
    const schedule = makeFakeSchedule();
    schedule.modifiedOn = schedule.modifiedOn.toString();
    schedule.createdOn = schedule.createdOn.toString();
    expect(patchableScheduleSchema.parse(schedule)).toBeTruthy();
  });
  it('Should pass validation with Request schema', async () => {
    const request = makeFakeRequest();
    request.modifiedOn = request.modifiedOn.toString();
    request.createdOn = request.createdOn.toString();
    expect(patchableRequestSchema.parse(request)).toBeTruthy();
  });
});
