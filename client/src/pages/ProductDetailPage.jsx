// client/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/Product/productSlice';
import { addToCart } from '../features/Cart/cartSlice';

// Import Swiper React components and styles

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';


// (Optional) Import drift-zoom library or find a React equivalent if needed
// import Drift from 'drift-zoom';

const ProductDetailPage = () => {
  // --- Hooks called at the Top Level ---
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');

  const dispatch = useDispatch();
  const { items: allProducts, status: productStatus } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const cartStatus = useSelector((state) => state.cart.status);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // --- useEffects ---
  // Fetch all products if not already loaded
  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productStatus, dispatch]);

  // Find the specific product and set default size once products are loaded
  useEffect(() => {
    if (productStatus === 'succeeded' && allProducts.length > 0 && productId) {
      const foundProduct = allProducts.find(p => p.id === productId);

      if (foundProduct) {
        setProduct(foundProduct);
        const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];
        const availableSizes = foundProduct.sizes.filter(s => s.onShop === true);
        if (availableSizes.length > 0) {
          const largestAvailableSize = availableSizes.reduce((largest, current) => {
            return sizeOrder.indexOf(current.size) > sizeOrder.indexOf(largest.size) ? current : largest;
          }).size;
          // Set default size only if no size is selected yet or the current selection is invalid
          if (!selectedSize || !availableSizes.some(s => s.size === selectedSize)) {
             setSelectedSize(largestAvailableSize);
          }
        } else {
            setSelectedSize(''); // Clear size if none are available
        }
      } else {
        setProduct(null); // Set product to null if not found
        setSelectedSize('');
      }
    }
  }, [productStatus, allProducts, productId, selectedSize, dispatch]); // Added dispatch

  // (Optional) Initialize zoom library after images load
  // useEffect(() => {
  //   if (product && product.img && product.img.length > 0) {
  //     // Logic to initialize Drift or similar zoom library
  //   }
  // }, [product]);

  // --- Memoized Size Options ---
  // useMemo moved to the top level, before conditional returns
  const sizeOptions = useMemo(() => {
    if (!product || !product.sizes) return []; // Guard clause

    const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];
    const sortedSizes = [...product.sizes].sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));

    return sortedSizes.map(sizeInfo => (
      <React.Fragment key={sizeInfo.size}>
        {sizeInfo.onShop ? (
          <>
            <input
              type="radio"
              name="size"
              id={`values-${sizeInfo.size}`}
              value={sizeInfo.size}
              checked={selectedSize === sizeInfo.size}
              onChange={(e) => setSelectedSize(e.target.value)} // Update state directly
            />
            <label className="style-text" htmlFor={`values-${sizeInfo.size}`} data-value={sizeInfo.size}>
              <p>{sizeInfo.size}</p>
            </label>
          </>
        ) : (
          <label className="style-text-none" data-value={sizeInfo.size}>
            <p>{sizeInfo.size}</p>
          </label>
        )}
      </React.Fragment>
    ));
  }, [product, selectedSize]); // Dependencies are product and selectedSize

  // --- Handlers ---
  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    if (!user) {
      alert('กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าลงในรถเข็น');
      // Ideally, trigger the login modal here instead of alert
      return;
    }
    if (!selectedSize) {
      alert('กรุณาเลือกไซส์');
      return;
    }
    if (!product) return;

    dispatch(addToCart({
      item: product.name,
      size: selectedSize,
      quantity: quantity
    }))
    .unwrap()
    .then(() => {
       alert(`${quantity} x ${product.name} (ไซส์: ${selectedSize}) ถูกเพิ่มลงในรถเข็นแล้ว!`);
    })
    .catch((error) => {
       console.error('Add to cart error:', error);
       alert('เกิดข้อผิดพลาด: ' + (error?.message || 'ไม่สามารถเพิ่มสินค้าได้'));
    });
  };

  // --- Conditional Renders ---
  // These must come AFTER all hook calls
  if (productStatus === 'loading') {
    return <p className="text-center p-5">กำลังโหลด...</p>;
  }

  if (!product) {
    return <h1 className="text-center p-5">ไม่พบสินค้า</h1>;
  }

  // --- Main Render ---
  return (
    <>
      {/* --- Breadcrumb --- */}
      <div className="tf-breadcrumb">
        <div className="container">
          <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
            <div className="tf-breadcrumb-list">
              {/* You might want to fetch and display category info here */}
              <span className="text">{product.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Product Section --- */}
      <section>
        <div className="tf-main-product section-image-zoom">
          <div className="container">
            <div className="row">
              {/* --- Image Gallery --- */}
             <div className="col-md-6">
  <div className="tf-product-media-wrap sticky-top">
    <div className="thumbs-slider">
      {/* Thumbnail Swiper (เหมือนเดิม) */}
      <Swiper
          onSwiper={setThumbsSwiper}
          direction={'vertical'}
          spaceBetween={10}
          slidesPerView={'auto'}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]} // Navigation module อาจจะไม่จำเป็นแล้วถ้า Thumbnails ควบคุมอย่างเดียว
          className="tf-product-media-thumbs other-image-zoom"
          style={{ maxHeight: '846px' }}
      >
          {product.img.map((imagePath, index) => (
              <SwiperSlide key={index} className="stagger-item">
                  <div className="item">
                      <img src={`http://localhost:5000${imagePath}`} alt={`Thumbnail ${index + 1}`} />
                  </div>
              </SwiperSlide>
          ))}
      </Swiper>

      {/* Main Image Swiper */}
      <Swiper
          spaceBetween={10}
          // ❌ ลบ property 'navigation' ออก ❌
          // navigation={{
          //     nextEl: '.thumbs-next',
          //     prevEl: '.thumbs-prev',
          // }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Navigation, Thumbs]} // Navigation module อาจจะไม่จำเป็นแล้ว
          className="tf-product-media-main"
      >
          {product.img.map((imagePath, index) => (
              <SwiperSlide key={index}>
                  <div className="item">
                      <img
                          className="tf-image-zoom"
                          src={`http://localhost:5000${imagePath}`}
                          alt={product.name}
                      />
                  </div>
              </SwiperSlide>
          ))}
          {/* ❌ ลบ div ของปุ่มลูกศรออก ❌ */}
          {/* <div className="swiper-button-next button-style-arrow thumbs-next"></div> */}
          {/* <div className="swiper-button-prev button-style-arrow thumbs-prev"></div> */}
      </Swiper>
    </div>
  </div>
