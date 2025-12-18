import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { HttpStatus } from '../utils/httpStatus';
import { logger } from '../utils/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (res.headersSent) {
    return;
  }

  if (error instanceof AppError) {
    logger.warn(`${error.message}`);
    res.status(error.statusCode).json({ message: error.message, details: error.details });
    return;
  }

  logger.error('Unexpected error', error as Error);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
}
