require('../config/config');
const request = require('superagent');
const logger = require('../logger/logger');

const url = process.env.EIAE_HELMFILE_REPO_URL;
const eiaeHelmfileStorageLocation = process.env.EIAE_HELMFILE_STORAGE_FILEPATH;
const { makeExternalApi } = require('./external-api');

const useExternalApi = makeExternalApi(request, url, eiaeHelmfileStorageLocation, logger);

const useExternalApiService = Object.freeze({
  useExternalApi,
});

module.exports = {
  useExternalApiService,
  useExternalApi,
};
