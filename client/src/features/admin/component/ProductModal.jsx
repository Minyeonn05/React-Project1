import React, { useState, useEffect } from 'react';
import "../../../assets/css/AdminDashboard.css";


// รับ props 4 ตัว
export default function ProductModal({ isOpen, onClose, onSave, product, mode }) {
  
  // 2. สร้าง State สำหรับเก็บข้อมูลในฟอร์มทั้งหมด
  const initialFormState = {
    name: '',
    price: '',
    category: '',
    description: '',
    images: '', // เราจะใช้ Textarea ให้ใส่ URL ทีละบรรทัด
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  // --- 3. 🌟 นี่คือส่วนที่สำคัญที่สุด (การเติมข้อมูล) ---
  useEffect(() => {
    // เมื่อ Modal เปิดขึ้นมา
    if (isOpen) {
      if (mode === 'edit' && product) {
        // ถ้าเป็นโหมด 'edit' และมี 'product' ส่งมา
        // ให้เติมข้อมูลจาก 'product' ลงในฟอร์ม
        setFormData({
          name: product.name || '',
          price: product.price || '',
          category: product.category || '',
          description: product.description || '',
          // แปลง Array (product.img) กลับเป็น String (ทีละบรรทัด)
          images: product.img ? product.img.join('\n') : '',
        });
      } else {
        // ถ้าเป็นโหมด 'add' ให้เคลียร์ฟอร์ม
        setFormData(initialFormState);
      }
    }
  }, [isOpen, mode, product]); // ทำงานใหม่ทุกครั้งที่ค่าเหล่านี้เปลี่ยน

  // 4. Function เมื่อมีการพิมพ์ในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 5. Function เมื่อกดปุ่ม Save (จัดการทั้ง Add และ Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 6. เตรียมข้อมูลที่จะส่ง (Payload)
    // แปลง String จาก Textarea กลับเป็น Array
    const imageArray = formData.images.split('\n').filter(Boolean); // filter(Boolean) ลบบรรทัดว่าง
    
    const payload = {
      ...formData,
      img: imageArray, // ใช้ 'img' key ให้ตรงกับ ProductCard
      price: parseFloat(formData.price) || 0,
    };
    delete payload.images; // ลบ key 'images' ที่เราใช้ชั่วคราวทิ้ง

    // 7. เลือก URL และ Method ตาม 'mode'
    let url = 'http://localhost:5000/api/products';
    let method = 'POST'; // Default คือ 'add'

    if (mode === 'edit') {
      // (ผมเดา API path จากโค้ด remove ของคุณนะครับ)
      url = 'http://localhost:5000/api/products/update'; 
      payload.id = product.id; // ‼️ ต้องส่ง id ของสินค้าที่จะแก้ไปด้วย
    } else {
      url = 'http://localhost:5000/api/products/add';
    }

    try {
      const response = await fetch(url, {
        method: method, // (ในโค้ดของคุณอาจจะเป็น 'POST' ทั้งคู่)
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }
      
      alert(`Product ${mode === 'edit' ? 'updated' : 'added'} successfully!`);
      onSave(); // เรียก refetch()
      onClose(); // ปิด Modal
      
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  // 8. ถ้า isOpen เป็น false ไม่ต้อง render อะไรเลย
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>

        </header>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                type="text"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="images">Image URLs (หนึ่ง URL ต่อหนึ่งบรรทัด)</label>
              <textarea
                id="images"
                name="images"
                className="form-textarea"
                placeholder="/uploads/image1.jpg&#10;/uploads/image2.jpg"
                value={formData.images}
                onChange={handleChange}
              />
            </div>

          </div>
          
          <footer className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary" // ใช้คลาสปุ่มหลัก
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (mode === 'edit' ? 'Update Product' : 'Add Product')}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}