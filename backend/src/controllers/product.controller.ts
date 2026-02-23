import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category } = req.query;

        const products = await prisma.product.findMany({
            where: category ? { category: String(category) } : undefined,
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!product) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await prisma.product.create({
            data: req.body
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};
