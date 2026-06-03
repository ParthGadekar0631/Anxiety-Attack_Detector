const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { env } = require("./config/env");
const routes = require("./routes");
const { notFound, errorMiddleware } = require("./middleware/errorMiddleware");

function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false }));
  if (env.nodeEnv !== "test") app.use(morgan("dev"));
  app.use("/api", routes);
  app.use(notFound);
  app.use(errorMiddleware);
  return app;
}

module.exports = { createApp };
