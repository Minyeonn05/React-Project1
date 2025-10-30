// client/src/components/common/AccountSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice'; // Import action logout
import { clearCart } from '../../features/cart/cartSlice';

const AccountSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
        dispatch(logout());      // 👈 Dispatch logout (เหมือนเดิม)
+       dispatch(clearCart());     // ⭐️ 2. Dispatch clearCart เพิ่ม ⭐️
        alert('ออกจากระบบแล้ว');
        navigate('/');
    }
  };
  return (
    // ใช้ class เดิมจาก HTML
    <ul className="my-account-nav">
      {/* ใช้ NavLink เพื่อให้รู้ว่าอยู่หน้าไหน (active) */}
      {/* to="/my-account" หรือ "/" สำหรับ Dashboard */}
      <li><NavLink to="/my-account" end className="my-account-nav-item">Dashboard</NavLink></li>
      <li><NavLink to="/my-account/details" className="my-account-nav-item">Account Details</NavLink></li>
      <li><NavLink to="/my-account/orders" className="my-account-nav-item">Orders</NavLink></li>
      <li><NavLink to="/my-account/addresses" className="my-account-nav-item">Addresses</NavLink></li>
      {/* ปุ่ม Logout */}
      <li>
        <a href="#" onClick={handleLogout} className="my-account-nav-item">Logout</a>
      </li>
    </ul>
  );
};

export default AccountSidebar;