import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, FloatingLabel, Alert } from 'react-bootstrap';
import { loginUser, registerUser } from './authSlice';

// 1. รับ props 'show' และ 'onHide' จาก App.jsx
const AuthModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.auth);

  // 2. State ภายในสำหรับสลับหน้าจอ
  const [view, setView] = useState('login'); // 'login' หรือ 'register'

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
  });

  // 3. เมื่อ Login สำเร็จ ให้ปิด Modal
  useEffect(() => {
    if (user && show) {
      onHide();
    }
  }, [user, show, onHide]);


  // 4. จัดการฟอร์ม
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // 5. Submit ฟอร์ม (Dispatch action)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(loginData));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(registerData))
      .unwrap()
      .then(() => {
        // ถ้า Register สำเร็จ ให้สลับไปหน้า Login
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        setView('login');
      })
      .catch((err) => {
        // (error จะถูกแสดงโดย useSelector)
        console.error('Failed to register:', err);
      });
  };

  // 6. สลับหน้าจอและรีเซ็ตฟอร์ม
  const switchView = (newView) => {
    setView(newView);
    setLoginData({ email: '', password: '' });
    setRegisterData({ fname: '', lname: '', email: '', password: '' });
  };
  
  // 7. สร้างฟังก์ชันปิด Modal (เพื่อรีเซ็ต State ด้วย)
  const handleClose = () => {
    onHide();
    setTimeout(() => {
      setView('login'); // กลับไปหน้า login เสมอเมื่อปิด
    }, 300); // หน่วงเวลาให้ CSS transition จบก่อน
  };

  return (
    // 8. ใช้ Modal ของ react-bootstrap
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      className="form-sign-in modal-part-content"
    >
      <Modal.Header closeButton>
        {/* 9. เปลี่ยน Title ตาม State */}
        <Modal.Title className="demo-title">
          {view === 'login' ? 'Log in' : 'Register'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="tf-login-form">

        {/* 10. แสดง Error จาก Redux */}
        {status === 'failed' && error && (
          <Alert variant="danger">{error.message || 'An error occurred'}</Alert>
        )}

        {view === 'login' ? (
          // ==================
          //    ฟอร์ม Login
          // ==================
          <Form onSubmit={handleLoginSubmit}>
            {/* 11. ใช้ FloatingLabel แทน tf-field */}
            <FloatingLabel controlId="loginEmail" label="Email *" className="mb-3">
              <Form.Control
                type="email"
                placeholder=" "
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                className="tf-input" // ใช้คลาสเดิมเพื่อให้ CSS จับได้
              />
            </FloatingLabel>

            <FloatingLabel controlId="loginPassword" label="Password *">
              <Form.Control
                type="password"
                placeholder=" "
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                className="tf-input"
              />
            </FloatingLabel>

            <div className="bottom mt-4">
              <div className="w-100">
                <Button 
                  type="submit" 
                  className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  disabled={status === 'loading'} // ปิดปุ่มตอนโหลด
                >
                  {status === 'loading' ? 'Loading...' : 'Log in'}
                </Button>
              </div>
              <div className="w-100 mt-2">
                <Button 
                  variant="link" 
                  className="fw-6 w-100 link"
                  onClick={() => switchView('register')} // 12. ปุ่มสลับหน้าจอ
                >
                  New customer? Create your account
                  <i className="icon icon-arrow1-top-left"></i>
                </Button>
              </div>
            </div>
          </Form>
        ) : (
          // ==================
          //   ฟอร์ม Register
          // ==================
          <Form onSubmit={handleRegisterSubmit}>
            <FloatingLabel controlId="registerFname" label="First name" className="mb-3">
              <Form.Control type="text" placeholder=" " name="fname" value={registerData.fname} onChange={handleRegisterChange} required className="tf-input" />
            </FloatingLabel>
            
            <FloatingLabel controlId="registerLname" label="Last name" className="mb-3">
              <Form.Control type="text" placeholder=" " name="lname" value={registerData.lname} onChange={handleRegisterChange} required className="tf-input" />
            </FloatingLabel>

            <FloatingLabel controlId="registerEmail" label="Email *" className="mb-3">
              <Form.Control type="email" placeholder=" " name="email" value={registerData.email} onChange={handleRegisterChange} required className="tf-input" />
            </FloatingLabel>

            <FloatingLabel controlId="registerPassword" label="Password *">
              <Form.Control type="password" placeholder=" " name="password" value={registerData.password} onChange={handleRegisterChange} required className="tf-input" />
            </FloatingLabel>

            <div className="bottom mt-4">
              <div className="w-100">
                <Button 
                  type="submit" 
                  className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Loading...' : 'Register'}
                </Button>
              </div>
              <div className="w-100 mt-2">
                <Button 
                  variant="link" 
                  className="fw-6 w-100 link"
                  onClick={() => switchView('login')} // 12. ปุ่มสลับหน้าจอ
                >
                  Already have an account? Log in here
                  <i className="icon icon-arrow1-top-left"></i>
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;