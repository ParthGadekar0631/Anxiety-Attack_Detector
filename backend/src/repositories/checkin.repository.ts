import { FilterQuery } from 'mongoose';
import { CheckinModel, ICheckin } from '../models/checkin.model';

export class CheckinRepository {
  create(payload: Partial<ICheckin>) {
    return CheckinModel.create(payload);
  }

  findByUser(userId: string, limit = 30) {
    return CheckinModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  findRecent(limit = 10) {
    return CheckinModel.find().sort({ createdAt: -1 }).limit(limit).populate('user').exec();
  }

  find(filter: FilterQuery<ICheckin>) {
    return CheckinModel.find(filter).exec();
  }
}

export const checkinRepository = new CheckinRepository();
