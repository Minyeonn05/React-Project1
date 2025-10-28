// client/src/pages/AccountDetails.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetails, changePassword, clearAuthError } from '../features/auth/authSlice';
import { Button, Form, Alert } from 'react-bootstrap'; 
const AccountDetails = () => {
  const dispatch = useDispatch();
  const { user, userDetails, status, error } = useSelector((state) => state.auth);

  // State สำหรับฟอร์มเปลี่ยนรหัสผ่าน
  const [passwordData, setPasswordData] = useState({
    currentPass: '',
    newPass: '',
    samePass: '',
  });
  const [message, setMessage] = useState(''); // State สำหรับข้อความ Success/Error

  // ดึงข้อมูล User (fname, lname) เมื่อ Component โหลด
  useEffect(() => {
    if (user && !userDetails) {
      dispatch(fetchUserDetails(user));
    }
    // เคลียร์ error เก่าๆ เมื่อเข้าหน้านี้
    dispatch(clearAuthError());
  }, [user, userDetails, dispatch]);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    setMessage(''); // เคลียร์ข้อความเก่า
    
    // Logic ตรวจสอบเบื้องต้น
    if (passwordData.newPass !== passwordData.samePass) {
      setMessage('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    if (!passwordData.currentPass || !passwordData.newPass) {
      setMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    dispatch(changePassword({ 
      email: user, 
      ...passwordData 
    }))
    .unwrap()
    .then((response) => {
      setMessage(response.status || 'เปลี่ยนรหัสผ่านสำเร็จ!');
      setPasswordData({ currentPass: '', newPass: '', samePass: '' }); // เคลียร์ฟอร์ม
    })
    .catch((err) => {
      // Error message จะมาจาก rejectWithValue ใน slice
      setMessage(err.status || err.message || 'เกิดข้อผิดพลาด');
    });
  };

  return (
    <div className="my-account-content account-edit">
      <Form onSubmit={handleSubmitPassword} id="form-password-change">
        {/* ส่วน Account Details (Read Only) */}
        <div className="tf-field style-1 mb_15">
          <input 
            className="tf-field-input tf-input" 
            placeholder=" " 
            type="text"
            id="property1" 
            name="first name" 
            value={userDetails?.fname || ''} 
            readOnly 
          />
          <label className="tf-field-label fw-4 text_black-2" htmlFor="property1">First name</label>
        </div>
        <div className="tf-field style-1 mb_15">
          <input 
            className="tf-field-input tf-input" 
            placeholder=" " 
            type="text"
            id="property2" 
            name="last name" 
            value={userDetails?.lname || ''} 
            readOnly 
          />
          <label className="tf-field-label fw-4 text_black-2" htmlFor="property2">Last name</label>
        </div>
        <div className="tf-field style-1 mb_15">
          <input 
            className="tf-field-input tf-input" 
            placeholder=" " 
            type="email"
            id="property3" 
            name="email" 
            value={user || ''} 
            readOnly 
          />
          <label className="tf-field-label fw-4 text_black-2" htmlFor="property3">Email</label>
        </div>
        
        <hr className="my-4"/>

        {/* ส่วน Password Change */}
        <h6 className="mb_20">เปลี่ยนรหัสผ่าน</h6>
        
        {/* แสดงข้อความ Error/Success */}
        {message && (
          <Alert variant={status === 'failed' ? 'danger' : 'success'}>
            {message}
          </Alert>
        )}

        <div className="tf-field style-1 mb_30">
          <input 
            className="tf-field-input tf-input" 
            placeholder=" " 
            type="password"
            id="property4" 
            name="currentPass" 
            value={passwordData.currentPass}
            onChange={handlePasswordChange}
            required
          />
          <label className="tf-field-label fw-4 text_black-2" htmlFor="property4">Current password</label>
        </div>
        <div className="tf-field style-1 mb_30">
          <input 
            className="tf-field-input tf-input" 
            placeholder=" " 
            type="password"
            id="property5" 
            name="newPass" 
            value={passwordData.newPass}
            onChange={handlePasswordChange}
            required
          />
          <label className="tf-field-label fw-4 text_black-2" htmlFor="property5">New password</label>
        </div>
        <div className="tf-field style-1 mb_30">
          <input 
            className="tf-field-input tf-input" 
            placeholder=" " 
            type="password"
            id="property6" 
            name="samePass" 
            value={passwordData.samePass}
            onChange={handlePasswordChange}
            required
          />
          <label className="tf-field-label fw-4 text_black-2" htmlFor="property6">Confirm password</label>
        </div>
        <div className="mb_20">
          <Button
            type="submit"
            className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'กำลังบันทึก...' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AccountDetails;