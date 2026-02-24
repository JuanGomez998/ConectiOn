import 'dotenv/config';
import request from 'supertest';
import app from '../app';

describe('Authentication Middleware', () => {
    it('Debe retornar 401 No Autorizado al acceder a Métricas Admin sin token', async () => {
        const res = await request(app).get('/api/admin/metrics/dashboard');
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Not authorized/i);
    });

    it('Debe retornar 401 si un token inválido o corrupto es enviado', async () => {
        const res = await request(app)
            .get('/api/admin/metrics/dashboard')
            .set('Authorization', 'Bearer 12345fakeToken');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Not authorized/i);
    });
});
