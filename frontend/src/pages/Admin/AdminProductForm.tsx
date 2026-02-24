import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { X, Save } from 'lucide-react';
import './AdminProductForm.css';

interface Category {
    id: string;
    name: string;
}

interface ProductFormData {
    id?: string;
    name: string;
    description: string;
    price: number | '';
    costPrice: number | '';
    stock: number | '';
    categoryId: string;
    image: string;
    isFeatured: boolean;
    isActive: boolean;
}

interface AdminProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productToEdit?: any; // If null, it's create mode
}

const initialFormState: ProductFormData = {
    name: '',
    description: '',
    price: '',
    costPrice: '',
    stock: '',
    categoryId: '',
    image: '',
    isFeatured: false,
    isActive: true
};

const AdminProductForm: React.FC<AdminProductFormProps> = ({ isOpen, onClose, onSuccess, productToEdit }) => {
    const [formData, setFormData] = useState<ProductFormData>(initialFormState);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch categories for the dropdown
        const fetchCategories = async () => {
            try {
                const { data } = await adminApi.get('/categories');
                if (data.success) {
                    setCategories(data.data);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                id: productToEdit.id,
                name: productToEdit.name,
                description: productToEdit.description || '',
                price: productToEdit.price,
                costPrice: productToEdit.costPrice || '',
                stock: productToEdit.stock,
                categoryId: productToEdit.categoryId || '',
                image: productToEdit.image || '',
                isFeatured: productToEdit.isFeatured,
                isActive: productToEdit.isActive
            });
        } else {
            setFormData(initialFormState);
        }
        setError('');
    }, [productToEdit, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                costPrice: formData.costPrice !== '' ? Number(formData.costPrice) : null,
                category: categories.find(c => c.id === formData.categoryId)?.name || 'General' // Legacy compat
            };

            if (productToEdit) {
                await adminApi.put(`/products/${productToEdit.id}`, payload);
            } else {
                await adminApi.post('/products', payload);
            }

            onSuccess(); // Triggers table refresh and closes modal
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error guardando producto');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-container">
                <div className="admin-modal-header">
                    <h3>{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                    <button className="admin-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="admin-modal-body">
                    {error && <div className="admin-error-banner">{error}</div>}

                    <form id="product-form" onSubmit={handleSubmit} className="admin-form">

                        {/* Fila 1 */}
                        <div className="admin-form-row">
                            <div className="admin-form-group flex-2">
                                <label>Nombre del Producto *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: Teclado Mecánico RGB"
                                />
                            </div>
                            <div className="admin-form-group flex-1">
                                <label>Categoría</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">-- Seleccionar --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Fila 2: Finanzas */}
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Precio de Venta ($) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    placeholder="0"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Costo de Compra ($) <span className="admin-label-hint">(Opcional)</span></label>
                                <input
                                    type="number"
                                    name="costPrice"
                                    value={formData.costPrice}
                                    onChange={handleInputChange}
                                    min="0"
                                    placeholder="0"
                                    title="Usado para calcular margen de ganancia en reportes"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Stock Inicial *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    placeholder="10"
                                />
                            </div>
                        </div>

                        {/* Fila 3: Imagen y Descripción */}
                        <div className="admin-form-group">
                            <label>URL de la Imagen *</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                required
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Características, detalles, etc."
                            ></textarea>
                        </div>

                        {/* Fila 4: Flags */}
                        <div className="admin-form-checkbox-group">
                            <label className="admin-checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleInputChange}
                                />
                                <span>Destacar en Inicio (Hero/Banners)</span>
                            </label>

                            <label className="admin-checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                />
                                <span>Visible en la tienda pública (Activo)</span>
                            </label>
                        </div>

                    </form>
                </div>

                <div className="admin-modal-footer">
                    <button type="button" className="admin-btn-secondary" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </button>
                    <button type="submit" form="product-form" className="admin-btn-primary" disabled={isLoading}>
                        <Save size={18} />
                        {isLoading ? 'Guardando...' : (productToEdit ? 'Actualizar Producto' : 'Crear Producto')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductForm;
