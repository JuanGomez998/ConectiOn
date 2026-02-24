import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { DollarSign, Clock, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import './AdminDashboard.css';

interface DashboardMetrics {
    todaySales: number;
    monthSales: number;
    pendingOrdersCount: number;
    lowStockProducts: any[];
    topSellingProducts: any[];
}

const AdminDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const { data } = await adminApi.get('/admin/metrics/dashboard');
                if (data.success) {
                    setMetrics(data.data);
                }
            } catch (err: any) {
                setError('Error al cargar métricas del panel. ' + (err.response?.data?.message || ''));
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (isLoading) return <div className="admin-loading">Cargando métricas del negocio...</div>;
    if (error) return <div className="admin-error">{error}</div>;
    if (!metrics) return null;

    return (
        <div className="admin-dashboard">
            <h2 className="admin-page-title">Resumen de Negocio</h2>

            {/* KPI Cards */}
            <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                    <div className="kpi-icon-wrapper kpi-green">
                        <DollarSign size={24} />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Ventas Hoy</p>
                        <h3 className="kpi-value">${metrics.todaySales.toLocaleString('es-CO')}</h3>
                    </div>
                </div>

                <div className="admin-kpi-card">
                    <div className="kpi-icon-wrapper kpi-purple">
                        <TrendingUp size={24} />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Ventas este Mes</p>
                        <h3 className="kpi-value">${metrics.monthSales.toLocaleString('es-CO')}</h3>
                    </div>
                </div>

                <div className="admin-kpi-card">
                    <div className="kpi-icon-wrapper kpi-yellow">
                        <Clock size={24} />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Órdenes Pendientes</p>
                        <h3 className="kpi-value">{metrics.pendingOrdersCount}</h3>
                    </div>
                </div>

                <div className="admin-kpi-card">
                    <div className="kpi-icon-wrapper kpi-red">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Stock Crítico</p>
                        <h3 className="kpi-value">{metrics.lowStockProducts.length} <span className="kpi-sub">alertas</span></h3>
                    </div>
                </div>
            </div>

            {/* Tablas Inferiores */}
            <div className="admin-dashboard-tables">

                {/* Tabla de Alertas de Stock */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <AlertTriangle className="text-danger" size={20} />
                        <h3>Productos con Stock Bajo</h3>
                    </div>
                    {metrics.lowStockProducts.length === 0 ? (
                        <p className="admin-empty-text">El inventario está saludable. No hay alertas.</p>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Stock Actual</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics.lowStockProducts.map(prod => (
                                        <tr key={prod.id}>
                                            <td className="font-medium">{prod.name}</td>
                                            <td className={prod.stock === 0 ? 'text-danger fw-bold' : 'text-warning'}>
                                                {prod.stock} uds.
                                            </td>
                                            <td>
                                                <span className={`admin-badge ${prod.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                                                    {prod.stock === 0 ? 'Agotado' : 'Crítico'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Tabla de Top Sellers */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <Package className="text-primary" size={20} />
                        <h3>Top 5 Más Vendidos</h3>
                    </div>
                    {metrics.topSellingProducts.length === 0 ? (
                        <p className="admin-empty-text">No hay suficientes datos de ventas aún.</p>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Unid. Vendidas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics.topSellingProducts.map(prod => (
                                        <tr key={prod.name}>
                                            <td className="admin-flex-cell">
                                                {prod.image && <img src={prod.image} alt={prod.name} className="admin-row-img" />}
                                                <span className="font-medium">{prod.name}</span>
                                            </td>
                                            <td>${prod.price?.toLocaleString('es-CO')}</td>
                                            <td className="font-bold text-success">{prod.totalSold} u.</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
