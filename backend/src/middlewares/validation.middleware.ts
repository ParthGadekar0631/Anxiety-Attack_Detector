import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/appError';
import { HttpStatus } from '../utils/httpStatus';

export const validateBody = (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Validation error', HttpStatus.UNPROCESSABLE_ENTITY, parsed.error.flatten());
    }

    req.body = parsed.data;
    next();
  };
