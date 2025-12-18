import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { HttpStatus } from '../utils/httpStatus';
import type { UserRole } from '../models/user.model';

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      throw new AppError('Forbidden', HttpStatus.FORBIDDEN);
    }

    next();
  };
}
