
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserDetails } from '../../features/auth/authSlice'; 

const AccountDashboard = () => {
  const dispatch = useDispatch();
  const { user, userDetails, status } = useSelector((state) => state.auth);

  // ดึงข้อมูลชื่อ User 
  useEffect(() => {
    if (user && !userDetails && status !== 'loading') {
      dispatch(fetchUserDetails(user)); // ส่ง email ไปให้ Thunk
    }
  }, [user, userDetails, status, dispatch]);

  const greeting = userDetails
    ? `สวัสดี ${userDetails.fname} ${userDetails.lname}`
    : (user ? 'กำลังโหลดข้อมูล...' : 'สวัสดี!'); 
  return (
    <div className="my-account-content account-dashboard" id="my-account-dashboard">
      <div className="mb_60">
        <h5 className="fw-5 mb_20" id="greeting-message">{greeting}</h5>
        <p>
          จากหน้า Dashboard บัญชีของคุณ คุณสามารถดู{' '}
          <Link className="text_primary" to="/my-account/orders">
            รายการสั่งซื้อล่าสุด
          </Link>
          , จัดการ{' '}
          <Link className="text_primary" to="/my-account/addresses">
            ที่อยู่ของคุณ
          </Link>
          , และ{' '}
          <Link className="text_primary" to="/my-account/details">
            แก้ไขรหัสผ่านและรายละเอียดบัญชี
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default AccountDashboard;