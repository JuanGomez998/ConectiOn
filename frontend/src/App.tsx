import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { Products } from './pages/Products/Products';
import { ProductDetail } from './pages/ProductDetail/ProductDetail';
import { Checkout } from './pages/Checkout/Checkout';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer/CartDrawer';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminAuditLogs from './pages/Admin/AdminAuditLogs';
import AdminRoute from './components/AdminRoute/AdminRoute';
import './index.css';

// Layout for Public App (with Navbar and Footer)
const PublicLayout = () => (
    <>
        <Navbar />
        <CartDrawer />
        <main>
            <Outlet />
        </main>
        <Footer />
    </>
);

function App() {
    return (
        <AdminAuthProvider>
            <CartProvider>
                <Router>
                    <div className="app">
                        <Routes>
                            {/* RUTAS ADMINISTRATIVAS */}
                            <Route path="/admin/login" element={<AdminLogin />} />

                            <Route element={<AdminRoute />}>
                                <Route path="/admin" element={<AdminLayout />}>
                                    <Route path="dashboard" element={<AdminDashboard />} />
                                    <Route path="products" element={<AdminProducts />} />
                                    <Route path="categories" element={<AdminCategories />} />
                                    <Route path="orders" element={<AdminOrders />} />
                                    <Route path="audit" element={<AdminAuditLogs />} />
                                </Route>
                            </Route>

                            {/* RUTAS PÚBLICAS (E-commerce) */}
                            <Route element={<PublicLayout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/productos" element={<Products />} />
                                <Route path="/producto/:id" element={<ProductDetail />} />
                                <Route path="/checkout" element={<Checkout />} />
                            </Route>
                        </Routes>
                    </div>
                </Router>
            </CartProvider>
        </AdminAuthProvider>
    );
}

export default App;
