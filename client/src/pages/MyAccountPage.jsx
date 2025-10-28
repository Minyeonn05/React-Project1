// client/src/pages/MyAccountPage.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';

// ⭐️ 1. แก้ไข Import Path ให้ถูกต้อง (ใช้ Relative Paths) ⭐️
import AccountSidebar from '../components/common/AccountSidebar';
import AccountDashboard from 'C:/react-app/React-Project1/client/src/features/auth/AccountDashboard.jsx'; // (ไฟล์นี้คุณยังไม่ได้ส่งมา แต่ผมสมมติว่ามีอยู่)
import AccountDetails from 'C:/react-app/React-Project1/client/src/pages/AccountDetails.jsx';     // 👈 Import ไฟล์จริง
import AccountOrders from './AccountOrders';       
import AccountAddresses from './AccountAddresses';   

// ⭐️ 2. ลบ Placeholder components เหล่านี้ออก ⭐️
// const AccountDetails = () => <div>Account Details Page (Coming Soon)</div>;
// const AccountOrders = () => <div>Orders Page (Coming Soon)</div>;
// const AccountAddresses = () => <div>Addresses Page (Coming Soon)</div>;

const MyAccountPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ตรวจสอบ Login: ถ้าไม่มี user ให้ Redirect ไปหน้าหลัก
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true }); // replace: true เพื่อไม่ให้กด back กลับมาได้
    }
  }, [user, navigate]);

  
  if (!user) {
    return <p>กำลัง Redirect...</p>; // หรือ null
  }

  // ถ้า Login แล้ว ให้แสดง Layout หน้า My Account
  return (
    <>
      {/* ส่วน Page Title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">My Account</div>
        </div>
      </div>

      {/* ส่วนเนื้อหาหลัก */}
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3">
              <AccountSidebar />
            </div>
            {/* Content Area */}
            <div className="col-lg-9">
              {/* ⭐️ 3. Routes นี้จะเรียกใช้ Component จริงที่ Import เข้ามา ⭐️ */}
              <Routes>
                  {/* Path หลัก (/my-account) แสดง Dashboard */}
                  <Route index element={<AccountDashboard />} />
                  {/* Path ย่อยอื่นๆ */}
                  <Route path="details" element={<AccountDetails />} />
                  <Route path="orders" element={<AccountOrders />} />
                  <Route path="addresses" element={<AccountAddresses />} />
                  {/* Fallback กลับไปหน้า Dashboard ถ้าเข้า path ผิด */}
                  <Route path="*" element={<Navigate to="/my-account" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccountPage;

