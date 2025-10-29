import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// 1. Thunk สำหรับดึงสินค้า (เหมือนเดิม)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await apiClient.get('/products');
    return response.data; 
  }
);

// 2. สร้าง Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [], 
    status: 'idle',
    searchTerm: '',
    filters: {
      prices: [],
      sizes: [],
    },
  },
  reducers: {
    // ฟังก์ชัน Search (เหมือนเดิม)
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    // ⭐️ 1. แก้ไขชื่อและ Logic
    togglePriceFilter: (state, action) => {
      const price = action.payload;
      const index = state.filters.prices.indexOf(price);
      if (index >= 0) {
        // ถ้ามีอยู่แล้ว ให้ลบออก
        state.filters.prices.splice(index, 1);
      } else {
        // ถ้ายังไม่มี ให้เพิ่มเข้าไป
        state.filters.prices.push(price);
      }
    },
    
    // ⭐️ 2. แก้ไขชื่อและ Logic
    toggleSizeFilter: (state, action) => {
      const size = action.payload;
      const index = state.filters.sizes.indexOf(size);
      if (index >= 0) {
        // ถ้ามีอยู่แล้ว ให้ลบออก
        state.filters.sizes.splice(index, 1);
      } else {
        // ถ้ายังไม่มี ให้เพิ่มเข้าไป
        state.filters.sizes.push(size);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; 
      });
  },
});

// ⭐️ 3. อัปเดตบรรทัด Export ให้ตรงกัน
export const { setSearchTerm, togglePriceFilter, toggleSizeFilter } = productSlice.actions;
export default productSlice.reducer;