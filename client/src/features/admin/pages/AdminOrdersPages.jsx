// client/src/features/admin/pages/AdminOrdersPages.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// ‼️ (สันนิษฐานว่า logout อยู่ที่นี่ ถ้าไม่ ให้แก้ Path)
import { logout } from '../../auth/authSlice'; 
import { FiPackage, FiShoppingCart, FiLogOut, FiTrash2 } from 'react-icons/fi'; // (เพิ่ม FiTrash2)

import '../../../assets/css/AdminDashboard.css';
// (คุณอาจจะต้อง import apiClient ถ้าคุณใช้แทน fetch)
// import apiClient from '../../../api/apiClient';

export default function AdminOrdersPages() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // ‼️ --- 1. (แก้ไข URL) --- ‼️
      // (ถ้าคุณใช้ apiClient: const response = await apiClient.get('/users/getAllOrders');)
      const response = await fetch('http://localhost:5000/api/users/getAllOrders');
      
      if (!response.ok) {
         // (จัดการ Error กรณี API ล่ม)
         const errorText = await response.text();
         throw new Error(errorText || 'Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // ‼️ --- 2. (เพิ่มฟังก์ชันลบ) --- ‼️
  const handleRemoveOrder = async (email, index) => {
    if (window.confirm(`Remove order (Index: ${index}) for user ${email}?`)) {
      try {
        // (ถ้าคุณใช้ apiClient: await apiClient.post('/users/removeAdminOrder', { email, orderIndex: index });)
        const response = await fetch('http://localhost:5000/api/users/removeAdminOrder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, orderIndex: index })
        });
        
        if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.status || 'Failed to remove');
        }
        
        alert('Order removed successfully');
        fetchOrders(); // ดึงข้อมูลใหม่
      } catch (error) {
        console.error('Error removing order:', error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      localStorage.clear();
      window.location.replace('/');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="sidebar-nav">
                <li>
                  {/* (แก้ไข Link ให้ถูก) */}
                  <a href="/AdminDashboard" className="block px-4 py-2 rounded hover:bg-gray-100">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/admin/orders" className="block px-4 py-2 rounded bg-blue-50 text-blue-600">
                    Orders
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* ‼️ --- 3. (แก้ไขตารางทั้งหมด) --- ‼️ */}
          <div className="lg:col-span-3">
            <div className="content-card">
              <div className="content-card-header">
                <h2 className="text-xl font-semibold">All Orders</h2>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FiPackage className="mx-auto text-6xl mb-4" />
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* (ใช้ Class จาก AdminDashboard.jsx เพื่อให้หน้าตาเหมือนกัน) */}
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Items</th>
                        <th>Size</th>
                        <th>Amount</th>
                        <th className="actions cell-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* (เปลี่ยน Logic การ map ข้อมูล) */}
                      {orders.map((order, index) => (
                        <tr key={`${order.userEmail}-${order.orderIndex}`}>
                          <td>{order.name || 'N/A'}</td>
                          <td>{order.userEmail}</td>
                          <td>
                            {/* (แสดงที่อยู่แรก ถ้ามี) */}
                            {order.address && order.address.length > 0 
                                ? order.address[0].address 
                                : 'No address'
                            }
                          </td>
                          <td>
                            <ul>
                              {order.items.map((item, i) => <li key={i}>{item.item}</li>)}
                            </ul>
                          </td>
                          <td>
                             <ul>
                              {order.items.map((item, i) => <li key={i}>{item.size}</li>)}
                            </ul>
                          </td>
                           <td>
                             <ul>
                              {order.items.map((item, i) => <li key={i}>{item.amount}</li>)}
                            </ul>
                          </td>
                          <td className="actions cell-right">
                            <button
                                className="btn-icon btn-icon-delete"
                                title="Remove Order"
                                onClick={() => handleRemoveOrder(order.userEmail, order.orderIndex)}
                            >
                                <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}