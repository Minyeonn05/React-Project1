import { useState } from 'react'; 
// --- START: PATH FIXES ---
import { useProducts } from "../hooks/useProducts";
import ProductModal from "../component/ProductModal";
import SizeModal from "../component/SizeModal";
import ProductTable from "../component/ProductTable";
// 2. Import CSS (Corrected relative path)
import "../../../assets/css/AdminDashboard.css";

// --- END: PATH FIXES ---

import { 
  FiPackage, 
  FiShoppingCart, 
  FiLogOut
} from 'react-icons/fi';

export default function AdminDashboard() {
  const { products, loading, refetch } = useProducts();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // searchTerm และ filteredProducts ถูกย้ายไปอยู่ใน ProductTable.jsx แล้ว!

  const handleRemoveProduct = async (productId) => {
    // ... (โค้ดเดิม)
    if (!confirm(`Remove product ${productId}?`)) return;
    try {
      const response = await fetch('http://localhost:5000/api/products/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      });
      if (!response.ok) throw new Error('Failed to remove product');
      alert('Product removed successfully!');
      refetch();
    } catch (error) {
      console.error(error);
      alert('Error removing product');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('persist:root'); // If using Redux persist
      localStorage.removeItem('token');
      // --- END: ADDED LOGOUT LOGIC ---

      alert('You have been logged out.');
      window.location.href = '/';
    }
  };

  // 4. สร้าง Helper function เพื่อส่งให้ ProductTable
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleSizeClick = (product) => {
    setSelectedProduct(product);
    setShowSizeModal(true);
  };


  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="container">
          <h1>Admin</h1>
        </div>
      </header>

      <main className="admin-main">
        <div className="container main-grid">
          <aside className="sidebar">
            <nav className="sidebar-nav">
              <ul>
                <li>
                  <a href="#" className="active">
                    <FiPackage/> 
                    <span>Products</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/orders">
                    <FiShoppingCart />
                    <span>Orders</span>
                  </a>
                </li>
                <li>
                 <button onClick={handleLogout}>
                  <FiLogOut />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* 5. ส่วน Main Content คลีนขึ้นมาก! */}
         <div className="main-content">
            <ProductTable
              products={products}
              onAdd={() => setShowAddModal(true)}
              onEdit={handleEditClick}
              onRemove={handleRemoveProduct}
              onManageSizes={handleSizeClick}
            />
          </div>

        </div>
      </main>

      {/* Modals (เหมือนเดิมทุกประการ) */}
      <ProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
       onSave={refetch}
        mode="add"
      />
      <ProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSave={refetch}
        mode="edit"
      />
      <SizeModal
        isOpen={showSizeModal}
        onClose={() => {
          setShowSizeModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSave={refetch}
      />
    </div>
  );
}

