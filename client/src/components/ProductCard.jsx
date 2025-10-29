import React from 'react';
import { Link } from 'react-router-dom'; // ใช้ Link แทน <a>

const ProductCard = ({ product }) => {
  // (ใช้ logic การหา path รูปภาพจากโค้ดเดิมของคุณ)
  const imageMain = product.img && product.img.length > 0 ? `http://localhost:5000${product.img[0]}` : 'https://placehold.co/300x250';
  const imageHover = product.img && product.img.length > 1 ? `http://localhost:5000${product.img[1]}` : imageMain;

  // ‼️ แก้ไข path รูปภาพ: 
  // โค้ดเดิมของคุณใช้ ./backend แต่ API server น่าจะอยู่ที่ http://localhost:5000
  // ดังนั้น `http://localhost:5000${product.img[0]}` น่าจะถูกต้องกว่า
  // หาก backend เสิร์ฟรูปจาก /backend/ ก็ใช้ `http://localhost:5000/backend${product.img[0]}`
  
  return (
    <div className="card-product">
      <div className="card-product-wrapper">
        <Link to={`/product-detail?id=${product.id}`} className="product-img">
          <img className="lazyload img-product" data-src={imageMain} src={imageMain} alt={product.name} />
          <img className="lazyload img-hover" data-src={imageHover} src={imageHover} alt={`${product.name} Hover`} />
        </Link>
        {/* ... ส่วนปุ่ม Quick Add/Wishlist ... */}
      </div>
      <div className="card-product-info">
        <Link to={`/product-detail?id=${product.id}`} className="title link">{product.name}</Link>
        <span className="price">${parseFloat(product.price).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ProductCard;