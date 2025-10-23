import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../../components/ProductCard';

const ProductList = () => {
  // 1. ดึงข้อมูลทั้งหมดจาก store
  const allProducts = useSelector((state) => state.products.items);
  const searchTerm = useSelector((state) => state.products.searchTerm);
  const filters = useSelector((state) => state.products.filters);

  // 2. กรองข้อมูล (แทน applyFiltersAndSearch)
  // useMemo จะทำงานใหม่ต่อเมื่อข้อมูลที่เกี่ยวข้องเปลี่ยน
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    
    return allProducts.filter(product => {
      // Logic จากโค้ดเดิมของคุณ
      const productPrice = parseFloat(product.price);
      const matchesPrice = filters.prices.length === 0 || filters.prices.includes(productPrice);
      const matchesSize = filters.sizes.length === 0 || product.sizes.some(s => filters.sizes.includes(s.size) && s.onShop);
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      
      return matchesPrice && matchesSize && matchesSearch;
    });
  }, [allProducts, searchTerm, filters]);

  // 3. Render
  if (filteredProducts.length === 0) {
    return <p className='text-center text-gray-600 col-span-full'>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>;
  }

  return (
    <div id="nav-sunday" className="nav-sunday" data-grid="grid-4" style={{ margin: '0 7% 0 7%' }}>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;