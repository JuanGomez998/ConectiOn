import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Product } from '../../components/ProductCard/ProductCard';
import './ProductDetail.css';

export const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/products/${id}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setProduct(data.data);
                } else {
                    setProduct(null);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return <div className="container" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh', color: 'var(--color-text-muted)' }}>Cargando detalles del producto...</div>;
    }

    if (!product) {
        return (
            <div className="container" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh' }}>
                <h2>Producto no encontrado</h2>
                <button onClick={() => navigate('/productos')} className="btn btn-outline" style={{ marginTop: '2rem' }}>Volver al Catálogo</button>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <div className="product-detail-page animate-fade-in">
            <div className="container product-detail-container">

                <div className="product-detail-image-section">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Volver
                    </button>

                    <div className="detail-image-wrapper">
                        <img src={product.image} alt={product.name} className="detail-image" />
                        {product.isNew && <span className="detail-badge">NUEVO</span>}
                    </div>
                </div>

                <div className="product-detail-info-section">
                    <p className="detail-category">{product.category}</p>
                    <h1 className="detail-title">{product.name}</h1>
                    <p className="detail-price">${product.price.toLocaleString('es-CO')}</p>

                    <div className="detail-divider"></div>

                    <p className="detail-description">
                        Experimenta el diseño moderno y la tecnología avanzada con este producto premium de ConectiON.
                        Garantía completa e incluye accesorios de regalo exclusivos directamente en tu empaque.
                    </p>

                    <ul className="detail-features-list">
                        <li>✔ Calidad Premium Auditada</li>
                        <li>✔ Garantía de 6 meses directos por sistema</li>
                        <li>✔ Entrega rápida a nivel nacional</li>
                        <li>✔ Regalo sorpresa asegurado por compra</li>
                    </ul>

                    <div className="detail-divider"></div>

                    <div className="detail-actions">
                        <button className="btn btn-primary detail-add-btn" onClick={handleAddToCart}>
                            Añadir al Carrito
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </button>
                        <a href={`https://wa.me/573024242009?text=Hola, quiero comprar el producto: ${product.name}`} target="_blank" rel="noreferrer" className="btn btn-outline detail-wa-btn">
                            Comprar por WhatsApp
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
};
