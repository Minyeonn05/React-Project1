import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/product/productSlice';
import ProductList from '../features/product/ProductList';
import ShopControls from '../components/common/ShopControls.jsx';
import FilterSidebar from '../features/product/FilterSidebar';
import { useState } from 'react';

const ShopPage = () => {
  const dispatch = useDispatch();
  const productStatus = useSelector(state => state.products.status);
  const [showFilter, setShowFilter] = useState(false);

  // สั่งดึงสินค้าเมื่อหน้านี้โหลด (เหมือน initializeShopPage)
  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productStatus, dispatch]);

  return (
    <>
      {/* ส่วนหัว Page Title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">New Arrival</div>
          <p className="text-center text-2 text_black-2 mt_5">Shop through our latest selection of Fashion</p>
        </div>
      </div>

      {/* ส่วน Section Product */}
      <section className="flat-spacing-2">
        <div className="container">
          {/* ส่วนควบคุม (Filter, Search) */}
          <ShopControls onFilterClick={() => setShowFilter(true)} />
        </div>

        {/* แสดง Loading หรือ ProductList */}
        {productStatus === 'loading' ? (
          <p id="loadingMessage" className="text-center text-gray-500 col-span-full">กำลังโหลดสินค้า...</p>
        ) : (
          <ProductList />
        )}
      </section>

      {/* Modal/Offcanvas สำหรับ Filter */}
      <FilterSidebar show={showFilter} onHide={() => setShowFilter(false)} />
    </>
  );
};

export default ShopPage;