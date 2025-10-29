import { useState, useEffect } from 'react';

export default function ProductModal({ isOpen, onClose, product, onSave, mode = 'add' }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    detail: '',
    type: '',
    size: '',
    onShop: false,
  });
  const [imageFiles, setImageFiles] = useState([null, null, null, null, null]);

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        detail: product.detail,
        type: product.type,
        size: '',
        onShop: false,
      });
    } else {
      setFormData({
        id: '',
        name: '',
        price: '',
        detail: '',
        type: '',
        size: '',
        onShop: false,
      });
      setImageFiles([null, null, null, null, null]);
    }
  }, [product, mode, isOpen]);

  const handleSubmit = async () => {
    if (!formData.id) {
      alert('Please fill in the ID field.');
      return;
    }

    if (mode === 'add' && !formData.size) {
      alert('Please fill in the size field.');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    imageFiles.forEach(file => {
      if (file) formDataToSend.append('img', file);
    });

    try {
      const url = mode === 'add' 
        ? 'http://localhost:5000/api/products/add'
        : 'http://localhost:5000/api/products/edit';
      
      const response = await fetch(url, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error(`Failed to ${mode} product`);
      
      alert(`Product ${mode === 'add' ? 'added' : 'edited'} successfully!`);
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      alert(`Error ${mode === 'add' ? 'adding' : 'editing'} product`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {mode === 'add' ? 'Add Product' : 'Edit Product'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product ID</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                readOnly={mode === 'edit'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Images (up to 5)</label>
              {[0, 1, 2, 3, 4].map(index => (
                <input
                  key={index}
                  type="file"
                  className="w-full border rounded px-3 py-1 mb-2"
                  onChange={(e) => {
                    const newFiles = [...imageFiles];
                    newFiles[index] = e.target.files[0];
                    setImageFiles(newFiles);
                  }}
                />
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Details</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows="3"
                value={formData.detail}
                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </div>

            {mode === 'add' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., S, M, L"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="onShop"
                    className="mr-2"
                    checked={formData.onShop}
                    onChange={(e) => setFormData({ ...formData, onShop: e.target.checked })}
                  />
                  <label htmlFor="onShop" className="text-sm font-medium">On Shop</label>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {mode === 'add' ? 'Add' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}