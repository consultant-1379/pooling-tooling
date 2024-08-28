const { makeCheckRequestIdExists } = require('./check-request-id-exists');

const checkRequestIdExists = makeCheckRequestIdExists();

const pipelineFunctionsService = Object.freeze({
  checkRequestIdExists,
});

module.exports = {
  pipelineFunctionsService,
  checkRequestIdExists,
};
