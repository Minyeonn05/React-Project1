import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import "../../assets/css/styles.css"; // (ถ้ามีสไตล์เฉพาะสำหรับ Navbar)
import { FaUser } from "react-icons/fa"; // ไอคอน user จาก Font Awesome
import { BsBag } from "react-icons/bs"; // ไอคอน bag จาก Bootstrap Icons

const Navbar = ({ onLoginClick, onCartClick }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // นับจำนวนของในตะกร้า (จาก logic เดิม)
  const totalItems = cartItems.reduce((sum, item) => sum + item.amount, 0);

  // แทนที่ checkloged()
  const handleAccountClick = () => {
    if (user === 'admin@mail.org') {
      navigate('/admin'); // (คุณต้องสร้างหน้านี้ใน Routes)
    } else if (user) {
      navigate('/my-account'); // (คุณต้องสร้างหน้านี้ใน Routes)
    } else {
      onLoginClick(); // เปิด Modal
    }
  };

  return (
    <header id="header" className="header-default header-absolute">
      <div className="px_15 lg-px_40">
        <div className="row wrapper-header align-items-center">
          {/* ... ส่วน Logo และ Mobile Menu ... */}
          <div className="col-xl-3 col-md-4 col-6">
            <Link to="/" className="logo-header">
              <img src="/images/logo/logo.svg" alt="logo" className="logo" />
              {/* 👆 แนะนำให้ย้าย logo.svg ไปไว้ใน /public/images/logo/ */}
            </Link>
          </div>

          {/* ... ส่วน Nav Links ... */}
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

          {/* ... ส่วน Icons ... */}
          <div className="col-xl-3 col-md-4 col-3">
            <ul className="nav-icon d-flex justify-content-end align-items-center gap-20">
              <li>
                {/* 1. ใช้ onClick แทน data-bs-toggle */}
                <button onClick={handleAccountClick} className="nav-icon-item" style={{background: 'none', border: 'none'}}>
                  <i className="icon icon-account"></i>
                </button>
              </li>
              <li className="nav-cart">
                {/* 2. ใช้ onClick แทน data-bs-toggle */}
                <button onClick={onCartClick} className="nav-icon-item" style={{background: 'none', border: 'none'}}>
                  <i className="icon icon-bag"></i>
                  {/* 3. แสดงจำนวนจาก Redux state */}
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