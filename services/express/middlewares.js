const { ZodError } = require('zod');
const { RequestError } = require('./interfaces/RequestError');
const { NotFoundError } = require('./interfaces/NotFoundError');

function notFoundHandler(req, res, next) {
  res.status(404);
  const error = new NotFoundError(`404 - Not found: ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  const response = {};
  // eslint-disable-next-line prefer-destructuring
  let message = error.message;
  if (error instanceof ZodError) {
    res.status(422);
    message = JSON.stringify(error.issues).replace(/"/g, '\'');
  } else if (error instanceof RequestError) {
    res.status(error.status || 419);
  } else {
    res.status(500);
    response.stack = error.stack;
  }

  response.message = `${error.name}: ${message}`;
  res.json(response);
}

function validateRequest(validators) {
  return async (req, res, next) => {
    try {
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422);
      } else if (error instanceof RequestError) {
        res.status(error.status || 419);
      } else {
        res.status(500);
      }
      next(error);
    }
  };
}

module.exports = {
  notFoundHandler,
  errorHandler,
  validateRequest,
};
