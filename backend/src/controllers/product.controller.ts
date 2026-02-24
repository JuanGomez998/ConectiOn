import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

// Helper to determine if request comes from Admin
const isAdmin = (req: Request) => req.user && req.user.role === 'ADMIN';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category } = req.query;

        // Admins see all, public users only see active products
        const queryOptions: any = {
            where: {
                ...(isAdmin(req) ? {} : { isActive: true }),
                ...(category ? { category: String(category) } : {})
            },
            orderBy: { createdAt: 'desc' },
            include: { categoryRef: true }
        };

        const products = await prisma.product.findMany(queryOptions);

        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: { categoryRef: true }
        });

        if (!product) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }

        // Public users can't see inactive products
        if (!product.isActive && !isAdmin(req)) {
            res.status(404).json({ success: false, message: 'Producto no disponible' });
            return;
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productData = req.body;

        // Validations
        if (!productData.name || !productData.price || productData.price < 0 || productData.stock < 0) {
            res.status(400).json({ success: false, message: 'Datos de producto inválidos' });
            return;
        }

        const product = await prisma.product.create({
            data: {
                name: productData.name,
                description: productData.description || '',
                price: Number(productData.price),
                costPrice: productData.costPrice ? Number(productData.costPrice) : null,
                image: productData.image || '',
                category: productData.category || 'general', // Legacy
                categoryId: productData.categoryId || null,
                stock: Number(productData.stock) || 0,
                isNew: productData.isNew || false,
                isFeatured: productData.isFeatured || false,
                isActive: productData.isActive !== false,
            }
        });

        // Basic Audit Log recording
        if (req.user) {
            await prisma.auditLog.create({
                data: {
                    userId: req.user.id,
                    action: 'CREATE',
                    entity: 'Product',
                    entityId: product.id,
                    details: `Producto creado: ${product.name}`
                }
            });
        }

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productData = req.body;

        // Basic Validations if changing price/stock
        if (productData.price !== undefined && productData.price < 0) {
            res.status(400).json({ success: false, message: 'Precio inválido' }); return;
        }
        if (productData.stock !== undefined && productData.stock < 0) {
            res.status(400).json({ success: false, message: 'Stock inválido' }); return;
        }

        // Build update object safely to avoid Prisma null/undefined crashes
        const updateData: any = {};
        if (productData.name !== undefined) updateData.name = productData.name;
        if (productData.description !== undefined) updateData.description = productData.description;
        if (productData.price !== undefined) updateData.price = Number(productData.price);
        if (productData.costPrice !== undefined) updateData.costPrice = productData.costPrice !== '' ? Number(productData.costPrice) : null;
        if (productData.image !== undefined) updateData.image = productData.image;
        if (productData.category !== undefined) updateData.category = productData.category;
        if (productData.categoryId !== undefined) updateData.categoryId = productData.categoryId || null;
        if (productData.stock !== undefined) updateData.stock = Number(productData.stock);
        if (productData.isFeatured !== undefined) updateData.isFeatured = productData.isFeatured;
        if (productData.isActive !== undefined) updateData.isActive = productData.isActive;

        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: updateData
        });

        if (req.user) {
            await prisma.auditLog.create({
                data: {
                    userId: req.user.id,
                    action: 'UPDATE',
                    entity: 'Product',
                    entityId: product.id,
                    details: `Producto modificado`
                }
            });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Soft delete (hide from public view)
        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });

        if (req.user) {
            await prisma.auditLog.create({
                data: {
                    userId: req.user.id,
                    action: 'DELETE',
                    entity: 'Product',
                    entityId: product.id,
                    details: `Producto desactivado (Soft Delete)`
                }
            });
        }

        res.status(200).json({ success: true, message: 'Producto desactivado correctamente' });
    } catch (error) {
        next(error);
    }
};
