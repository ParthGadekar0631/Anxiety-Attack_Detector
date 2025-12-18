import { Router } from 'express';
import { analyticsController } from '../../controllers/analytics.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';

const router = Router();

router.get('/summary', authenticate, authorize('admin'), analyticsController.summary);

export const analyticsRoutes = router;
