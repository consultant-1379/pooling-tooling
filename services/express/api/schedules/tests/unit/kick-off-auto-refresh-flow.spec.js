const expect = require('expect');

const { makeKickOffSpinnakerFlow } = require('../../use-cases/kick-off-spinnaker-flow');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Schedule service) Kick off auto refresh flow use case', () => {
  it('successfully kicks off refresh flow for test environment', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const kickOffAutoRefreshFlow = makeKickOffSpinnakerFlow(() => true, { info: () => 'Test log', error: () => 'Test error log' });
    const autoRefreshFlowKickedOff = await kickOffAutoRefreshFlow(fakeTestEnvironment, 'release');
    expect(autoRefreshFlowKickedOff).toBeTruthy();
  });
  it('throws an error if Spinnaker Application/Pipeline not set', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const kickOffAutoRefreshFlow = makeKickOffSpinnakerFlow(() => true, { info: () => 'Test log', error: () => 'Test error log' });
    let kickOffPipeline;
    try {
      kickOffPipeline = await kickOffAutoRefreshFlow(fakeTestEnvironment, 'invalid-project-area', '');
    } catch (err) {
      expect(err.message).toStrictEqual('Spinnaker Application/Pipeline name have not been set correctly; there may be an issue with projectArea in Schedule');
    }
    expect(kickOffPipeline).toBeFalsy();
  });
  it('kickOffSpinnakerFlow returns false', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const kickOffAutoRefreshFlow = makeKickOffSpinnakerFlow(() => true, { info: () => 'Test log', error: () => 'Test error log' });
    const autoRefreshFlowKickedOff = await kickOffAutoRefreshFlow(fakeTestEnvironment, '');
    expect(autoRefreshFlowKickedOff).toBeFalsy();
  });
});
