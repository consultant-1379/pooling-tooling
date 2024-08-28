const { RequestError } = require('./RequestError');

class BadRequestError extends RequestError {
  constructor(message) {
    const status = 400;
    const defaultMessage = 'Bad Request';
    super(message || defaultMessage, status);
  }
}

module.exports = {
  BadRequestError,
};
