import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminRoute: React.FC = () => {
    const { isAuthenticated, user } = useAdminAuth();

    // Check if authenticated AND is an admin
    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
