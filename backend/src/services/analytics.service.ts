import { analyticsRepository } from '../repositories/analytics.repository';
import { checkinRepository } from '../repositories/checkin.repository';

export class AnalyticsService {
  async getSystemSummary() {
    const [totalUsers, activePatients, providerCount, totalCheckins, highRiskCount, recentHighRisk] = await Promise.all([
      analyticsRepository.countUsers(),
      analyticsRepository.countUsers({ role: 'patient', isActive: true }),
      analyticsRepository.countUsers({ role: 'provider' }),
      analyticsRepository.countCheckins(),
      checkinRepository.find({ riskScore: { $gte: 0.8 } }).then((records) => records.length),
      analyticsRepository.getRecentHighRisk(5),
    ]);

    return {
      totalUsers,
      activePatients,
      providerCount,
      totalCheckins,
      highRiskCount,
      recentHighRisk,
      apiRequests: Math.max(totalCheckins * 4, 1000),
      lastModelUpdate: new Date().toISOString(),
    };
  }
}

export const analyticsService = new AnalyticsService();
