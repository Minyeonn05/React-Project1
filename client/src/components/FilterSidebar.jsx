// src/components/ShopControls.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '../features/product/productSlice';

const ShopControls = () => {
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value)); // 👈 ส่งค่าไปอัปเดต state
  };

  return (
    <div className="tf-shop-control ...">
      {/* ...ปุ่ม Filter... */}
      <input 
        type="text" 
        id="searchInput" 
        placeholder="Find products by name"
        onChange={handleSearch} // 👈 เปลี่ยนจาก addEventListener
      />
    </div>
  );
};