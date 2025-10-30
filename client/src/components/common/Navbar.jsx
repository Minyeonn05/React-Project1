import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import "../../assets/css/styles.css"; // (ถ้ามีสไตล์เฉพาะสำหรับ Navbar)
import { FaUser } from "react-icons/fa"; // ไอคอน user จาก Font Awesome
import { BsBag } from "react-icons/bs"; // ไอคอน bag จาก Bootstrap Icons

const NAV_HEIGHT = 110;

const Navbar = ({ onLoginClick, onCartClick }) => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const update = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollY.current;

      if (currentY < 0) {
        setVisible(true);
      } else if (Math.abs(currentY - lastY) < 5) {
        // ignore small deltas
      } else if (currentY > lastY && currentY > NAV_HEIGHT) {
        // scrolling down
        setVisible(false);
      } else if (currentY < lastY) {
        // scrolling up
        setVisible(true);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // นับจำนวนของในตะกร้า (จาก logic เดิม)
  const totalItems = cartItems.reduce((sum, item) => sum + item.amount, 0);

  // แทนที่ checkloged()
  const handleAccountClick = () => {
    // 1. เช็คก่อนว่าเป็น admin หรือไม่
    if (user === 'admin@mail.org') { 
      navigate('/AdminDashboard');
    } 
    // 2. ถ้าไม่ใช่ admin แต่มีค่า user (เช่น 'user')
    else if (user) { 
      navigate('/my-account');
    } 
    // 3. ถ้าไม่มีค่า user เลย (เป็น null)
    else { 
      onLoginClick(); // ค่อยเปิด Modal
    }
  };
  
    //   if (user === 'admin@mail.org') {
  //     navigate('/AdminDashboard'); // (คุณต้องสร้างหน้านี้ใน Routes)
  //   } else if (user) {
  //     navigate('/my-account'); // (คุณต้องสร้างหน้านี้ใน Routes)
  //   } else {
  //     onLoginClick(); // เปิด Modal
  //   }
  // };

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: NAV_HEIGHT,
    backgroundColor: '#ffffff',
    zIndex: 1000,
    transform: visible ? 'translateY(0)' : 'translateY(-110%)',
    transition: 'transform 260ms cubic-bezier(.2,.9,.3,1), box-shadow 200ms',
    boxShadow: visible ? '0 6px 18px rgba(20, 20, 30, 0.06)' : 'none',
  };

  return (
    <>
      <header id="header" className="header-default header-absolute" style={headerStyle}>
        <div className="px_15 lg-px_40">
          <div className="row wrapper-header align-items-center">
          {/* ... ส่วน Logo และ Mobile Menu ... */}
          <div className="col-xl-3 col-md-4 col-6">
            <Link to="HomePage" className="logo-header">
              <img src="/images/logo/logo.svg" alt="logo" className="logo" />
              {/* 👆 แนะนำให้ย้าย logo.svg ไปไว้ใน /public/images/logo/ */}
            </Link>
          </div>

          {/* ... ส่วน Nav Links ... */}
          <nav className="box-navigation text-center col-xl-6 tf-md-hidden">
            <ul className="box-nav-ul d-flex align-items-center justify-content-center gap-30">
              <li className="menu-item">
                <Link to="/HomePage" className="item-link">Home</Link>
              </li>
              <li className="menu-item">
                <Link to="/shop-default" className="item-link">Shop</Link>
              </li>
              <li className="menu-item position-relative">
                <Link to="/AboutPage" className="item-link">About us</Link>
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

      {/* spacer to prevent content jumping under fixed header */}
      <div style={{ height: NAV_HEIGHT }} />
    </>
  );
};

export default Navbar;
