import React, { useState, useEffect } from 'react';
import { Hero } from '../../components/Hero/Hero';
import { Features } from '../../components/Features/Features';
import { ProductCard, Product } from '../../components/ProductCard/ProductCard';

export const Home: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/products');
                const data = await response.json();
                if (data.success) {
                    // Solo mostramos los 3 más recientes en el Home
                    setFeaturedProducts(data.data.slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="page-wrapper">
            <Hero />
            <Features />

            <section className="container" style={{ padding: '6rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h2 className="section-title">Nuevos <span className="text-gradient">Ingresos</span></h2>
                        <p className="section-subtitle" style={{ margin: 0 }}>Lo último en tecnología premium a tu alcance.</p>
                    </div>
                    <a href="/productos" className="btn btn-outline" style={{ display: 'none' }}>Ver Todos</a>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Cargando productos premium...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <section style={{ padding: '4rem 0', background: 'var(--color-surface)', textAlign: 'center' }}>
                <div className="container">
                    <h2 className="section-title">¿Listo para mejorar tu experiencia?</h2>
                    <p className="section-subtitle" style={{ marginBottom: '2rem' }}>Escríbenos y te asesoramos para elegir tu próximo dispositivo.</p>
                    <a href="https://wa.me/573024242009?text=Hola,%20vengo%20desde%20la%20página%20web%20y%20me%20gustaría%20recibir%20asesoría." target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                        Contactar por WhatsApp
                    </a>
                </div>
            </section>
        </div>
    );
};
