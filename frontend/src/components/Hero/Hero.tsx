import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

export const Hero: React.FC = () => {
    return (
        <section className="hero">
            <div className="hero-background">
                <div className="hero-glow hero-glow-1"></div>
                <div className="hero-glow hero-glow-2"></div>
            </div>

            <div className="container hero-container animate-fade-in">
                <span className="hero-badge">Nueva Colección 2026</span>
                <h1 className="hero-title">
                    Tecnología Premium,<br />
                    <span className="text-gradient">a tu alcance.</span>
                </h1>
                <p className="hero-subtitle">
                    Descubre réplicas de la más alta calidad con garantía completa.
                    Entrega inmediata y un regalo especial en cada compra.
                </p>

                <div className="hero-actions">
                    <Link to="/productos" className="btn btn-primary">
                        Explorar Catálogo
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                    <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="btn btn-outline">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Asesoría WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
};
