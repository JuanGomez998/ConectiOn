import { Router } from 'express';
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
} from '../controllers/order.controller';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Rutas Públicas
router.post('/', createOrder);

// Rutas Privadas / Admin
router.get('/', protect, adminOnly, getOrders);
router.get('/:id', protect, adminOnly, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
