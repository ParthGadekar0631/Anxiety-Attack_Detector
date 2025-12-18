import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env';
import { httpLogger } from './utils/logger';
import { v1Routes } from './routes/v1/index';
import { errorHandler } from './middlewares/error.middleware';
import { HttpStatus } from './utils/httpStatus';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(httpLogger);

app.get('/health', (_req, res) => {
  res.status(HttpStatus.OK).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1', v1Routes);

app.use(errorHandler);
