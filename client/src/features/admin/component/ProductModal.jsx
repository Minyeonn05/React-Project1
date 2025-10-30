import React, { useState, useEffect } from 'react';
import "../../../assets/css/AdminDashboard.css";

// ‼️ --- (นี่คือเวอร์ชันที่ใช้ FormData (File Upload) --- ‼️

export default function ProductModal({ isOpen, onClose, onSave, product, mode }) {
  
  const initialFormState = {
    name: '',
    price: '',
    category: '',
    description: '',
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  // 1. แยก State สำหรับไฟล์
  const [existingImages, setExistingImages] = useState([]); // รูปเก่า (ที่เป็น Path)
  const [newImages, setNewImages] = useState(null); // รูปใหม่ (ที่เป็น File Object)
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && product) {
        // เติมข้อมูล Text
        setFormData({
          name: product.name || '',
          price: product.price || '',
          category: product.type || '',     // ‼️ อ่านจาก 'type'
          description: product.detail || '', // ‼️ อ่านจาก 'detail'
        });
        // เติมข้อมูลรูปเก่า
        setExistingImages(product.img || []);
        setNewImages(null); // เคลียร์ไฟล์ใหม่ที่เลือกค้างไว้
      } else {
        // โหมด 'add'
        setFormData(initialFormState);
        setExistingImages([]);
        setNewImages(null);
      }
    }
  }, [isOpen, mode, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Function เมื่อเลือกไฟล์
  const handleFileChange = (e) => {
    setNewImages(e.target.files); // e.target.files คือ FileList
  };
  
  // 3. Function ลบรูปเก่า (ตอน Edit)
  const removeExistingImage = (imgToRemove) => {
    setExistingImages(prev => prev.filter(img => img !== imgToRemove));
  };

  // 4. ‼️ (สำคัญ) handleSubmit ที่ใช้ FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 5. สร้าง FormData
    const payload = new FormData();

    // 6. เพิ่มข้อมูล Text ทั้งหมดลงใน FormData
    payload.append('name', formData.name);
    payload.append('price', parseFloat(formData.price) || 0);
    payload.append('category', formData.category);
    payload.append('description', formData.description);

    // 7. (สำคัญ) เพิ่มไฟล์ใหม่ (ถ้ามี)
    // เราใช้ชื่อ field 'newImages' (ที่ต้องตรงกับ Multer ใน Server/Router)
    if (newImages && newImages.length > 0) {
      for (let i = 0; i < newImages.length; i++) {
        payload.append('newImages', newImages[i]);
      }
    }
    
    // 8. (สำคัญ) เพิ่ม Array รูปเก่าที่ยังเหลืออยู่ (ถ้าเป็นโหมด Edit)
    // เราส่งรูปเก่ากลับไปเป็น Text ธรรมดา
    if (mode === 'edit') {
      payload.append('id', product.id); // ‼️ ส่ง ID ตอน Edit
      existingImages.forEach(img => {
        // ‼️ (สำคัญ) เราต้องเปลี่ยนชื่อ field 'img[]' ไม่ให้ซ้ำกับ 'newImages'
        // แต่... ใน service (editProduct) เรารับเป็น req.body.img
        // ดังนั้น เราต้องส่งแบบนี้:
        payload.append('img', img);
      });
      // ถ้าไม่มีรูปเก่าเหลืออยู่เลย (ลบหมด) เราต้องส่งค่าว่างไป
      if (existingImages.length === 0) {
        payload.append('img', '');
      }
    }

    // 9. เลือก URL (เหมือนเดิม)
    let url = (mode === 'edit') 
      ? 'http://localhost:5000/api/products/edit' 
      : 'http://localhost:5000/api/products/add';

    try {
      // 10. ‼️ (สำคัญ) fetch ที่ใช้ FormData
      const response = await fetch(url, {
        method: 'POST',
        // ‼️ ไม่ต้องใส่ 'Content-Type'
        // Browser จะตั้งค่า 'multipart/form-data' ให้เอง
        body: payload, 
      });

      if (!response.ok) {
        // (เราอาจจะไม่ได้ JSON กลับมาถ้า Server พัง)
        const errorText = await response.text();
        console.error("Server Response (Error):", errorText);
        try {
            // ลอง parse ดู ถ้าได้ JSON ก็ใช้ message
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.status || 'Failed to save product');
        } catch (e) {
            // ถ้า parse ไม่ได้ (เช่น เป็น HTML error)
            throw new Error(errorText || 'Failed to save product');
        }
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
        </header>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            {/* (Form fields เหมือนเดิม) */}
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input id="name" name="name" type="text" className="form-input" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" step="0.01" className="form-input" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input id="category" name="category" type="text" className="form-input" value={formData.category} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" className="form-textarea" value={formData.description} onChange={handleChange} />
            </div>

            {/* ‼️ --- START: IMAGE UPLOAD SECTION --- ‼️ */}

            {/* 1. ช่องสำหรับ "เลือกไฟล์ใหม่" */}
            <div className="form-group">
              <label htmlFor="images">Upload New Images</label>
              <input
                id="images"
                name="newImages" // ‼️ (ชื่อนี้ต้องตรงกับ Multer)
                type="file"
                className="form-input"
                multiple // ‼️ ทำให้เลือกหลายไฟล์ได้
                onChange={handleFileChange}
              />
            </div>

            {/* 2. ช่องสำหรับ "พรีวิว/ลบ รูปเก่า" (จะโชว์เฉพาะโหมด Edit) */}
            {mode === 'edit' && existingImages.length > 0 && (
              <div className="form-group">
                <label>Existing Images</label>
                <div className="existing-images-grid">
                  {existingImages.map(imgSrc => (
                    <div key={imgSrc} className="existing-image-item">
                      <img 
                        src={`http://localhost:5000${imgSrc}`} 
                        alt="Existing product"
                        onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Error'} 
                      />
                      <button 
                        type="button" 
                        className="btn-remove-image"
                        onClick={() => removeExistingImage(imgSrc)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* ‼️ --- END: IMAGE UPLOAD SECTION --- ‼️ */}

          </div>
          
          <footer className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (mode === 'edit' ? 'Update Product' : 'Add Product')}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}