const errorMiddleware = (error, req, res, next) => {
  res.status(error.status || 500);
  res.send({ error: true, message: error.message, status: error.status });
};

module.exports = errorMiddleware;
