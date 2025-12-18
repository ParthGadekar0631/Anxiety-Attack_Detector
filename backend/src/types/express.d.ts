import type { JwtPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface User extends JwtPayload {}

    interface Request {
      user?: User;
    }
  }
}

export {};
