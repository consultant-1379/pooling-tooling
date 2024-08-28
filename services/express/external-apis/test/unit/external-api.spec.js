require('../../../config/config');

const nock = require('nock');
const expect = require('expect');
const request = require('superagent');
const logger = require('../../../logger/logger');
const { makeExternalApi } = require('../../external-api');

const url = process.env.EIAE_HELMFILE_REPO_URL;
const eiaeHelmfileStorageLocation = process.env.EIAE_HELMFILE_STORAGE_FILEPATH;

const useExternalApi = makeExternalApi(request, url, eiaeHelmfileStorageLocation, logger);

const eiaeHelmfileArtifactsMockData = {
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

describe('Unit Test: (External APIs service) Get EIAE Helmfile Artifacts', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  it('should check if the EIAE artifacts api is working', async () => {
    nock(url)
      .get('/artifactory/api/storage/proj-eric-oss-drop-helm-local/eric-eiae-helmfile')
      .reply(200, eiaeHelmfileArtifactsMockData);
    const eiaeHelmfileArtifacts = await useExternalApi.getEiaeHelmfileArtifacts();
    expect(eiaeHelmfileArtifacts).toBeDefined();
    expect(eiaeHelmfileArtifacts).toEqual(eiaeHelmfileArtifactsMockData);
  });
  it('should throw an error if the EIAE artifacts api is not working', (done) => {
    nock(url)
      .get('/artifactory/api/storage/proj-eric-oss-drop-helm-local/eric-eiae-helmfile')
      .replyWithError('Issue getting EIAE helmfile artifacts from artifactory');
    useExternalApi.getEiaeHelmfileArtifacts().catch((error) => {
      expect(error.message).toBe('Unable to get EIAE artifacts, Error: Issue getting EIAE helmfile artifacts from artifactory');
    })
      .then(done, done);
  });
});
