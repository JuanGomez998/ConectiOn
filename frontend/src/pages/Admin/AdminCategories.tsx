import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { Plus, Search, Edit2, Trash2, Check, EyeOff } from 'lucide-react';
import AdminCategoryForm from './AdminCategoryForm';
import './AdminCategories.css';

interface Category {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    _count?: {
        products: number;
    };
}

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const { data } = await adminApi.get('/categories');
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error("Error cargando categorías:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        const actionText = currentStatus ? 'desactivar' : 'activar';
        const warning = currentStatus ? '\n\nNOTA: Los productos asociados seguirán existiendo, pero si la categoría se oculta puede afectar la vista pública.' : '';

        if (!window.confirm(`¿Estás seguro de ${actionText} esta categoría?${warning}`)) return;

        try {
            await adminApi.put(`/categories/${id}`, { isActive: !currentStatus });
            fetchCategories();
        } catch (error) {
            console.error("Error cambiando estado de categoría", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Seguro que deseas eliminar virtualmente esta categoría? No aparecerá más, pero sus datos se conservarán en historial.")) return;
        try {
            await adminApi.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error("Error eliminando categoría:", error);
        }
    };

    const handleOpenCreateModal = () => {
        setCategoryToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (cat: Category) => {
        setCategoryToEdit(cat);
        setIsModalOpen(true);
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="admin-categories-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Agrupación de Productos</h2>
                    <p className="admin-page-subtitle">Gestiona las categorías y departamentos de tu tienda.</p>
                </div>
                <button className="admin-btn-primary" onClick={handleOpenCreateModal}>
                    <Plus size={18} />
                    Nueva Categoría
                </button>
            </div>

            <div className="admin-card">
                <div className="admin-table-toolbar">
                    <div className="admin-search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar categorías..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="admin-loading-state">Cargando grupos...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nombre de Categoría</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map(cat => (
                                    <tr key={cat.id} className={!cat.isActive ? 'row-inactive' : ''}>
                                        <td className="font-bold">{cat.name}</td>
                                        <td className="text-muted">{cat.description || 'Sin descripción'}</td>
                                        <td>
                                            <span className={`admin-badge ${cat.isActive ? 'badge-success' : 'badge-neutral'}`}>
                                                {cat.isActive ? 'Activa' : 'Oculta'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="admin-actions-group">
                                                <button
                                                    className="action-btn text-primary"
                                                    title="Editar"
                                                    onClick={() => handleOpenEditModal(cat)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className="action-btn text-warning"
                                                    title={cat.isActive ? "Ocultar" : "Mostrar"}
                                                    onClick={() => toggleStatus(cat.id, cat.isActive)}
                                                >
                                                    {cat.isActive ? <EyeOff size={16} /> : <Check size={16} />}
                                                </button>
                                                <button
                                                    className="action-btn text-danger"
                                                    title="Eliminar (Soft Delete)"
                                                    onClick={() => handleDelete(cat.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCategories.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="admin-empty-text">No se hallaron categorías.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AdminCategoryForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchCategories();
                }}
                categoryToEdit={categoryToEdit}
            />
        </div>
    );
};

export default AdminCategories;
