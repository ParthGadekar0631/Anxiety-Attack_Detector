import { Request, Response } from 'express';
import { mlService } from '../services/ml.service';
import { HttpStatus } from '../utils/httpStatus';

class MlController {
  predict = async (req: Request, res: Response) => {
    const { userId = req.user?.sub, anxietyLevel, symptoms = [], triggers = [], copingMechanisms = [] } = req.body;
    const result = await mlService.predict({ userId, anxietyLevel, symptoms, triggers, copingMechanisms });
    res.status(HttpStatus.OK).json(result);
  };
}

export const mlController = new MlController();
