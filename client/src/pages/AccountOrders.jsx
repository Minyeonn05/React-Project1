// client/src/pages/AccountOrders.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import apiClient from '../api/apiClient';
import { Button } from 'react-bootstrap'; // ใช้ Button ของ React-Bootstrap

const AccountOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันสำหรับดึงข้อมูล Order
  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/users/getOrder?email=${encodeURIComponent(user)}`);
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
    setLoading(false);
  };

  // ดึงข้อมูล Order เมื่อ Component โหลด
  useEffect(() => {
    fetchOrders();
  }, [user]); // ดึงใหม่ถ้า user เปลี่ยน (ซึ่งไม่ควรเกิดในหน้านี้ แต่ใส่ไว้กันพลาด)

  // ฟังก์ชันสำหรับลบ Order
  const handleRemoveOrder = async (index) => {
    if (window.confirm('Are you sure you want to remove this order?')) {
      try {
        const response = await apiClient.post('/users/removeOrder', { email: user, index });
        alert(response.data.status || 'Order removed');
        fetchOrders(); // ดึงข้อมูล Order ใหม่หลังลบ
      } catch (error) {
        alert(error.response?.data?.status || 'Failed to remove order');
      }
    }
  };

  if (loading) {
    return <div className="my-account-content"><p>Loading orders...</p></div>;
  }

  return (
    <div className="my-account-content account-order">
      <div className="wrap-account-order">
        <table>
          <thead>
            <tr>
              <th className="fw-6">Order</th>
              <th>Item</th>
              <th>Size</th>
              <th>Amount</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody id="order-list">
            {orders.length === 0 ? (
              <tr className="tf-order-item">
                <td colSpan="5" className="text-center">No orders found.</td>
              </tr>
            ) : (
              orders.map((orderGroup, index) => (
                <tr className="tf-order-item" key={index}>
                  <td>{index + 1}</td>
                  {/* แสดงรายการสินค้า */}
                  <td>
                    <ul>
                      {orderGroup.map((item, i) => <li key={i}>{item.item}</li>)}
                    </ul>
                  </td>
                  {/* แสดง Size */}
                  <td>
                    <ul>
                      {orderGroup.map((item, i) => <li key={i}>{item.size}</li>)}
                    </ul>
                  </td>
                  {/* แสดงจำนวน */}
                  <td>
                    <ul>
                      {orderGroup.map((item, i) => <li key={i}>{item.amount}</li>)}
                    </ul>
                  </td>
                  {/* ปุ่มลบ */}
                  <td>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      className="tf-btn btn-sm btn-outline"
                      onClick={() => handleRemoveOrder(index)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountOrders;