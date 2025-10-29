import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import "../../assets/css/styles.css"; // (ถ้ามีสไตล์เฉพาะสำหรับ Navbar)
import { FaUser } from "react-icons/fa"; // ไอคอน user จาก Font Awesome
import { BsBag } from "react-icons/bs"; // ไอคอน bag จาก Bootstrap Icons

const Navbar = ({ onLoginClick, onCartClick }) => {
  // --- ดึง state ทั้ง cart และ user ---
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user); // Get logged-in user email
  const navigate = useNavigate();

  // --- คำนวณ totalItems เฉพาะเมื่อ user login อยู่ ---
  // ถ้า user เป็น null (logout) ให้ totalItems เป็น 0 ทันที
  const totalItems = user ? cartItems.reduce((sum, item) => sum + item.amount, 0) : 0;

  // Handler for the account icon/button (เหมือนเดิม)
  const handleAccountClick = () => {
    if (user === 'admin@mail.org') {
        navigate('/admin');
    } else if (user) {
      navigate('/my-account');
    } else {
      onLoginClick();
    }
  };

  return (
    <header id="header" className="header-default header-absolute">
      <div className="px_15 lg-px_40">
        <div className="row wrapper-header align-items-center">
          {/* Logo */}
          <div className="col-xl-3 col-md-4 col-6">
            <Link to="/" className="logo-header">
              <img src="/images/logo/logo.svg" alt="logo" className="logo" />
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="box-navigation text-center col-xl-6 tf-md-hidden">
            <ul className="box-nav-ul d-flex align-items-center justify-content-center gap-30">
              <li className="menu-item">
                <Link to="/" className="item-link">Home</Link>
              </li>
              <li className="menu-item">
                <Link to="/shop-default" className="item-link">Shop</Link>
              </li>
              <li className="menu-item position-relative">
                <Link to="/about-us" className="item-link">About us</Link>
              </li>
            </ul>
          </nav>

          {/* Icons */}
          <div className="col-xl-3 col-md-4 col-3">
            <ul className="nav-icon d-flex justify-content-end align-items-center gap-20">
              <li>
                {/* Account Button */}
                <button onClick={handleAccountClick} className="nav-icon-item" style={{background: 'none', border: 'none', color: 'inherit'}}>
                  <i className="icon icon-account"></i>
                </button>
              </li>
              <li className="nav-cart">
                {/* Cart Button */}
                <button onClick={onCartClick} className="nav-icon-item" style={{background: 'none', border: 'none', color: 'inherit'}}>
                  <i className="icon icon-bag"></i>
                  {/* totalItems จะเป็น 0 ทันทีเมื่อ user เป็น null */}
                  <span className="count-box">{totalItems}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;