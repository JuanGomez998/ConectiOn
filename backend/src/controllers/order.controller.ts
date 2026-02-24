import { Request, Response, NextFunction } from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import prisma from '../config/database';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            address,
            city,
            paymentMethod,
            items
        } = req.body;

        // Basic validation
        if (!customerName || !customerPhone || !address || !city || !items || items.length === 0) {
            res.status(400).json({ success: false, message: 'Faltan datos requeridos para la orden' });
            return;
        }

        // Calculate total inside backend for security (prevent price tampering)
        let totalAmount = 0;
        const orderItemsData = [];
        const mpItems: any[] = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                res.status(404).json({ success: false, message: `Producto no encontrado: ${item.productId}` });
                return;
            }

            totalAmount += product.price * item.quantity;

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price // Save historical price
            });

            mpItems.push({
                id: product.id,
                title: product.name,
                unit_price: product.price,
                quantity: item.quantity
            });
        }

        // Add flat shipping cost if under threshold
        if (totalAmount < 150000) {
            totalAmount += 15000;
            mpItems.push({
                id: 'ENVIO',
                title: 'Costo de Envío Nacional',
                unit_price: 15000,
                quantity: 1
            });
        }

        // Create Order and Items in a transaction
        const order = await prisma.order.create({
            data: {
                customerName,
                customerEmail,
                customerPhone,
                address,
                city,
                paymentMethod,
                totalAmount,
                items: {
                    create: orderItemsData
                }
            },
            include: {
                items: true
            }
        });

        let mpInitPoint = null;

        // Si paga mediante PSE, crear una preferencia en MercadoPago
        if (paymentMethod === 'PSE' && process.env.MP_ACCESS_TOKEN) {
            try {
                const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
                const preference = new Preference(client);

                const result = await preference.create({
                    body: {
                        items: mpItems,
                        back_urls: {
                            success: 'http://localhost:5173/checkout/success',
                            failure: 'http://localhost:5173/checkout/failure',
                            pending: 'http://localhost:5173/checkout/pending',
                        },
                        auto_return: 'approved',
                        external_reference: order.id,
                    }
                });

                mpInitPoint = result.sandbox_init_point;
            } catch (mpError) {
                console.error("Error creando preferencia en MercadoPago:", mpError);
            }
        }

        res.status(201).json({
            success: true,
            data: order,
            mpInitPoint // Send MP URL to frontend if PSE
        });

    } catch (error) {
        next(error);
    }
};

// --- ADMIN ENDPOINTS ---

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await prisma.order.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true, role: true } } }
        });

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: {
                items: {
                    include: { product: { select: { name: true, image: true } } }
                },
                user: { select: { email: true } }
            }
        });

        if (!order) {
            res.status(404).json({ success: false, message: 'Orden no encontrada' });
            return;
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.body;

        if (!status) {
            res.status(400).json({ success: false, message: 'El estado es requerido' });
            return;
        }

        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status }
        });

        if (req.user) {
            await prisma.auditLog.create({
                data: {
                    userId: req.user.id,
                    action: 'UPDATE',
                    entity: 'Order',
                    entityId: order.id,
                    details: `Estado de orden cambiado a ${status}`
                }
            });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};
