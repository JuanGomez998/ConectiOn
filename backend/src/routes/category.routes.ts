import { Router } from 'express';
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Rutas Públicas
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Rutas Protegidas (Solo Admin)
router.use(protect, adminOnly); // Aplica a todas las de abajo
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
