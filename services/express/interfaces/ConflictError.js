const { RequestError } = require('./RequestError');

class ConflictError extends RequestError {
  constructor(message) {
    const status = 409;
    const defaultMessage = 'Conflict Error';
    super(message || defaultMessage, status);
  }
}

module.exports = {
  ConflictError,
};
