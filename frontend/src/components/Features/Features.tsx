import React from 'react';
import './Features.css';

const featuresList = [
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
        ),
        title: 'Envío Gratis Hoy',
        description: 'Envíos exprés gratuitos a nivel nacional en compras superiores a $100.000.',
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
        ),
        title: 'Garantía Extendida',
        description: 'Más allá de la garantía estándar, obtén 6 meses adicionales gratis en esta temporada.',
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                <rect x="2" y="7" width="20" height="5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
        ),
        title: 'Regalo + 15% DCTO',
        description: 'Lleva un case protector de regalo y 15% de descuento en tu primer smartwatch.',
    }
];

export const Features: React.FC = () => {
    return (
        <section id="beneficios" className="features promo-section">
            <div className="container features-container">
                <div className="promo-banner">
                    <span className="promo-badge animate-pulse">⚡ OFERTAS DE TEMPORADA</span>
                    <h2 className="section-title">Desbloquea tus <span className="text-gradient">Beneficios Premium</span></h2>
                    <p className="section-subtitle">Por tiempo limitado, todas tus compras en ConectiON incluyen ventajas exclusivas diseñadas para ti.</p>

                    <a href="https://wa.me/573024242009?text=Hola,%20quiero%20hacer%20válidos%20los%20beneficios%20de%20temporada%20en%20mi%20compra." target="_blank" rel="noreferrer" className="btn btn-primary promo-btn">
                        Reclamar Beneficios por WhatsApp
                    </a>
                </div>

                <div className="features-grid">
                    {featuresList.map((feature, index) => (
                        <div key={index} className="feature-card promo-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