</div>

              {/* --- Product Info --- */}
              <div className="col-md-6">
                <div className="tf-product-info-wrap position-relative">
                  <div className="tf-zoom-main"></div> {/* Container for zoom pane */}
                  <div className="tf-product-info-list other-image-zoom">
                    <div className="tf-product-info-title">
                      <h5>{product.name}</h5>
                    </div>
                    <div className="tf-product-info-price">
                      {/* Add logic here if there's a discounted price */}
                      <div className="price-on-sale">${parseFloat(product.price).toFixed(2)}</div>
                    </div>

                    {/* Size Picker */}
                    <div className="tf-product-info-variant-picker">
                      <div className="variant-picker-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="variant-picker-label">
                            Size: <span className="fw-6 variant-picker-label-value">{selectedSize || 'เลือกไซส์'}</span>
                          </div>
                          {/* Add back the "Find your size" modal trigger if needed */}
                        </div>
                        <div className="variant-picker-values">
                          {sizeOptions}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="tf-product-info-quantity">
                      <div className="quantity-title fw-6">Quantity</div>
                      <div className="wg-quantity">
                        <span className="btn-quantity minus-btn" onClick={() => handleQuantityChange(-1)}>-</span>
                        <input type="text" name="number" value={quantity} readOnly />
                        <span className="btn-quantity plus-btn" onClick={() => handleQuantityChange(1)}>+</span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="tf-product-info-buy-button">
                      <button
                        onClick={handleAddToCartClick}
                        disabled={cartStatus === 'loading' || !selectedSize}
                        className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                        id="add-to-cart-button" // ID might not be needed in React
                      >
                        {cartStatus === 'loading' ? (
                          <span>กำลังเพิ่ม...</span>
                        ) : (
                          <>
                            <span>Add to cart -&nbsp;</span>
                            <span className="tf-qty-price">${(parseFloat(product.price) * quantity).toFixed(2)}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Add other sections like description, details, etc. here if desired */}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailPage;