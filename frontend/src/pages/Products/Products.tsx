import React, { useState, useEffect } from 'react';
import { ProductCard, Product } from '../../components/ProductCard/ProductCard';
import api from '../../services/api';
import './Products.css';

const categories = ['Todos', 'Audio', 'Wearables', 'Accesorios'];

export const Products: React.FC = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                if (response.data && response.data.success) {
                    setAllProducts(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = activeCategory === 'Todos'
        ? allProducts
        : allProducts.filter(p => p.category === activeCategory);

    return (
        <div className="page-wrapper page-products">
            <div className="container" style={{ padding: '8rem 2rem 4rem' }}>
                <header className="products-header">
                    <h1 className="section-title">Cátalogo de <span className="text-gradient">Productos</span></h1>
                    <p className="section-subtitle" style={{ margin: 0 }}>Encuentra la mejor tecnología réplica y accesorios premium.</p>
                </header>

                <div className="products-filters">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Cargando catálogo...</div>
                ) : (
                    <div className="products-grid animate-fade-in">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
