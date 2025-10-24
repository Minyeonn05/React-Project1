import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchCart } from './features/cart/cartSlice';
import { logout } from './features/auth/authSlice';

// Import Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AuthModal from './features/auth/AuthModal.jsx';
import CartModal from './features/cart/CartModal';

// Import Pages
import ShopPage from './pages/ShopPage';
// import HomePage from './pages/HomePage'; (ควรสร้าง)
import AboutPage from './pages/About';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // State สำหรับควบคุม Modal
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // สั่งดึงข้อมูลตะกร้าเมื่อ User เปลี่ยน (login/logout)
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    // (ปิด Modal ทั้งหมดถ้าจำเป็น)
  };

  return (
    <BrowserRouter>
      {/* Navbar จะรับ props เพื่อเปิด/ปิด Modal
        แทนที่การใช้ data-bs-toggle
      */}
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
      </Routes>

    

      {/* Modal ทั้งหมดจะถูกควบคุมด้วย State
      */}
      <AuthModal 
        show={showLogin} 
        onHide={() => setShowLogin(false)} 
      />
      <CartModal 
        show={showCart} 
        onHide={() => setShowCart(false)} 
      />
    </BrowserRouter>
  );
}

export default App;