import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
    id: string;
    email: string;
    role: string;
    token: string;
}

interface AdminAuthContextType {
    user: AdminUser | null;
    login: (userData: AdminUser) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AdminUser | null>(null);

    // Revisar el cache local al cargar
    useEffect(() => {
        const storedAuth = localStorage.getItem('conexion_admin_auth');
        if (storedAuth) {
            setUser(JSON.parse(storedAuth));
        }
    }, []);

    const login = (userData: AdminUser) => {
        setUser(userData);
        localStorage.setItem('conexion_admin_auth', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('conexion_admin_auth');
        window.location.href = '/admin/login'; // Redirect duro
    };

    return (
        <AdminAuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user?.token
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth debe ser usado dentro de un AdminAuthProvider');
    }
    return context;
};
