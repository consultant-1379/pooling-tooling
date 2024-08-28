const expect = require('expect');

const { makeGetSortedEiapVersions } = require('../../use-cases/get-sorted-eiap-versions');

describe('Unit Test: (RPT Cron service) Get sorted EIAP versions use-case', () => {
  it('successfully gets sorted EIAP versions', async () => {
    const fakeArtifactoryResponse = {
      repo: 'proj-eric-oss-drop-helm-local',
      path: '/eric-eiae-helmfile',
      created: '2021-07-15T16:51:43.576+02:00',
      createdBy: 'eoadm100',
      lastModified: '2021-07-15T16:51:43.576+02:00',
      modifiedBy: 'eoadm100',
      lastUpdated: '2021-07-15T16:51:43.576+02:00',
      children: [
        { uri: '/eric-eiae-helmfile-0.0.0-1.tar', folder: false },
        { uri: '/eric-eiae-helmfile-2.0.0-1235.tgz', folder: false },
        { uri: '/eric-eiae-helmfile-1.0.0-11.tgz', folder: false },
      ],
      uri: 'https://arm.seli.gic.ericsson.se/artifactory/api/storage/proj-eric-oss-drop-helm-local/eric-eiae-helmfile',
    };

    const getSortedEiapVersions = makeGetSortedEiapVersions(
      {
        useExternalApi: {
          getEiaeHelmfileArtifacts: () => fakeArtifactoryResponse,
        },
      },
      () => undefined,
      () => ['2.0.0-1235', '1.0.0-11', '0.0.0-1'],
      { info: () => 'Test log' },
    );

    const sortedEiapVersions = await getSortedEiapVersions();
    expect(sortedEiapVersions).toEqual(['2.0.0-1235', '1.0.0-11', '0.0.0-1']);
  });

  it('unsuccessfully gets EIAP helmfile artifacts', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const getSortedEiapVersions = makeGetSortedEiapVersions({
      useExternalApi: {
        getEiaeHelmfileArtifacts: () => {
          throw Error(expectedErrorMessage);
        },
      },
    });

    let actualErrorMessage;
    await getSortedEiapVersions().catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
