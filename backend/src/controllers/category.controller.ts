import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id: req.params.id }
        });

        if (!category) {
            res.status(404).json({ success: false, message: 'Categoría no encontrada' });
            return;
        }
        res.json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            res.status(400).json({ success: false, message: 'El nombre de la categoría es requerido' });
            return;
        }

        const category = await prisma.category.create({
            data: { name, description }
        });

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, isActive } = req.body;

        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: {
                name,
                description,
                isActive: isActive !== undefined ? isActive : undefined
            }
        });

        res.json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Soft delete
        await prisma.category.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });

        res.json({ success: true, message: 'Categoría desactivada correctamente' });
    } catch (error) {
        next(error);
    }
};
