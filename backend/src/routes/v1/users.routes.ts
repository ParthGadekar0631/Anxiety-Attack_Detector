import { Router } from 'express';
import { z } from 'zod';
import { userController } from '../../controllers/user.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validateBody } from '../../middlewares/validation.middleware';

const router = Router();

const roleSchema = z.object({
  role: z.enum(['patient', 'provider', 'admin']),
});

router.get('/', authenticate, authorize('admin'), userController.list);
router.patch('/:id/role', authenticate, authorize('admin'), validateBody(roleSchema), userController.updateRole);
router.delete('/:id', authenticate, authorize('admin'), userController.deactivate);

export const userRoutes = router;
