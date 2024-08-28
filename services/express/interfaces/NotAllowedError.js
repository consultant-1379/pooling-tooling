const { RequestError } = require('./RequestError');

class NotAllowedError extends RequestError {
  constructor(message) {
    const status = 405;
    const defaultMessage = 'Not Allowed Error';
    super(message || defaultMessage, status);
  }
}

module.exports = {
  NotAllowedError,
};
