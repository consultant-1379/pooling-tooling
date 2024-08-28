require('../../../config/config');
const nock = require('nock');
const expect = require('expect');

const URL = process.env.SPINNAKER_URL;

const { checkIsExecutionCanceled } = require('../../use-cases');

const MOCK_DATA_NOT_CANCELED = [
  {
    type: 'PIPELINE',
    id: '01FS9HKRAHEJV34TK30MJE8VVZ',
    application: 'product-e2e-cicd',
    name: 'product-staging',
    buildTime: 1642071712082,
    canceled: false,
    canceledBy: 'signum',
    cancellationReason: 'Canceling due to bug in the PS pipeline. Will be retriggered once fixed.',
    limitConcurrent: false,
    keepWaitingPipelines: false,
    startTime: 1642071712143,
    endTime: 1642072910870,
    status: 'NOT_CANCELED',
  },
];

const MOCK_DATA_CANCELED = [
  {
    type: 'PIPELINE',
    id: '01FS9HKRAHEJV34TK30MJE8VVZ',
    application: 'product-e2e-cicd',
    name: 'product-staging',
    buildTime: 1642071712082,
    canceled: true,
    canceledBy: 'signum',
    cancellationReason: 'Canceling due to bug in the PS pipeline. Will be retriggered once fixed.',
    limitConcurrent: false,
    keepWaitingPipelines: false,
    startTime: 1642071712143,
    endTime: 1642072910870,
    status: 'CANCELED',
  },
];

describe('Unit Test: (Spinnaker service) Get is execution canceled.', () => {
  const executionId = '01FS9HKRAHEJV34TK30MJE8VVZ';
  afterEach(() => {
    nock.cleanAll();
  });
  it('should be canceled.', async () => {
    nock(URL)
      .get(`/executions?executionIds=${executionId}&expand=false`)
      .reply(200, MOCK_DATA_CANCELED);
    const result = await checkIsExecutionCanceled(executionId);
    expect(result).toBeTruthy();
  });
  it('should not be canceled.', async () => {
    nock(URL)
      .get(`/executions?executionIds=${executionId}&expand=false`)
      .reply(200, MOCK_DATA_NOT_CANCELED);
    const result = await checkIsExecutionCanceled(executionId);
    expect(result).not.toBeTruthy();
  });
  it('error should throw error', async () => {
    nock(URL)
      .get(`/executions?executionIds=${executionId}&expand=false`)
      .reply(404, '<html lang="en">response</html>');
    try {
      await checkIsExecutionCanceled(executionId);
    } catch (err) {
      expect(err.message).toBe('Unable to GET pipeline executions status, url=https://spinnaker-api.rnd.gic.ericsson.se, executionId=01FS9HKRAHEJV34TK30MJE8VVZ.');
    }
  });
});
