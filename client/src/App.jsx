import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { fetchCart } from './features/cart/cartSlice';
import { logout } from './features/auth/authSlice';

import Navbar from './components/common/Navbar';
import AuthModal from './features/auth/AuthModal.jsx';
import CartModal from './features/cart/CartModal.jsx';

import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/About.jsx';

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
        <Route path="/" element={<HomePage />} />
        <Route path="/shop-default" element={<ShopPage />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <AuthModal show={showLogin} onHide={() => setShowLogin(false)} />
      <CartModal show={showCart} onHide={() => setShowCart(false)} />
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