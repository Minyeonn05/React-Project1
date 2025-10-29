import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Offcanvas, Button } from 'react-bootstrap'; // 1. Import
import { removeFromCart, checkout } from './cartSlice';
import { Link } from 'react-router-dom';

// 2. รับ props show และ onHide
const CartModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const products = useSelector((state) => state.products.items);

  // คำนวณ Subtotal (จาก logic เดิม)
  const subtotal = cart.items.reduce((sum, cartItem) => {
    const productDetail = products.find(p => p.name === cartItem.item);
    const itemPrice = productDetail ? parseFloat(productDetail.price) : 0;
    return sum + (itemPrice * cartItem.amount);
  }, 0);

  const handleRemove = (item, size) => {
    if (window.confirm(`ต้องการลบ ${item} (ไซส์: ${size}) 1 ชิ้น?`)) {
      dispatch(removeFromCart({ item, size }));
    }
  };

  const handleCheckout = () => {
    if (window.confirm('Are you sure you want to checkout?')) {
      dispatch(checkout())
        .unwrap() // .unwrap() ช่วยให้เรา .then .catch ได้
        .then(() => {
          alert('Checkout successful!');
          onHide(); // ปิดตะกร้า
        })
        .catch((error) => {
          alert('An error occurred: ' + (error.message || 'Please try again'));
        });
    }
  };

  return (
    // 3. ใช้ Offcanvas
    <Offcanvas show={show} onHide={onHide} placement="end" id="shoppingCart">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="fw-5">Shopping cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column p-0">
        
        <div className="tf-mini-cart-sroll flex-grow-1">
          {cart.status === 'loading' && <p>Loading...</p>}
          {cart.status !== 'loading' && cart.items.length === 0 && (
            <p className="text-center p-3">Your cart is empty.</p>
          )}

          <div className="tf-mini-cart-items">
            {cart.items.map((cartItem) => {
              const productDetail = products.find(p => p.name === cartItem.item);
              if (!productDetail) return null;
              const imagePath = productDetail.img.length > 0 ? `http://localhost:5000${productDetail.img[0]}` : '';

              return (
                <div className="tf-mini-cart-item" key={`${cartItem.item}-${cartItem.size}`}>
                  <div className="tf-mini-cart-image">
                    <Link to={`/product-detail?id=${productDetail.id}`}>
                      <img src={imagePath} alt={productDetail.name} />
                    </Link>
                  </div>
                  <div className="tf-mini-cart-info">
                    <Link className="title link" to={`/product-detail?id=${productDetail.id}`}>
                      {cartItem.item}
                    </Link>
                    <div className="meta-variant">Size: {cartItem.size}</div>
                    <div className="price fw-6">${parseFloat(productDetail.price).toFixed(2)}</div>
                    <div className="tf-mini-cart-btns">
                      <div className="wg-quantity small">
                        <input type="text" name="number" value={cartItem.amount} readOnly />
                      </div>
                      <div 
                        className="tf-mini-cart-remove" 
                        onClick={() => handleRemove(cartItem.item, cartItem.size)}
                        style={{cursor: 'pointer'}} // เพิ่ม cursor
                      >
                        Remove
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer ของตะกร้า */}
        <div className="tf-mini-cart-bottom">
          <div className="tf-mini-cart-bottom-wrap">
            <div className="tf-cart-totals-discounts">
              <div className="tf-cart-total">Subtotal</div>
              <div className="tf-totals-total-value fw-6">${subtotal.toFixed(2)} BATH</div>
            </div>
            {/* ... */}
            <div className="tf-mini-cart-view-checkout">
              <Button 
                onClick={handleCheckout} 
                className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
              >
                <span>Check out</span>
              </Button>
            </div>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartModal;