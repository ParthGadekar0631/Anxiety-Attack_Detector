import { Router } from 'express';
import { z } from 'zod';
import { mlController } from '../../controllers/ml.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validateBody } from '../../middlewares/validation.middleware';

const router = Router();

const predictionSchema = z.object({
  userId: z.string().optional(),
  anxietyLevel: z.number().min(0).max(10),
  symptoms: z.array(z.string()).default([]),
  triggers: z.array(z.string()).default([]),
  copingMechanisms: z.array(z.string()).default([]),
});

router.post('/predict', authenticate, authorize('provider', 'admin'), validateBody(predictionSchema), mlController.predict);

export const mlRoutes = router;
