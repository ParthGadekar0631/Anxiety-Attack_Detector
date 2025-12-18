import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils/appError';
import { HttpStatus } from '../utils/httpStatus';
import type { IUser } from '../models/user.model';

export class UserService {
  listUsers() {
    return userRepository.list();
  }

  async updateRole(id: string, role: IUser['role']) {
    const user = await userRepository.updateRole(id, role);
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async deactivate(id: string) {
    const user = await userRepository.deactivate(id);
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}

export const userService = new UserService();
