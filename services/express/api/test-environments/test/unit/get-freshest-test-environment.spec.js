const expect = require('expect');
const cuid = require('cuid');
const sinon = require('sinon');

const { makeGetFreshestTestEnvironment } = require('../../controllers/get-freshest-test-environment');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Get freshest test environment controller', () => {
  it('successfully gets freshest test environment when passed an httpRequest', async () => {
    const envId1 = cuid();
    const envId2 = cuid();
    const envId3 = cuid();
    const fakeTestEnvironment1 = makeFakeTestEnvironment({
      id: envId1,
      properties: {
        version: '0.0.9',
      },
    });
    const fakeTestEnvironment2 = makeFakeTestEnvironment({
      id: envId2,
      properties: {
        version: '3.82.157',
      },
    });
    const fakeTestEnvironment3 = makeFakeTestEnvironment({
      id: envId3,
      properties: {
        version: '2.118.3',
      },
    });

    const findByIdStub = sinon.stub();

    findByIdStub.onCall(0).resolves([fakeTestEnvironment1]);
    findByIdStub.onCall(1).resolves([fakeTestEnvironment2]);
    findByIdStub.onCall(2).resolves([fakeTestEnvironment3]);

    const getFreshestTestEnvironment = makeGetFreshestTestEnvironment(
      {
        findById: () => findByIdStub(),
      },
      () => [fakeTestEnvironment2],
      { info: () => 'Test log', logFormatter: () => {} },
    );

    const idString = `${fakeTestEnvironment1.id},${fakeTestEnvironment2.id},${fakeTestEnvironment3.id}`;

    const fakeHttpRequest = {
      params: {
        ids: idString,
      },
    };

    const freshestTestEnvironment = await getFreshestTestEnvironment(fakeHttpRequest);
    expect(freshestTestEnvironment).toEqual(fakeTestEnvironment2);
  });
  it('successfully gets freshest test environment when passed an array of ids', async () => {
    const envId1 = cuid();
    const envId2 = cuid();
    const envId3 = cuid();
    const fakeTestEnvironment1 = makeFakeTestEnvironment({
      id: envId1,
      properties: {
        version: '0.0.9',
      },
    });
    const fakeTestEnvironment2 = makeFakeTestEnvironment({
      id: envId2,
      properties: {
        version: '3.82.157',
      },
    });
    const fakeTestEnvironment3 = makeFakeTestEnvironment({
      id: envId3,
      properties: {
        version: '2.118.3',
      },
    });

    const findByIdStub = sinon.stub();

    findByIdStub.onCall(0).resolves([fakeTestEnvironment1]);
    findByIdStub.onCall(1).resolves([fakeTestEnvironment2]);
    findByIdStub.onCall(2).resolves([fakeTestEnvironment3]);

    const getFreshestTestEnvironment = makeGetFreshestTestEnvironment(
      {
        findById: () => findByIdStub(),
      },
      () => [fakeTestEnvironment2],
      { info: () => 'Test log', logFormatter: () => {} },
    );

    const arrayOfIds = [fakeTestEnvironment1.id, fakeTestEnvironment2.id, fakeTestEnvironment3.id];

    const freshestTestEnvironment = await getFreshestTestEnvironment(arrayOfIds);
    expect(freshestTestEnvironment).toEqual(fakeTestEnvironment2);
  });
});
