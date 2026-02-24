import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

interface FormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    paymentMethod: 'COD' | 'PSE';
}

export const Checkout: React.FC = () => {
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        paymentMethod: 'COD'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                address: formData.address,
                city: formData.city,
                paymentMethod: formData.paymentMethod,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Error al crear la orden');
            }

            if (formData.paymentMethod === 'COD') {
                alert(`¡Orden #${result.data.id.slice(0, 8)} creada exitosamente para ${formData.name}! Pagarás $${result.data.totalAmount.toLocaleString('es-CO')} en efectivo al recibir.`);
                clearCart();
                navigate('/');
            } else if (formData.paymentMethod === 'PSE') {
                if (result.mpInitPoint) {
                    clearCart();
                    window.location.href = result.mpInitPoint; // Redirect to MercadoPago
                } else {
                    alert('Validando simulación PSE local... \n\n(No se configuró token de MP)');
                    clearCart();
                    navigate('/');
                }
            }

        } catch (error: any) {
            console.error('Error procesando checkout:', error);
            alert(`Hubo un error procesando tu orden: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="checkout-empty container">
                <h2>Tu carrito está vacío</h2>
                <p>Añade algunos productos antes de proceder al pago.</p>
                <button className="btn btn-primary" onClick={() => navigate('/productos')}>
                    Ver Catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-page container section">
            <div className="checkout-header text-center">
                <h2>Finalizar Compra</h2>
                <p>Estás a un paso de recibir tus productos</p>
            </div>

            <div className="checkout-content">
                <form className="checkout-form box-glass" onSubmit={handleSubmit}>
                    <h3>Datos de Envío</h3>
                    <div className="form-group">
                        <label htmlFor="name">Nombre Completo</label>
                        <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="juan@correo.com" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Celular</label>
                            <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} placeholder="300 000 0000" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="address">Dirección de Entrega</label>
                            <input type="text" id="address" name="address" required value={formData.address} onChange={handleChange} placeholder="Calle 123 # 45 - 67" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">Ciudad</label>
                            <input type="text" id="city" name="city" required value={formData.city} onChange={handleChange} placeholder="Bogotá, Medellín..." />
                        </div>
                    </div>

                    <h3 className="payment-title">Método de Pago</h3>
                    <div className="payment-options">
                        <label className={`payment-option ${formData.paymentMethod === 'COD' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={formData.paymentMethod === 'COD'}
                                onChange={handleChange}
                            />
                            <div className="payment-option-content">
                                <strong>💵 Pago Contraentrega</strong>
                                <span>Pagas en efectivo al recibir tu pedido en la puerta de tu casa.</span>
                            </div>
                        </label>

                        <label className={`payment-option ${formData.paymentMethod === 'PSE' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="PSE"
                                checked={formData.paymentMethod === 'PSE'}
                                onChange={handleChange}
                            />
                            <div className="payment-option-content">
                                <strong>💳 Pago en Línea (PSE / Tarjeta)</strong>
                                <span>Serás redirigido a una pasarela 100% segura para completar el pago.</span>
                            </div>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary checkout-submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Procesando...' : `Confirmar y Pagar $${totalPrice.toLocaleString('es-CO')}`}
                    </button>
                </form>

                <div className="checkout-summary box-glass">
                    <h3>Resumen de tu Orden</h3>
                    <ul className="summary-items">
                        {items.map(item => (
                            <li key={item.id} className="summary-item">
                                <div className="summary-item-img">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="summary-item-info">
                                    <h4>{item.name}</h4>
                                    <span>Cant: {item.quantity}</span>
                                </div>
                                <div className="summary-item-price">
                                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${totalPrice.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="summary-row">
                            <span>Envío</span>
                            <span>{totalPrice >= 150000 ? 'Gratis' : '$15.000'}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total a Pagar</span>
                            <span>${(totalPrice + (totalPrice >= 150000 ? 0 : 15000)).toLocaleString('es-CO')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
