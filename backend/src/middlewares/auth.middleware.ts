import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/appError';
import { HttpStatus } from '../utils/httpStatus';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    throw new AppError('Missing Authorization header', HttpStatus.UNAUTHORIZED);
  }

  const [, token] = header.split(' ');
  if (!token) {
    throw new AppError('Invalid Authorization header', HttpStatus.UNAUTHORIZED);
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    throw new AppError('Invalid or expired token', HttpStatus.UNAUTHORIZED, error);
  }
}
