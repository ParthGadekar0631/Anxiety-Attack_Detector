import { Router } from 'express';
import { z } from 'zod';
import { checkinController } from '../../controllers/checkin.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validateBody } from '../../middlewares/validation.middleware';

const router = Router();

const checkinSchema = z.object({
  anxietyLevel: z.number().min(0).max(10),
  symptoms: z.array(z.string()).default([]),
  triggers: z.array(z.string()).default([]),
  copingMechanisms: z.array(z.string()).default([]),
  notes: z.string().max(1000).optional(),
});

router.post('/', authenticate, authorize('patient'), validateBody(checkinSchema), checkinController.submit);
router.get('/me', authenticate, authorize('patient'), checkinController.mySummary);
router.get('/patients', authenticate, authorize('provider', 'admin'), checkinController.patients);

export const checkinRoutes = router;
