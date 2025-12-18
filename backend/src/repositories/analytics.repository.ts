import { CheckinModel } from '../models/checkin.model';
import { UserModel } from '../models/user.model';

export class AnalyticsRepository {
  countUsers(filter = {}) {
    return UserModel.countDocuments(filter).exec();
  }

  countCheckins() {
    return CheckinModel.countDocuments().exec();
  }

  async getRecentHighRisk(limit = 5) {
    return CheckinModel.find({ riskScore: { $gte: 0.7 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user')
      .exec();
  }
}

export const analyticsRepository = new AnalyticsRepository();
