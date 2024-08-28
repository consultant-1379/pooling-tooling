function makePostExpressCallback(controller) {
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
      const postedEntity = await controller(httpRequest);
      const headers = {
        'Content-Type': 'application/json',
        'Last-Modified': postedEntity.modifiedOn,
      };
      res.set(headers);
      res.type('json');
      res.status(201).send(postedEntity);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { makePostExpressCallback };
