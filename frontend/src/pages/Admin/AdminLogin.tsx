import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, Mail } from 'lucide-react';
import adminApi from '../../services/adminApi';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data } = await adminApi.post('/admin/auth/login', { email, password });

            if (data.success) {
                login(data.data);
                navigate('/admin/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <h2>ConectiON <span>Admin</span></h2>
                    <p>Acceso exclusivo para personal autorizado</p>
                </div>

                {error && <div className="admin-login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-input-group">
                        <label>Correo Electrónico</label>
                        <div className="admin-input-wrapper">
                            <Mail size={18} className="admin-input-icon" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@tienda.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-input-group">
                        <label>Contraseña</label>
                        <div className="admin-input-wrapper">
                            <Lock size={18} className="admin-input-icon" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="admin-login-btn" disabled={isLoading}>
                        {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
