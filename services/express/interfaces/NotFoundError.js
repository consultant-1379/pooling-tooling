const { RequestError } = require('./RequestError');

class NotFoundError extends RequestError {
  constructor(message) {
    const status = 404;
    const defaultMessage = 'Object Not Found';
    super(
      message || defaultMessage,
      status,
    );
  }
}

module.exports = {
  NotFoundError,
};
