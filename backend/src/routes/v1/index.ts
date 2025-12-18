import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { checkinRoutes } from './checkin.routes';
import { analyticsRoutes } from './analytics.routes';
import { userRoutes } from './users.routes';
import { mlRoutes } from './ml.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/checkins', checkinRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/users', userRoutes);
router.use('/ml', mlRoutes);

export const v1Routes = router;
