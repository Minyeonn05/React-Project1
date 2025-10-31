import { useState, useMemo } from 'react';
import { 
  FiPlus, 
  FiSearch,
  FiEdit,
  FiTrash2,
  FiBox 
} from 'react-icons/fi';

export default function ProductTable({ products, onAdd, onEdit, onRemove, onManageSizes }) {
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchTerm) return products;
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    // Card ที่ครอบตารางทั้งหมด
    <div className="content-card">
      
      {/* ส่วนหัวของ Card (ปุ่ม + Search) */}
      <div className="content-card-header">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={onAdd} // เรียกใช้ onAdd prop เมื่อคลิก
          className="btn btn-primary"
        >
          <FiPlus />
          <span>Add Product</span>
        </button>
      </div>

      {/* ตารางสินค้า */}
      <div className="product-table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th className="cell-right">Price</th>
              <th>Category</th>
              <th className="cell-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {

                // Logic การหารูปภาพ (จาก ProductCard)
                const imageMain = product.img && product.img.length > 0 
                  ? `http://localhost:5000${product.img[0]}` 
                  : 'https://placehold.co/40x40'; 

                return (
                  <tr key={product.id}>
                    <td>
                      {/* ใช้ตัวแปร imageMain */}
                      <img 
                        src={imageMain} 
                        alt={product.name}
                        className="product-image" 
                      />
                    </td>
                    <td>{product.name}</td>
                    <td className="cell-right">${product.price}</td> {/* จัดชิดขวา */}
                    <td>{product.category}</td>
                    <td>
                      <div className="actions">
                      <button
                        className="btn-icon btn-icon-edit"
                        title="Edit"
                        onClick={() => onEdit(product)} // ส่ง (product) กลับไป
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="btn-icon btn-icon-size"
                        title="Manage Sizes"
                        onClick={() => onManageSizes(product)} // ส่ง (product) กลับไป
                      >
                        <FiBox />
                      </button>
                      <button
                        className="btn-icon btn-icon-delete"
                        title="Remove"
                        onClick={() => onRemove(product.id)} // ส่ง (product.id) กลับไป
                      >
                        <FiTrash2 />
                      </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              // Empty State
              <tr>
                <td colSpan="5" className="empty-state">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}