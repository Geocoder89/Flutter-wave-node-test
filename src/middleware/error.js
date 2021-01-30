const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 400).json({
    message: err.message,
    status: "error",
    data: null,
  });
};

module.exports = errorHandler;
