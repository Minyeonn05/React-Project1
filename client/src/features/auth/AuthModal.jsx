// client/src/features/auth/AuthModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, FloatingLabel, Alert } from 'react-bootstrap';
// ⭐️ 1. Import registerUser และ clearAuthError ⭐️
import { loginUser, registerUser, clearAuthError } from './authSlice';

const AuthModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.auth);

  // ⭐️ 2. State ภายในสำหรับสลับหน้าจอ ⭐️
  const [view, setView] = useState('login'); // 'login' หรือ 'register'

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
  });
  // State สำหรับข้อความ (ถ้า register สำเร็จ)
  const [message, setMessage] = useState('');

  // 3. เมื่อ Login สำเร็จ ให้ปิด Modal
  useEffect(() => {
    if (user && show) {
      onHide();
    }
  }, [user, show, onHide]);

  // 4. เคลียร์ Error/Message เมื่อเปิด/ปิด Modal หรือสลับหน้า
  useEffect(() => {
    if (show) {
      dispatch(clearAuthError()); // เคลียร์ error เก่าจาก Redux
      setMessage(''); // เคลียร์ message สำเร็จ
    }
  }, [show, view, dispatch]);


  // 5. จัดการฟอร์ม
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // 6. Submit ฟอร์ม Login (Dispatch action)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    dispatch(loginUser(loginData));
    // (useEffect ด้านบนจะจัดการปิด Modal เมื่อ user state เปลี่ยน)
  };

  // 7. Submit ฟอร์ม Register (Dispatch action)
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    dispatch(registerUser(registerData))
      .unwrap()
      .then((response) => {
        // ถ้า Register สำเร็จ
        setMessage(response.status || 'สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        setView('login'); // สลับกลับไปหน้า Login
        setRegisterData({ fname: '', lname: '', email: '', password: '' }); // เคลียร์ฟอร์ม
      })
      .catch((err) => {
        // ถ้าไม่สำเร็จ error จะถูกแสดงโดย useSelector(state => state.auth.error)
        // (err คือค่าที่ rejectWithValue ส่งมา)
        console.error('Failed to register:', err);
      });
  };

  // 8. สลับหน้าจอและรีเซ็ตฟอร์ม
  const switchView = (newView) => {
    setView(newView);
    setLoginData({ email: '', password: '' });
    setRegisterData({ fname: '', lname: '', email: '', password: '' });
  };
  
  const handleClose = () => {
    onHide();
    setTimeout(() => {
      setView('login'); // กลับไปหน้า login เสมอเมื่อปิด
      setMessage('');
    }, 300);
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      className="form-sign-in modal-part-content"
    >
      <Modal.Header closeButton>
        <Modal.Title className="demo-title">
          {view === 'login' ? 'Log in' : 'Register'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="tf-login-form">

        {/* ⭐️ แสดง Error จาก Redux (ถ้ามี) ⭐️ */}
        {status === 'failed' && error && (
          <Alert variant="danger">{error}</Alert>
        )}
        {/* ⭐️ แสดง Message สำเร็จ (ถ้ามี) ⭐️ */}
        {message && status !== 'failed' && (
           <Alert variant="success">{message}</Alert>
        )}

        {view === 'login' ? (
          // ==================
          //    ฟอร์ม Login
          // ==================
          <Form onSubmit={handleLoginSubmit}>
            <FloatingLabel controlId="loginEmail" label="Email *" className="mb-3">
              <Form.Control
                type="email"
                placeholder=" "
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                className="tf-input"
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
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Loading...' : 'Log in'}
                </Button>
              </div>
              <div className="w-100 mt-2">
                <Button 
                  variant="link" 
                  className="fw-6 w-100 link"
                  onClick={() => switchView('register')} // 👈 ปุ่มสลับไป Register
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
                  onClick={() => switchView('login')} // 👈 ปุ่มสลับกลับไป Login
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
