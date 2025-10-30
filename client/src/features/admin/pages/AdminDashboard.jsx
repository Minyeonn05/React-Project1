import { useState } from "react";
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';
import { useProducts } from "../hooks/useProducts";
import ProductModal from "../component/ProductModal";
import SizeModal from "../component/SizeModal";
import ProductTable from "../component/ProductTable";
import "../../../assets/css/AdminDashboard.css";
import { FiPackage, FiShoppingCart, FiLogOut } from "react-icons/fi";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { products, loading, refetch } = useProducts();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleRemoveProduct = async (productId) => {
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
      dispatch(logout());
      localStorage.clear();
      alert('You have been logged out.');
      window.location.replace('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">ecomus</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">A</span>
                </div>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-1">
            
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
            >
              <FiPackage className="text-xl" />
              <span>Products</span>
            </a>
            
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <FiShoppingCart className="text-xl" />
              <span>Orders</span>
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <FiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin</h1>

            <ProductTable
              products={products}
              onAdd={() => setShowAddModal(true)}
              onEdit={(product) => {
                setSelectedProduct(product);
                setShowEditModal(true);
              }}
              onRemove={handleRemoveProduct}
              onManageSizes={(product) => {
                setSelectedProduct(product);
                setShowSizeModal(true);
              }}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
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