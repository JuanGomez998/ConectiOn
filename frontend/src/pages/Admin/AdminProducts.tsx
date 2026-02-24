import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { Plus, Search, Edit2, Trash2, EyeOff, Check } from 'lucide-react';
import AdminProductForm from './AdminProductForm';
import './AdminProducts.css';

interface Product {
    id: string;
    name: string;
    price: number;
    costPrice?: number;
    stock: number;
    category: string;
    isActive: boolean;
    isFeatured: boolean;
    image: string;
}

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal Setup
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            // Nota: El backend público (`/api/products`) por defecto solo trae activos. 
            // Necesitamos que el Admin traiga TODO (incluyendo inactivos).
            // Usaremos una query string `?all=true` que debemos soportar en el backend, 
            // o simplemente traemos todos desde una ruta exclusiva de admin.
            // Por ahora, asumimos que el backend de admin traerá todos si pasamos `all`.
            const { data } = await adminApi.get('/products?all=true');
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error("Error cargando productos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        if (!window.confirm(`¿Estás seguro de ${currentStatus ? 'desactivar' : 'activar'} este producto?`)) return;

        try {
            // En nuestra API, desactivar es un UPDATE parcial. 
            // O podemos usar un endpoint especifico. Usaremos el de Update.
            await adminApi.put(`/products/${id}`, { isActive: !currentStatus });
            fetchProducts();
        } catch (error) {
            console.error("Error cambiando estado:", error);
            alert("No se pudo actualizar el estado.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Seguro que deseas eliminar virtualmente (soft delete) este producto?")) return;
        try {
            await adminApi.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Error eliminando:", error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreateModal = () => {
        setProductToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        fetchProducts();
    };

    return (
        <div className="admin-products-page">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Gestión de Productos</h2>
                    <p className="admin-page-subtitle">Inventario, precios y visibilidad.</p>
                </div>
                <button className="admin-btn-primary" onClick={handleOpenCreateModal}>
                    <Plus size={18} />
                    Nuevo Producto
                </button>
            </div>

            <div className="admin-card">
                <div className="admin-table-toolbar">
                    <div className="admin-search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="admin-loading-state">Cargando inventario...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio Venta</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id} className={!product.isActive ? 'row-inactive' : ''}>
                                        <td className="admin-flex-cell">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="admin-row-img" />
                                            ) : (
                                                <div className="admin-row-img-placeholder">NA</div>
                                            )}
                                            <div className="product-name-block">
                                                <span className="font-medium">{product.name}</span>
                                                {product.isFeatured && <span className="featured-badge">Destacado</span>}
                                            </div>
                                        </td>
                                        <td>{product.category}</td>
                                        <td className="font-medium text-success">${product.price.toLocaleString('es-CO')}</td>
                                        <td>
                                            <span className={`stock-indicator ${product.stock < 5 ? 'stock-low' : 'stock-ok'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${product.isActive ? 'badge-success' : 'badge-neutral'}`}>
                                                {product.isActive ? 'Activo' : 'Oculto'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="admin-actions-group">
                                                <button
                                                    className="action-btn text-primary"
                                                    title="Editar"
                                                    onClick={() => handleOpenEditModal(product)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className="action-btn text-warning"
                                                    title={product.isActive ? "Ocultar" : "Mostrar"}
                                                    onClick={() => toggleStatus(product.id, product.isActive)}
                                                >
                                                    {product.isActive ? <EyeOff size={16} /> : <Check size={16} />}
                                                </button>
                                                <button
                                                    className="action-btn text-danger"
                                                    title="Eliminar (Soft Delete)"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="admin-empty-text">No se encontraron productos coincidentes.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AdminProductForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                productToEdit={productToEdit}
            />
        </div>
    );
};

export default AdminProducts;
