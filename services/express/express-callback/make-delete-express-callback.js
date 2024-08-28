function makeDeleteExpressCallback(controller) {
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
      await controller(httpRequest);
      const headers = {
        'Content-Type': 'application/json',
      };
      res.set(headers);
      res.type('json');
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { makeDeleteExpressCallback };
