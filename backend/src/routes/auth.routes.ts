import { Router } from 'express';
import { loginAdmin, setupInitialAdmin } from '../controllers/auth.controller';

const router = Router();

// Endpoint oculto para inicializar el primer administrador si no hay ninguno.
router.post('/setup-root', setupInitialAdmin);

// Ruta pública de inicio de sesión para administradores/staff
router.post('/login', loginAdmin);

export default router;
