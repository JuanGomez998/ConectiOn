import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export const getDashboardMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. Total ventas de HOY
        const todayOrders = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                createdAt: { gte: today },
                status: { not: 'CANCELLED' }
            }
        });

        // 2. Total ventas del MES
        const monthOrders = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                createdAt: { gte: firstDayOfMonth },
                status: { not: 'CANCELLED' }
            }
        });

        // 3. Conteo de Órdenes Pendientes
        const pendingOrdersCount = await prisma.order.count({
            where: { status: 'PENDING', isActive: true }
        });

        // 4. Productos con stock bajo (< 5)
        const lowStockProducts = await prisma.product.findMany({
            where: { stock: { lt: 5 }, isActive: true },
            select: { id: true, name: true, stock: true },
            take: 5
        });

        // 5. Los 5 Productos más vendidos (agrupados por OrderItem)
        const topSellingItems = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5
        });

        // Extraer nombres para los top sellers
        const topSellingProducts = await Promise.all(
            topSellingItems.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: { name: true, image: true, price: true }
                });
                return {
                    ...product,
                    totalSold: item._sum.quantity
                };
            })
        );

        res.status(200).json({
            success: true,
            data: {
                todaySales: todayOrders._sum.totalAmount || 0,
                monthSales: monthOrders._sum.totalAmount || 0,
                pendingOrdersCount,
                lowStockProducts,
                topSellingProducts
            }
        });

    } catch (error) {
        next(error);
    }
};
