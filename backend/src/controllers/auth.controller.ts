import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { HttpStatus } from '../utils/httpStatus';

class AuthController {
  register = async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(HttpStatus.CREATED).json(result);
  };

  login = async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(HttpStatus.OK).json(result);
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.status(HttpStatus.OK).json(result);
  };

  logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.status(HttpStatus.NO_CONTENT).end();
  };
}

export const authController = new AuthController();
