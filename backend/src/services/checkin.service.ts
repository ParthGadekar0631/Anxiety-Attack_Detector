import { checkinRepository } from '../repositories/checkin.repository';
import { userRepository } from '../repositories/user.repository';
import { mlService } from './ml.service';
import { AppError } from '../utils/appError';
import { HttpStatus } from '../utils/httpStatus';

interface CheckinDto {
  anxietyLevel: number;
  symptoms?: string[];
  triggers?: string[];
  copingMechanisms?: string[];
  notes?: string;
}

export class CheckinService {
  async submit(userId: string, payload: CheckinDto) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    const result = await mlService.predict({
      userId,
      anxietyLevel: payload.anxietyLevel,
      symptoms: payload.symptoms ?? [],
      triggers: payload.triggers ?? [],
      copingMechanisms: payload.copingMechanisms ?? [],
    });

    const checkin = await checkinRepository.create({
      user: userId,
      anxietyLevel: payload.anxietyLevel,
      symptoms: payload.symptoms ?? [],
      triggers: payload.triggers ?? [],
      copingMechanisms: payload.copingMechanisms ?? [],
      notes: payload.notes,
      riskScore: result.score,
      recommendations: result.recommendations,
      modelVersion: result.modelVersion,
    });

    await mlService.recordOutput({
      userId,
      checkinId: checkin.id,
      score: result.score,
      metadata: result.metadata,
    });

    return checkin;
  }

  async getPatientSummary(userId: string) {
    const checkins = await checkinRepository.findByUser(userId, 30);
    const latest = checkins[0];

    return {
      currentAnxietyLevel: latest?.anxietyLevel ?? null,
      lastCheckin: latest?.createdAt ?? null,
      totalCheckins: checkins.length,
      riskLevel: latest ? this.computeRiskLabel(latest.riskScore) : 'unknown',
      checkinData: checkins
        .map((entry) => ({
          id: entry.id,
          date: entry.createdAt,
          anxietyLevel: entry.anxietyLevel,
          riskScore: entry.riskScore,
        }))
        .reverse(),
    };
  }

  async listPatientsForProvider() {
    const patients = await userRepository.list({ role: 'patient', isActive: true });

    return Promise.all(
      patients.map(async (patient) => {
        const latest = (await checkinRepository.findByUser(patient.id, 1))[0];
        return {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          riskLevel: latest ? this.computeRiskLabel(latest.riskScore) : 'unknown',
          lastCheckin: latest?.createdAt ?? null,
          checkinData: latest ? [{ date: latest.createdAt, anxietyLevel: latest.anxietyLevel }] : [],
        };
      })
    );
  }

  private computeRiskLabel(score: number) {
    if (score >= 0.8) return 'high';
    if (score >= 0.6) return 'medium';
    return 'low';
  }
}

export const checkinService = new CheckinService();
