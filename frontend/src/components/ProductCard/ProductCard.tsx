import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    isNew?: boolean;
}

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="product-card group">
            <div className="product-image-wrapper">
                <Link to={`/producto/${product.id}`}>
                    <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
                </Link>
                {product.isNew && <span className="product-badge">NUEVO</span>}
                <button
                    className="product-add-btn"
                    aria-label="Añadir al carrito"
                    onClick={() => addToCart(product)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
            <div className="product-info">
                <p className="product-category">{product.category}</p>
                <Link to={`/producto/${product.id}`}>
                    <h3 className="product-name">{product.name}</h3>
                </Link>
                <p className="product-price">
                    ${product.price.toLocaleString('es-CO')}
                </p>
            </div>
        </div>
    );
};
