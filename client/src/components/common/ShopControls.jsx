import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// 1. Import action จาก slice ของ Product
import { setSearchTerm } from 'C:/react-app/React-Project/client/src/features/product/productSlice.js'; 

// 2. รับฟังก์ชัน onFilterClick มาจาก ShopPage
const ShopControls = ({ onFilterClick }) => {
  const dispatch = useDispatch();
  
  // 3. ดึงค่า searchTerm ปัจจุบันมาจาก Redux store
  const searchTerm = useSelector((state) => state.products.searchTerm);

  // 4. ฟังก์ชันที่จะทำงานเมื่อมีการพิมพ์ในช่อง search
  const handleSearchChange = (e) => {
    // 5. ส่งค่าใหม่ไปอัปเดต state ใน Redux
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <div className="tf-shop-control grid-3 align-items-center">
      <div className="tf-control-filter">
        {/* 6. เปลี่ยนจาก <a> เป็น <button>
          และใช้ onClick เพื่อเรียกฟังก์ชันที่ส่งมาจาก parent
        */}
        <button 
          onClick={onFilterClick} 
          className="tf-btn-filter"
          style={{ background: 'none', border: 'none' }} // เพิ่ม style กันปุ่มเพี้ยน
        >
          <span className="icon icon-filter"></span>
          <span className="text">Filter</span>
        </button>
      </div>
      <div className="text-center mb-8 ">
        {/* 7. Input นี้เป็น "Controlled Component"
          - value ผูกกับ Redux state
          - onChange ผูกกับฟังก์ชัน handleSearchChange
        */}
        <input
          type="text"
          id="searchInput"
          placeholder="Find products by name"
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {/* ส่วน Sorting Dropdown ถูกคอมเมนต์ไว้ใน HTML เดิม
        เราจึงยังไม่ใส่มันเข้ามาในตอนนี้
      */}
    </div>
  );
};

export default ShopControls;