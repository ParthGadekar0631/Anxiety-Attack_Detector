import { predictor } from '../ml/index';
import { modelOutputRepository } from '../repositories/modelOutput.repository';
import type { PredictionInput } from '../ml/predictor.interface';

export class MlService {
  async predict(input: PredictionInput) {
    const result = await predictor.predict(input);
    return { ...result, modelVersion: predictor.version };
  }

  async recordOutput(params: { userId: string; checkinId: string; score: number; metadata?: Record<string, unknown> }) {
    return modelOutputRepository.create({
      user: params.userId,
      checkin: params.checkinId,
      score: params.score,
      modelVersion: predictor.version,
      metadata: params.metadata,
    });
  }
}

export const mlService = new MlService();
