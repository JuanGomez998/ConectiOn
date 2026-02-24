import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100, // Limit to last 100 for performance
            include: {
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                }
            }
        });

        res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        next(error);
    }
};
