import { Predictor, PredictionInput, PredictionOutput } from './predictor.interface';

export class MockPredictor implements Predictor {
  public readonly version = 'v1-mock';

  async predict(input: PredictionInput): Promise<PredictionOutput> {
    const baseScore = input.anxietyLevel / 10;
    const symptomBoost = input.symptoms.length * 0.02;
    const triggerBoost = input.triggers.length * 0.015;
    const copingAdjustment = Math.max(0, 0.1 - input.copingMechanisms.length * 0.01);
    const score = Math.min(1, baseScore + symptomBoost + triggerBoost + copingAdjustment);

    return {
      score,
      recommendations: this.generateRecommendations(score, input),
      metadata: {
        symptomBoost,
        triggerBoost,
        copingAdjustment,
      },
    };
  }

  private generateRecommendations(score: number, input: PredictionInput): string[] {
    const messages = ['Continue tracking your symptoms and triggers daily.'];

    if (score >= 0.8) {
      messages.push('High risk detected. Consider reaching out to your provider immediately.');
    } else if (score >= 0.6) {
      messages.push('Moderate risk detected. Review coping strategies and schedule a check-in.');
    } else {
      messages.push('Risk remains low. Keep practicing coping mechanisms that work for you.');
    }

    if (!input.copingMechanisms.length) {
      messages.push('Log coping mechanisms to understand what helps you most.');
    }

    return messages;
  }
}

export const predictor = new MockPredictor();
