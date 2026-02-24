import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Rutas Públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas Privadas / Admin
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
