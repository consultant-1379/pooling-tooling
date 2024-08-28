function makePatchExpressCallback(controller, schema) {
  return async (req, res, next) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        'User-Agent': req.get('User-Agent'),
      },
    };
    try {
      if (schema) {
        schema.parse(req.body);
      }
      const patchedEntity = await controller(httpRequest);
      const headers = {
        'Content-Type': 'application/json',
        'Last-Modified': patchedEntity.modifiedOn,
      };
      res.set(headers);
      res.type('json');
      res.status(200).send(patchedEntity);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { makePatchExpressCallback };
