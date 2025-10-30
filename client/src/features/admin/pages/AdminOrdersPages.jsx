import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';
import { FiPackage, FiUser, FiCalendar, FiDollarSign } from 'react-icons/fi';

import '../../../assets/css/AdminDashboard.css';

export default function AdminOrdersPages() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
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
              <ul className="space-y-2">
                <li>
                  <a href="/admin" className="block px-4 py-2 rounded hover:bg-gray-100">
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

          {/* Orders Content */}
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
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Products</th>
                        <th className="cell-right">Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-6)}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <FiUser />
                              {order.customerName || 'Guest'}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <FiCalendar />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            {order.items?.length || 0} item(s)
                          </td>
                          <td className="cell-right">
                            <div className="flex items-center justify-end gap-1">
                              <FiDollarSign />
                              {order.totalAmount?.toFixed(2) || '0.00'}
                            </div>
                          </td>
                          <td>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status || 'pending'}
                            </span>
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