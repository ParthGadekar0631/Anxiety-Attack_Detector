export interface PredictionInput {
  userId: string;
  anxietyLevel: number;
  symptoms: string[];
  triggers: string[];
  copingMechanisms: string[];
}

export interface PredictionOutput {
  score: number;
  recommendations: string[];
  metadata?: Record<string, unknown>;
}

export interface Predictor {
  predict(input: PredictionInput): Promise<PredictionOutput>;
  version: string;
}
