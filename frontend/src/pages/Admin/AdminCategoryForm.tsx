import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { X, Save } from 'lucide-react';

interface CategoryFormData {
    name: string;
    description: string;
    isActive: boolean;
}

interface AdminCategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    categoryToEdit?: any;
}

const initialFormState: CategoryFormData = {
    name: '',
    description: '',
    isActive: true
};

const AdminCategoryForm: React.FC<AdminCategoryFormProps> = ({ isOpen, onClose, onSuccess, categoryToEdit }) => {
    const [formData, setFormData] = useState<CategoryFormData>(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (categoryToEdit) {
            setFormData({
                name: categoryToEdit.name,
                description: categoryToEdit.description || '',
                isActive: categoryToEdit.isActive
            });
        } else {
            setFormData(initialFormState);
        }
        setError('');
    }, [categoryToEdit, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (categoryToEdit) {
                await adminApi.put(`/categories/${categoryToEdit.id}`, formData);
            } else {
                await adminApi.post('/categories', formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error guardando categoría');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-container" style={{ maxWidth: '500px' }}>
                <div className="admin-modal-header">
                    <h3>{categoryToEdit ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                    <button className="admin-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="admin-modal-body">
                    {error && <div className="admin-error-banner">{error}</div>}

                    <form id="category-form" onSubmit={handleSubmit} className="admin-form">
                        <div className="admin-form-group">
                            <label>Nombre *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Ej: Electrónica"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Aparatos, cables, y accesorios de tecnología..."
                            ></textarea>
                        </div>

                        {categoryToEdit && (
                            <div className="admin-form-checkbox-group">
                                <label className="admin-checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                    />
                                    <span>Categoría Activa (Visible en catálogo)</span>
                                </label>
                            </div>
                        )}
                    </form>
                </div>

                <div className="admin-modal-footer">
                    <button type="button" className="admin-btn-secondary" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </button>
                    <button type="submit" form="category-form" className="admin-btn-primary" disabled={isLoading}>
                        <Save size={18} />
                        {isLoading ? 'Guardando...' : 'Guardar Categoría'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoryForm;
