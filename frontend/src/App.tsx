import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { Products } from './pages/Products/Products';
import { ProductDetail } from './pages/ProductDetail/ProductDetail';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer/CartDrawer';
import './index.css';

function App() {
    return (
        <CartProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <CartDrawer />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/productos" element={<Products />} />
                            <Route path="/producto/:id" element={<ProductDetail />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
