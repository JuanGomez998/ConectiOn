import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { Search, Eye, Filter } from 'lucide-react';
import AdminOrderModal from './AdminOrderModal';
import './AdminOrders.css';

interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    totalAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    createdAt: string;
    items?: OrderItem[];
}

const statusColors: Record<string, string> = {
    PENDING: 'badge-warning',
    CONFIRMED: 'badge-info',
    SHIPPED: 'badge-primary',
    DELIVERED: 'badge-success',
    CANCELLED: 'badge-danger'
};

const statusTranslations: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    SHIPPED: 'Enviada',
    DELIVERED: 'Entregada',
    CANCELLED: 'Cancelada'
};

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const { data } = await adminApi.get('/orders');
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Error cargando órdenes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await adminApi.put(`/orders/${orderId}/status`, { status: newStatus });
            // Update local state without refetching the whole list for perceived performance
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));

            // If the modal is open for this order, update that too
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus as any });
            }
        } catch (error) {
            console.error("Error actualizando estado:", error);
            alert("Hubo un problema actualizando el estado de la orden.");
        }
    };

    const openOrderDetails = async (order: Order) => {
        // Fetch full order details including items securely
        try {
            const { data } = await adminApi.get(`/orders/${order.id}`);
            if (data.success) {
                setSelectedOrder(data.data);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error cargando detalles:", error);
        }
    };

    // Derived state for filtering
    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="admin-orders-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Gestión de Órdenes</h2>
                    <p className="admin-page-subtitle">Supervisa las compras, envíos y pagos de los clientes.</p>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-table-toolbar">
                    <div className="admin-search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar ID, Cliente o Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="admin-filter-group">
                        <Filter size={18} />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="admin-select"
                        >
                            <option value="ALL">Todos los Estados</option>
                            <option value="PENDING">Pendientes</option>
                            <option value="CONFIRMED">Confirmadas</option>
                            <option value="SHIPPED">Enviadas</option>
                            <option value="DELIVERED">Entregadas</option>
                            <option value="CANCELLED">Canceladas</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="admin-loading-state">Cargando órdenes de compra...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID Orden</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="font-mono text-xs">...{order.id.slice(-8).toUpperCase()}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString('es-CO')}</td>
                                        <td>
                                            <div className="customer-info-cell">
                                                <span className="font-medium">{order.customerName}</span>
                                                <span className="text-xs text-muted">{order.customerEmail}</span>
                                            </div>
                                        </td>
                                        <td className="font-medium text-success">
                                            ${order.totalAmount ? order.totalAmount.toLocaleString('es-CO') : 0}
                                        </td>
                                        <td>
                                            <select
                                                className={`admin-status-dropdown ${statusColors[order.status]}`}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            >
                                                {Object.entries(statusTranslations).map(([key, label]) => (
                                                    <option key={key} value={key} className="status-option">{label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                className="action-btn text-primary inline-flex"
                                                title="Ver Detalles"
                                                onClick={() => openOrderDetails(order)}
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="admin-empty-text">No se encontraron órdenes.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AdminOrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default AdminOrders;
