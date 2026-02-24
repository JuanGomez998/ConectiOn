import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { History, Search, FileText } from 'lucide-react';

interface AuditLog {
    id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    entity: string;
    entityId: string;
    details: string;
    createdAt: string;
    user?: {
        email: string;
        role: string;
    };
}

const actionColors: Record<string, string> = {
    CREATE: 'badge-success',
    UPDATE: 'badge-info',
    DELETE: 'badge-danger'
};

const actionTranslations: Record<string, string> = {
    CREATE: 'Creación',
    UPDATE: 'Actualización',
    DELETE: 'Eliminación'
};

const AdminAuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await adminApi.get('/admin/audit');
                if (data.success) {
                    setLogs(data.data);
                }
            } catch (error) {
                console.error("Error cargando historial de auditoría:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-orders-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title inline-flex" style={{ gap: '0.5rem' }}>
                        <History size={24} />
                        Historial de Auditoría
                    </h2>
                    <p className="admin-page-subtitle">Rastrea quién modificó productos, categorías u órdenes (Últimos 100 registros).</p>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-table-toolbar">
                    <div className="admin-search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar usuario, entidad o detalle..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ maxWidth: '400px' }}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="admin-loading-state">Extrayendo historial del servidor...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Fecha y Hora</th>
                                    <th>Usuario</th>
                                    <th>Acción</th>
                                    <th>Módulo</th>
                                    <th>Detalles / Descripción</th>
                                    <th className="text-right">Ref ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map(log => (
                                    <tr key={log.id}>
                                        <td className="text-xs text-muted">
                                            {new Date(log.createdAt).toLocaleString('es-CO')}
                                        </td>
                                        <td className="font-medium">
                                            {log.user?.email || 'Sistema / Eliminado'}
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${actionColors[log.action]}`}>
                                                {actionTranslations[log.action] || log.action}
                                            </span>
                                        </td>
                                        <td className="font-medium text-muted">
                                            {log.entity}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FileText size={14} className="text-muted" />
                                                <span>{log.details || 'Sin detalles'}</span>
                                            </div>
                                        </td>
                                        <td className="text-right font-mono text-xs text-muted" title={log.entityId}>
                                            ...{log.entityId.slice(-6).toUpperCase()}
                                        </td>
                                    </tr>
                                ))}
                                {filteredLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="admin-empty-text">No hay registros de auditoría que mostrar.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAuditLogs;
