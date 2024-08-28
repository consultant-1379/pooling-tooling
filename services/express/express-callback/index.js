const { makeGetExpressCallback } = require('./make-get-express-callback');
const { makePatchExpressCallback } = require('./make-patch-express-callback');
const { makePostExpressCallback } = require('./make-post-express-callback');
const { makeDeleteExpressCallback } = require('./make-delete-express-callback');

const expressCallbackService = Object.freeze({
  makeGetExpressCallback,
  makePatchExpressCallback,
  makePostExpressCallback,
  makeDeleteExpressCallback,
});

module.exports = {
  expressCallbackService,
  makeGetExpressCallback,
  makePatchExpressCallback,
  makePostExpressCallback,
  makeDeleteExpressCallback,
};
