import { useState } from 'react';
import { useProducts } from 'C:/react-app/React-Project1/client/src/features/admin/pages/hooks/useProducts.js';
import ProductModal from 'C:/react-app/React-Project1/client/src/features/admin/pages/component/ProductModal.jsx';
import SizeModal from 'C:/react-app/React-Project1/client/src/features/admin/pages/component/ProductTable.jsx';
import ProductTable from 'C:/react-app/React-Project1/client/src/features/admin/pages/component/ProductTable.jsx';

export default function AdminDashboard() {
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
      alert('You have been logged out.');
      window.location.href = '/';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-100">
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

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Product
                </button>

                <ProductTable
                  products={products}
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
            </div>
          </div>
        </div>
      </main>

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