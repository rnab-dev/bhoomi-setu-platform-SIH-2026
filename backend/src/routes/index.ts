import { Router } from 'express';
import healthRoutes from './health';

const router = Router();

// API V1 Routes
router.use('/', healthRoutes);

// Other routes will be added in later phases:
// router.use('/projects', projectRoutes);
// router.use('/parcels', parcelRoutes);

export default router;
