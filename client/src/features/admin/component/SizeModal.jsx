import { useState } from 'react';

export default function SizeModal({ isOpen, onClose, product, onSave }) {
  const [newSize, setNewSize] = useState('');
  const [onShop, setOnShop] = useState(false);

  const handleAddSize = async () => {
    if (!newSize) {
      alert('Please fill in the Size field.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/products/sizeAdd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, size: newSize, onShop }),
      });

      if (!response.ok) throw new Error('Failed to add size');
      
      alert('Size added successfully!');
      setNewSize('');
      setOnShop(false);
      onSave();
    } catch (error) {
      console.error(error);
      alert('Error adding size');
    }
  };

  const handleRemoveSize = async (sizeName) => {
    if (!confirm(`Remove size ${sizeName}?`)) return;

    try {
      const response = await fetch('http://localhost:5000/api/products/sizeRemove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, size: sizeName }),
      });

      if (!response.ok) throw new Error('Failed to remove size');
      
      alert('Size removed successfully!');
      onSave();
    } catch (error) {
      console.error(error);
      alert('Error removing size');
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Product Sizes</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="mb-6">
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Size</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., S, M, L"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
              />
            </div>
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="sizeOnShop"
                className="mr-2"
                checked={onShop}
                onChange={(e) => setOnShop(e.target.checked)}
              />
              <label htmlFor="sizeOnShop" className="text-sm font-medium">On Shop</label>
            </div>
          </div>

          <hr className="my-4" />

          <table className="w-full border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Size</th>
                <th className="p-2 text-left">On Shop</th>
                <th className="p-2 text-left">Remove</th>
              </tr>
            </thead>
            <tbody>
              {product.sizes?.map((size, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{product.id}</td>
                  <td className="p-2">{size.size}</td>
                  <td className="p-2">{size.onShop ? '✅' : '❌'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleRemoveSize(size.size)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Close
            </button>
            <button
              onClick={handleAddSize}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Size
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}