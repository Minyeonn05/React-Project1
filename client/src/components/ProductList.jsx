
const ProductList = () => {
  // ...
  const allProducts = useSelector((state) => state.products.items);
  const searchTerm = useSelector((state) => state.products.searchTerm); // 👈 ดึงค่า filter

  // ... useEffect ...

  // กรองข้อมูล (applyFiltersAndSearch) ก่อน map
  const filteredProducts = allProducts.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    // ... logic กรอง size ...
  });

  // ...
  return (
    <div  id="nav-sunday" className="nav-sunday" style={{ margin: '0 7% 0 7%' }}>
      {/* ใช้ filteredProducts แทน products */}
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};