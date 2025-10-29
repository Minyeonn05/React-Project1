

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Offcanvas, Button } from 'react-bootstrap';
import { fetchCart, addToCart, removeFromCart, checkout } from './cartSlice'; 
import { BsTrash3 } from "react-icons/bs"; 
import { Link } from 'react-router-dom';

// Component CartModal รับ props show และ onHide
const CartModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const products = useSelector((state) => state.products.items); // ใช้ items จาก productSlice
  const cartStatus = useSelector((state) => state.cart.status); // ใช้เช็คสถานะ loading

  // คำนวณ Subtotal
  const subtotal = cart.items.reduce((sum, cartItem) => {
    const productDetail = products.find(p => p.name === cartItem.item);
    const itemPrice = productDetail ? parseFloat(productDetail.price) : 0;
    return sum + (itemPrice * cartItem.amount);
  }, 0);

  // ⭐️ 2. สร้าง Handlers สำหรับปุ่ม +/- และ Remove ⭐️
  const handleIncreaseQuantity = (item, size) => {
    // Dispatch action 'addToCart' โดยส่ง quantity เป็น 1 เพื่อเพิ่มทีละชิ้น
    dispatch(addToCart({ item, size, quantity: 1 }));
  };

  const handleDecreaseQuantity = (item, size) => {
    // Dispatch action 'removeFromCart' เพื่อลดทีละชิ้น
    dispatch(removeFromCart({ item, size }));
  };

  const handleRemoveItem = (item, size) => {
    
     if (window.confirm(`ต้องการลบ ${item} (ไซส์: ${size}) ออกจากตะกร้าหรือไม่?`)) {
       dispatch(removeFromCart({ item, size }));
     }
     
  };

  // Handler สำหรับปุ่ม Checkout
  const handleCheckout = () => {
    if (cart.items.length === 0) {
        alert("ตะกร้าของคุณว่างเปล่า");
        return;
    }
    if (window.confirm('ยืนยันการสั่งซื้อ?')) {
      dispatch(checkout())
        .unwrap()
        .then(() => {
          alert('สั่งซื้อสำเร็จ!');
          onHide(); // ปิดตะกร้า
        })
        .catch((error) => {
          // แสดงข้อความ error ที่ได้จาก rejectWithValue ใน Thunk
          alert('เกิดข้อผิดพลาด: ' + (error.message || 'กรุณาลองใหม่อีกครั้ง'));
        });
    }
  };

  // --- JSX สำหรับ Render ---
  return (
    // ใช้ Offcanvas ของ react-bootstrap
    <Offcanvas show={show} onHide={onHide} placement="end" id="shoppingCart">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="fw-5">ตะกร้าสินค้า</Offcanvas.Title>
      </Offcanvas.Header>
      {/* เพิ่ม class cart-modal-body สำหรับ CSS */}
      <Offcanvas.Body className="d-flex flex-column p-0 cart-modal-body">

        {/* ส่วน Scrollable ที่แสดงรายการสินค้า */}
        {/* ใช้ px-3 (padding ซ้าย-ขวา) แทน margin ใน item */}
        <div className="tf-mini-cart-sroll flex-grow-1 px-3">
          {/* แสดงสถานะ Loading */}
          {cartStatus === 'loading' && <p className="text-center p-3">กำลังโหลด...</p>}
          {/* แสดงข้อความเมื่อตะกร้าว่าง (หลังจากโหลดเสร็จ) */}
          {cartStatus !== 'loading' && cart.items.length === 0 && (
            <p className="text-center p-3">ตะกร้าของคุณว่างเปล่า</p>
          )}

          {/* ถ้ามีสินค้า ให้แสดงรายการ */}
          {cartStatus !== 'loading' && cart.items.length > 0 && (
            <div className="tf-mini-cart-items">
              {cart.items.map((cartItem) => {
                // หาข้อมูลสินค้าจาก product state
                const productDetail = products.find(p => p.name === cartItem.item);
                // ถ้าหาไม่เจอ (อาจจะยังโหลดไม่เสร็จ) ให้ข้ามไปก่อน
                if (!productDetail) return null;
                // หา path รูปภาพ
                const imagePath = productDetail.img.length > 0 ? `http://localhost:5000${productDetail.img[0]}` : 'https://placehold.co/70x90'; // ใส่ Placeholder

                return (
                  <div className="cart-item-new" key={`${cartItem.item}-${cartItem.size}`}> {/* ใช้ class ใหม่ */}

                    {/* ส่วนรูปภาพ */}
                    <div className="cart-item-image">
                      <Link to={`/product-detail?id=${productDetail.id}`} onClick={onHide}> {/* เพิ่ม onClick={onHide} เพื่อปิด modal */}
                        <img src={imagePath} alt={productDetail.name} />
                      </Link>
                    </div>

                    {/* ส่วนข้อมูลและปุ่ม */}
                    <div className="cart-item-details">
                      {/* กลุ่มข้อมูล (ชื่อ, ราคา) */}
                      <div className='cart-item-info'>
                          <Link className="cart-item-title link" to={`/product-detail?id=${productDetail.id}`} onClick={onHide}>
                              {/* แสดงชื่อสินค้า และ Size ถ้ามี */}
                              {cartItem.item} {cartItem.size && `(${cartItem.size})`}
                          </Link>
                          <div className="cart-item-price fw-6">${parseFloat(productDetail.price).toFixed(2)}</div>
                      </div>

                      {/* กลุ่มปุ่ม (Quantity, Remove) */}
                      <div className='cart-item-actions'>
                          {/* ปุ่ม Quantity */}
                          <div className="cart-quantity-selector">
                              <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => handleDecreaseQuantity(cartItem.item, cartItem.size)}
                                  // ปิดปุ่มตอนกำลังโหลด หรือถ้าจำนวนเหลือ 1 (ไม่ให้ลดต่ำกว่า 1)
                                  disabled={cartStatus === 'loading' || cartItem.amount <= 1}
                              >
                                  -
                              </Button>
                              <span className="quantity-display">{cartItem.amount}</span>
                              <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => handleIncreaseQuantity(cartItem.item, cartItem.size)}
                                  disabled={cartStatus === 'loading'} // ปิดปุ่มตอนกำลังโหลด
                              >
                                  +
                              </Button>
                          </div>
                          {/* ปุ่ม Remove (ถังขยะ) */}
                          <Button
                              variant="light" // หรือ "outline-danger" ถ้าอยากให้เป็นสีแดง
                              className='cart-remove-button'
                              onClick={() => handleRemoveItem(cartItem.item, cartItem.size)}
                              disabled={cartStatus === 'loading'} // ปิดปุ่มตอนกำลังโหลด
                          >
                              <BsTrash3 /> {/* ใช้ไอคอน */}
                          </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer ของตะกร้า (ส่วน Subtotal และ Checkout) */}
        {/* แสดงส่วน Footer เฉพาะเมื่อมีสินค้าในตะกร้า */}
        {cart.items.length > 0 && (
            <div className="tf-mini-cart-bottom">
              <div className="tf-mini-cart-bottom-wrap">
                {/* ส่วน Subtotal */}
                <div className="tf-cart-totals-discounts">
                  <div className="tf-cart-total">ราคารวม</div>
                  <div className="tf-totals-total-value fw-6">${subtotal.toFixed(2)} BATH</div>
                </div>
                {/* ข้อความ Taxes */}
                <div className="tf-cart-tax">
                  ภาษีและค่าจัดส่งจะคำนวณตอนชำระเงิน
                </div>
                {/* เส้นคั่น */}
                <div className="tf-mini-cart-line"></div>
                {/* ปุ่ม Checkout */}
                <div className="tf-mini-cart-view-checkout">
                  <Button
                    onClick={handleCheckout}
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                   
                    disabled={cart.items.length === 0 || cartStatus === 'loading'}
                  >
                    
                    {cartStatus === 'loading' ? 'กำลังดำเนินการ...' : 'ไปหน้าชำระเงิน'}
                  </Button>
                </div>
              </div>
            </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartModal;