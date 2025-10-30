// client/src/App.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { fetchCart } from './features/cart/cartSlice';
//  เอา import logout ออก เพราะจะจัดการใน AccountSidebar 
// import { logout } from './features/auth/authSlice';

// Import Components
import Navbar from './components/common/Navbar';
import AuthModal from './features/auth/AuthModal.jsx';
import CartModal from './features/cart/CartModal.jsx';

// Import Pages
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage';  
import ProductDetailPage from './pages/ProductDetailPage';
import MyAccountPage from './pages/MyAccountPage'; 
import AboutPage from './pages/About.jsx';
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import AdminOrdersPages from './features/admin/pages/AdminOrdersPages.jsx';

// Component ย่อยสำหรับจัดการ Layout และ Logic
function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // ดึงข้อมูลตะกร้าเมื่อ User เปลี่ยน (login/logout) หรือเมื่อตะกร้าว่างเปล่า
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
    // ถ้าไม่มี user ไม่ต้องทำอะไร fetchCart จะคืนค่า array ว่างเปล่าเอง
  }, [user, dispatch]);

  // ⭐️ เอา handleLogout ออก เพราะย้ายไป AccountSidebar ⭐️
  // const handleLogout = () => { ... };

  return (
    <>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onCartClick={() => setShowCart(true)}
      />

      <Routes>
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/shop-default" element={<ShopPage />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />

        {/* Routes สำหรับ My Account */}
        <Route path="/my-account/*" element={<MyAccountPage />} />
        <Route path="/AboutPage" element={<AboutPage />} />

        {/* (เพิ่ม Route อื่นๆ ที่นี่ เช่น /admin ถ้ามี) */}
        <Route path="/AdminDashboard" element={<AdminDashboard />} /> 
        <Route path="/admin/orders" element={<AdminOrdersPages />} />
        
      </Routes>

      {/* (Footer ถูกลบไปแล้ว) */}

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

// Component App หลัก (เหมือนเดิม)
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;