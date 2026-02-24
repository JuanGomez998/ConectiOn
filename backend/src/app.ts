import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import metricsRoutes from './routes/metrics.routes';
import auditRoutes from './routes/audit.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API de ConectiON 🚀' });
});

app.get('/api/health', (req, res) => {
    res.json({ message: 'ConectiON API - Health Check OK' });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/metrics', metricsRoutes);
app.use('/api/admin/audit', auditRoutes);

// Error Handling Middleware MUST be last
app.use(errorHandler);

export default app;
