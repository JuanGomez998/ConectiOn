import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LayoutDashboard, Package, Folders, ShoppingCart, LogOut, History } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
    const { logout, user } = useAdminAuth();
    const location = useLocation();

    return (
        <div className="admin-container">
            {/* Sidebar Lateral */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>ConectiON <span>Admin</span></h2>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className={`admin-nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/products" className={`admin-nav-link ${location.pathname.includes('/admin/products') ? 'active' : ''}`}>
                        <Package size={20} />
                        <span>Productos</span>
                    </Link>
                    <Link to="/admin/categories" className={`admin-nav-link ${location.pathname.includes('/admin/categories') ? 'active' : ''}`}>
                        <Folders size={20} />
                        <span>Categorías</span>
                    </Link>
                    <Link to="/admin/orders" className={`admin-nav-link ${location.pathname.includes('/admin/orders') ? 'active' : ''}`}>
                        <ShoppingCart size={20} />
                        <span>Órdenes</span>
                    </Link>
                    <Link to="/admin/audit" className={`admin-nav-link ${location.pathname.includes('/admin/audit') ? 'active' : ''}`}>
                        <History size={20} />
                        <span>Auditoría</span>
                    </Link>
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-avatar">A</div>
                        <div className="admin-details">
                            <span className="admin-name">Administrador</span>
                            <span className="admin-email">{user?.email || 'admin@conexion.com'}</span>
                        </div>
                    </div>
                    <button className="admin-logout-btn" onClick={logout}>
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="admin-main">
                <div className="admin-main-header">
                    {/* Aqui podria ir migas de pan o acciones globales */}
                    <h3>Panel de Control</h3>
                </div>
                <div className="admin-content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
