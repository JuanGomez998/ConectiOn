import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <h2 className="footer-logo text-gradient">ConectiON</h2>
                        <p className="footer-desc">
                            Tecnología premium accesible. Llevamos la mejor calidad a tus manos, siempre con un regalo extra.
                        </p>
                    </div>

                    <div className="footer-links-group">
                        <h3 className="footer-title">Navegación</h3>
                        <ul>
                            <li><a href="/">Inicio</a></li>
                            <li><a href="/productos">Catálogo</a></li>
                            <li><a href="#beneficios">Beneficios</a></li>
                        </ul>
                    </div>

                    <div className="footer-links-group">
                        <h3 className="footer-title">Legal</h3>
                        <ul>
                            <li><a href="#">Términos y Condiciones</a></li>
                            <li><a href="#">Políticas de Garantía</a></li>
                            <li><a href="#">Privacidad</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ConectiON. Todos los derechos reservados.</p>
                    <div className="footer-social">
                        {/* Instagram */}
                        <a href="#" aria-label="Instagram">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
