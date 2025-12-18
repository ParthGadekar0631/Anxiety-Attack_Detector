import { FilterQuery } from 'mongoose';
import { IUser, UserModel } from '../models/user.model';

export class UserRepository {
  create(user: Partial<IUser>) {
    return UserModel.create(user);
  }

  findByEmail(email: string) {
    return UserModel.findOne({ email }).select('+password').exec();
  }

  findById(id: string) {
    return UserModel.findById(id).exec();
  }

  list(filter: FilterQuery<IUser> = {}) {
    return UserModel.find(filter).exec();
  }

  updateRole(id: string, role: IUser['role']) {
    return UserModel.findByIdAndUpdate(id, { role }, { new: true }).exec();
  }

  deactivate(id: string) {
    return UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }
}

export const userRepository = new UserRepository();
