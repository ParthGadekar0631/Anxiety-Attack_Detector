import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { HttpStatus } from '../utils/httpStatus';

class UserController {
  list = async (_req: Request, res: Response) => {
    const users = await userService.listUsers();
    res.status(HttpStatus.OK).json(users);
  };

  updateRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    const user = await userService.updateRole(id, role);
    res.status(HttpStatus.OK).json(user);
  };

  deactivate = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.deactivate(id);
    res.status(HttpStatus.OK).json(user);
  };
}

export const userController = new UserController();
