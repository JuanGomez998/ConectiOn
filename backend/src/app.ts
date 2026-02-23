import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ message: 'ConectiON API - Health Check OK' });
});

// Routes
app.use('/api/products', productRoutes);

// Error Handling Middleware MUST be last
app.use(errorHandler);

export default app;
