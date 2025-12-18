import { HttpStatus, HttpStatusCode } from './httpStatus';

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly details?: unknown;

  constructor(message: string, statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
