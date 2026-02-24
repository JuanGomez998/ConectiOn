import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/metrics.controller';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

router.get('/dashboard', protect, adminOnly, getDashboardMetrics);

export default router;
