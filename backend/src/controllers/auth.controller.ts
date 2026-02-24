import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';

// Helper for generating JWTs
const generateToken = (id: string, email: string, role: string) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Por favor provea email y contraseña' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Verifying password hash
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            if (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR') {
                res.status(403).json({ success: false, message: 'Su cuenta no tiene permisos administrativos.' });
                return;
            }

            if (!user.isActive) {
                res.status(403).json({ success: false, message: 'Esta cuenta ha sido desactivada.' });
                return;
            }

            res.json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id, user.email, user.role),
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (error) {
        next(error);
    }
};

// DEV ONLY: Endpoint to seed an initial admin (since there is no UI to "register" admins)
export const setupInitialAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminCount = await prisma.user.count({
            where: { role: 'ADMIN' }
        });

        if (adminCount > 0) {
            res.status(400).json({ success: false, message: 'Ya existe un administrador en el sistema' });
            return;
        }

        // Create setup
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const newAdmin = await prisma.user.create({
            data: {
                email: 'admin@conexion.com',
                passwordHash: hashedPassword,
                role: 'ADMIN',
            }
        });

        res.status(201).json({
            success: true,
            message: 'Administrador base creado correctamente. Email: admin@conexion.com | Pass: admin123'
        });

    } catch (error) {
        next(error);
    }
};
