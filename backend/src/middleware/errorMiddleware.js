function notFound(_req, res) {
  res.status(404).json({ success: false, message: "Route not found", details: {} });
}

function errorMiddleware(error, _req, res, _next) {
  const status = error.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : error.message,
    details: status === 500 ? {} : error.details || {},
  });
}

module.exports = { notFound, errorMiddleware };
