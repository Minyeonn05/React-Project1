import React, { useMemo } from 'react';
import { Offcanvas, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
// 1. Import actions ที่เราจะสร้างใน slice
import { toggleSizeFilter, togglePriceFilter } from './productSlice';

// 2. รับ props show และ onHide จาก ShopPage.jsx
const FilterSidebar = ({ show, onHide }) => {
  const dispatch = useDispatch();

  // 3. ดึงข้อมูลจาก Redux store
  const allProducts = useSelector((state) => state.products.items);
  const currentFilters = useSelector((state) => state.products.filters);

  // 4. สร้างรายการ Filter (แทนฟังก์ชัน populateFilters)
  // useMemo จะช่วยให้โค้ดนี้ทำงานแค่ครั้งเดียว (หรือเมื่อ allProducts เปลี่ยน)
  const availableFilters = useMemo(() => {
    // Logic จาก populateFilters()
    const prices = [...new Set(allProducts.map(p => parseFloat(p.price)))].sort((a, b) => a - b);
    const sizes = [...new Set(
      allProducts.flatMap(p => 
        p.sizes.filter(s => s.onShop).map(s => s.size)
      )
    )].sort(); // .sort() เพื่อเรียงลำดับ

    return { prices, sizes };
  }, [allProducts]); // คำนวณใหม่เมื่อ 'allProducts' เปลี่ยน

  // 5. สร้างฟังก์ชันสำหรับ dispatch action เมื่อคลิก
  // (แทน addEventListener และ applyFiltersAndSearch)
  const handleSizeChange = (e) => {
    dispatch(toggleSizeFilter(e.target.value));
  };

  const handlePriceChange = (e) => {
    // ต้องแปลงค่ากลับเป็นตัวเลข
    dispatch(togglePriceFilter(parseFloat(e.target.value)));
  };

  return (
    // 6. ใช้ <Offcanvas> ของ react-bootstrap
    <Offcanvas show={show} onHide={onHide} placement="start" id="filterShop" className="canvas-filter">
      <Offcanvas.Header closeButton className="canvas-header">
        <div className="filter-icon">
          <span className="icon icon-filter"></span>
          <span>Filter</span>
        </div>
      </Offcanvas.Header>

      <Offcanvas.Body className="canvas-body">
        <Form id="facet-filter-form" className="facet-filter-form">
          
          {/* ========== ส่วน Filter ราคา ========== */}
          {/* หมายเหตุ: โค้ดเดิมของคุณมี Slider แต่ Logic (populateFilters)
              สร้าง Checkbox. ผมจะยึดตาม Logic นะครับ */}
          <div className="widget-facet">
            <div className="facet-title">
              <span>Price</span>
              <span className="icon icon-arrow-up"></span>
            </div>
            <div id="price" className="collapse show">
              <ul className="tf-filter-group current-scrollbar">
                {availableFilters.prices.map((price) => (
                  <li className="list-item d-flex gap-12 align-items-center" key={price}>
                    <Form.Check
                      type="checkbox"
                      id={`price-${price}`}
                      value={price}
                      // 7. 'checked' จะถูกควบคุมโดย Redux state
                      checked={currentFilters.prices.includes(price)}
                      onChange={handlePriceChange}
                      className="tf-check"
                      label={<span>${price.toFixed(2)}</span>}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ========== ส่วน Filter ไซส์ ========== */}
          <div className="widget-facet">
            <div className="facet-title">
              <span>Size</span>
              <span className="icon icon-arrow-up"></span>
            </div>
            <div id="size" className="collapse show">
              <ul className="tf-filter-group current-scrollbar">
                {availableFilters.sizes.map((size) => (
                  <li className="list-item d-flex gap-12 align-items-center" key={size}>
                    <Form.Check
                      type="checkbox"
                      id={`size-${size}`}
                      value={size}
                      // 8. 'checked' จะถูกควบคุมโดย Redux state
                      checked={currentFilters.sizes.includes(size)}
                      onChange={handleSizeChange}
                      className="tf-check"
                      label={<span>{size}</span>}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FilterSidebar;