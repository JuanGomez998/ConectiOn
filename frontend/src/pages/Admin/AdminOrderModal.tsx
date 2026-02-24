import React from 'react';
import { X, Printer } from 'lucide-react';

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

interface AdminOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onStatusChange: (id: string, status: string) => void;
}

const statusTranslations: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    SHIPPED: 'Enviada',
    DELIVERED: 'Entregada',
    CANCELLED: 'Cancelada'
};

const statusColors: Record<string, string> = {
    PENDING: 'badge-warning',
    CONFIRMED: 'badge-info',
    SHIPPED: 'badge-primary',
    DELIVERED: 'badge-success',
    CANCELLED: 'badge-danger'
};

const AdminOrderModal: React.FC<AdminOrderModalProps> = ({ isOpen, onClose, order, onStatusChange }) => {
    if (!isOpen || !order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-container" style={{ maxWidth: '800px' }}>
                <div className="admin-modal-header" style={{ alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            Orden #{order.id.slice(-8).toUpperCase()}
                            <span className={`admin-badge ${statusColors[order.status]} text-xs`}>
                                {statusTranslations[order.status]}
                            </span>
                        </h3>
                        <p className="admin-page-subtitle">Creada el {new Date(order.createdAt).toLocaleString('es-CO')}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="admin-btn-secondary" onClick={handlePrint} title="Imprimir Recibo">
                            <Printer size={18} />
                        </button>
                        <button className="admin-modal-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Customer & Shipping Row */}
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--admin-border)' }}>
                            <h4 style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos del Cliente</h4>
                            <p className="font-medium" style={{ marginBottom: '0.25rem' }}>{order.customerName}</p>
                            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>📧 {order.customerEmail}</p>
                            <p className="text-muted" style={{ fontSize: '0.875rem' }}>📞 {order.customerPhone}</p>
                        </div>

                        <div style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--admin-border)' }}>
                            <h4 style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dirección de Envío</h4>
                            <p className="font-medium" style={{ marginBottom: '0.25rem' }}>{order.shippingAddress}</p>
                            <p className="text-muted" style={{ fontSize: '0.875rem' }}>📍 Ciudad: {order.city}</p>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div>
                        <h4 style={{ color: 'var(--admin-text)', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>Artículos Comprados</h4>

                        {order.items && order.items.length > 0 ? (
                            <table className="admin-table" style={{ marginTop: 0 }}>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th style={{ textAlign: 'center' }}>Cant.</th>
                                        <th className="text-right">Precio Unitario</th>
                                        <th className="text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px dashed var(--admin-border)' }}>
                                            <td className="font-medium">{item.productName || 'Producto Eliminado'}</td>
                                            <td style={{ textAlign: 'center' }}>x{item.quantity}</td>
                                            <td className="text-right text-muted">${item.price.toLocaleString('es-CO')}</td>
                                            <td className="text-right font-medium">${(item.quantity * item.price).toLocaleString('es-CO')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-muted">No se cargaron los items o la orden está vacía.</p>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingRight: '1rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Costo de Envío: $0</p>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--admin-success)', margin: 0 }}>Total: ${order.totalAmount ? order.totalAmount.toLocaleString('es-CO') : 0}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Mover orden a:</label>
                        <select
                            className={`admin-status-dropdown ${statusColors[order.status]}`}
                            value={order.status}
                            onChange={(e) => onStatusChange(order.id, e.target.value)}
                            style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                        >
                            {Object.entries(statusTranslations).map(([key, label]) => (
                                <option key={key} value={key} className="status-option">{label}</option>
                            ))}
                        </select>
                    </div>

                    <button className="admin-btn-secondary" onClick={onClose}>
                        Cerrar Detalles
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderModal;
