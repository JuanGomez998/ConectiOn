import { Router } from 'express';
import { getAuditLogs } from '../controllers/audit.controller';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', protect, adminOnly, getAuditLogs);

export default router;
