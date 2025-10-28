import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchCart } from './features/cart/cartSlice';
import { logout } from './features/auth/authSlice';

// Import Components
import Navbar from './components/common/Navbar';
// ⭐️ 1. ลบ Import Footer ออก ⭐️
// import Footer from './components/common/Footer'; 
import AuthModal from './features/auth/AuthModal.jsx';
import CartModal from './features/cart/CartModal.jsx';

// Import Pages
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage'; 
import CartModal from './features/cart/CartModal';

// Import Pages
import ShopPage from './pages/ShopPage';
// import HomePage from './pages/HomePage'; (ควรสร้าง)
import AboutPage from './pages/About';

// Component ย่อยสำหรับจัดการ Layout และ Logic
function AppContent() { 
  const location = useLocation(); 
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setShowLogin(false);
    setShowCart(false);
  };

  return (
    <> 
      <Navbar 
        onLoginClick={() => setShowLogin(true)} 
        onCartClick={() => setShowCart(true)}
      />

      <Routes>
  {/* คุณสามารถเพิ่มหน้า Home และ About ได้ที่นี่ */}
  {/* <Route path="/" element={<HomePage />} /> */}
  <Route path="/about-us" element={<AboutPage />} />
  <Route path="/about" element={<AboutPage />} />

  {/* ตั้งค่าให้ / หรือ /shop-default แสดง ShopPage */}
        <Route path="/" element={<ShopPage />} />
        <Route path="/shop-default" element={<ShopPage />} /> 
        <Route path="/product-detail" element={<ProductDetailPage />} /> 
      </Routes>

      {/* ⭐️ 2. ลบบรรทัดที่เรียกใช้ Footer และเงื่อนไขออก ⭐️ */}
      {/* {location.pathname !== '/product-detail' && <Footer />} */}

      {/* Modals */}
      <AuthModal 
        show={showLogin} 
        onHide={() => setShowLogin(false)} 
      />
      <CartModal 
        show={showCart} 
        onHide={() => setShowCart(false)} 
      />
    </> 
  );
}

// Component App หลัก
function App() {
  return (
    <BrowserRouter>
      <AppContent /> 
    </BrowserRouter>
  );
}

export default App;