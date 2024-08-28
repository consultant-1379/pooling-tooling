const sinon = require('sinon');
const expect = require('expect');
const { ZodError } = require('zod');
const middlewares = require('../../middlewares');
const { BadRequestError } = require('../../interfaces/BadRequestError');
const { ConflictError } = require('../../interfaces/ConflictError');
const { NotAllowedError } = require('../../interfaces/NotAllowedError');
const { NotFoundError } = require('../../interfaces/NotFoundError');

let validators;

async function testError(thrownError, expectedStatus) {
  validators.body = { parseAsync: sinon.stub().rejects(thrownError) };
  validators.status = sinon.stub();
  const next = sinon.stub();
  const req = {};
  const res = {};
  res.status = sinon.stub();

  const middleware = middlewares.validateRequest(validators);

  await middleware(req, res, next);

  expect(next.calledOnceWith(thrownError)).toBe(true);
  expect(validators.body.parseAsync.calledOnceWith(req.body)).toBe(true);
  expect((res.status).calledOnceWith(expectedStatus)).toBe(true);
  expect(validators.params).toBeUndefined();
  expect(validators.query).toBeUndefined();
}

describe('Unit Test: (Middlewares)', () => {
  beforeEach(() => {
    validators = {};
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Unit Test: (Middlewares) Validate Requests', () => {
    it('should call the next function if validation succeeds for all validators', async () => {
      validators.body = { parseAsync: sinon.stub().resolves({}) };
      validators.params = { parseAsync: sinon.stub().resolves({}) };
      validators.query = { parseAsync: sinon.stub().resolves({}) };

      const next = sinon.stub();
      const req = { body: {}, params: {}, query: {} };
      const res = {};
      res.status = sinon.stub();
      const middleware = middlewares.validateRequest(validators);

      await middleware(req, res, next);

      expect(next.calledOnce).toBe(true);
      expect(validators.body.parseAsync.calledOnceWith(req.body)).toBe(true);
      expect(validators.params.parseAsync.calledOnceWith(req.params)).toBe(true);
      expect(validators.query.parseAsync.calledOnceWith(req.query)).toBe(true);
    });

    it('should call the next function if validation succeeds for some validators', async () => {
      validators.body = { parseAsync: sinon.stub().resolves({}) };
      validators.params = { parseAsync: sinon.stub().resolves({}) };

      const next = sinon.stub();
      const req = { body: {}, params: {} };
      const res = {};
      res.status = sinon.stub();
      const middleware = middlewares.validateRequest(validators);

      await middleware(req, res, next);

      expect(next.calledOnce).toBe(true);
      expect(validators.body.parseAsync.calledOnceWith(req.body)).toBe(true);
      expect(validators.params.parseAsync.calledOnceWith(req.params)).toBe(true);
      expect(validators.query).toBeUndefined();
    });

    it('should call the error handler if validation fails for any validator', async () => {
      const zodError = new ZodError([]);
      validators.body = { parseAsync: sinon.stub().rejects(zodError) };

      const next = sinon.stub();
      const req = {};
      const res = {};
      res.status = sinon.stub();
      const middleware = middlewares.validateRequest(validators);

      await middleware(req, res, next);

      expect(next.calledOnceWith(zodError)).toBe(true);
      expect(validators.body.parseAsync.calledOnceWith(req.body)).toBe(true);
      expect(validators.params).toBeUndefined();
      expect(validators.query).toBeUndefined();
    });

    it('should call the error handler if validation fails ZodError', async () => {
      const error = new ZodError([]);
      validators.body = { parseAsync: sinon.stub().rejects(error) };
      const next = sinon.stub();
      const req = {};
      const res = {};
      res.status = sinon.stub();

      const middleware = middlewares.validateRequest(validators);

      await middleware(req, res, next);

      expect(next.calledOnceWith(error)).toBe(true);
      expect(validators.body.parseAsync.calledOnceWith(req.body)).toBe(true);
      expect(res.status.calledOnceWith(422)).toBe(true);
      expect(validators.params).toBeUndefined();
      expect(validators.query).toBeUndefined();
    });

    it('should call the error handler if validation fails BadRequestError', async () => {
      await testError(
        new BadRequestError('BadRequestError'),
        400,
      );
    });

    it('should call the error handler if validation fails ConflictError', async () => {
      await testError(
        new ConflictError('ConflictError'),
        409,
      );
    });

    it('should call the error handler if validation fails NotAllowedError', async () => {
      await testError(
        new NotAllowedError('NotAllowedError'),
        405,
      );
    });

    it('should call the error handler if validation fails NotFoundError', async () => {
      await testError(
        new NotFoundError('NotFoundError'),
        404,
      );
    });
  });

  describe('Unit Test: (Middlewares) Not Found Handler', () => {
    it('should call the next function with a not found error', () => {
      const statusCode = 404;
      const req = {};
      const res = { status: sinon.stub() };
      const next = sinon.stub();
      const middleware = middlewares.notFoundHandler;

      middleware(req, res, next);

      expect(res.status.calledOnceWith(statusCode)).toBe(true);
      expect(next.calledOnce).toBe(true);
    });
  });

  describe('Unit Test: (Middlewares) Error Handler', () => {
    it('should set the status code and send the error response', () => {
      const statusCode = 500;
      const error = sinon.stub();
      const req = {};
      const res = { status: sinon.stub(), json: sinon.stub() };
      const next = sinon.stub();
      const middleware = middlewares.errorHandler;

      middleware(error, req, res, next);

      expect(res.status.calledOnceWith(statusCode)).toBe(true);
      expect(next.called).toBe(false);
    });
  });
});
