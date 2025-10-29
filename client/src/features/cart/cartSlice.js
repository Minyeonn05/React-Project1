import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// ==================
//    Async Thunks
// ==================

// --- Thunk สำหรับดึงข้อมูลตะกร้า ---
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState(); // ดึง state ปัจจุบัน (ต้องการ user email)
    if (!auth.user) {
      // ไม่ได้ login ไม่ต้องทำอะไร (หรือจะคืนค่า error ก็ได้)
      // return rejectWithValue({ message: 'Not logged in' }); 
      return []; // คืนค่า array ว่างเปล่า
    }
    try {
      const response = await apiClient.get('/carts');
      const userCart = response.data.find(cart => cart.email === auth.user);
      return userCart ? userCart.carts : []; // คืนค่า array สินค้าในตะกร้า
    } catch (error) {
      console.error('Fetch Cart Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch cart' });
    }
  }
);

// --- Thunk สำหรับเพิ่มสินค้าลงตะกร้า ---
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ item, size, quantity }, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.user) {
      return rejectWithValue({ message: 'กรุณาเข้าสู่ระบบ' });
    }

    const payload = { email: auth.user, item, size };
    
    try {
      // สร้าง array ของ Promises สำหรับการยิง API ตามจำนวน quantity
      const addPromises = [];
      for (let i = 0; i < quantity; i++) {
        addPromises.push(apiClient.post('/carts/add', payload));
      }
      await Promise.all(addPromises); // รอให้ทุก request เสร็จ
      
      // หลังจากเพิ่มสำเร็จ ให้ dispatch(fetchCart()) เพื่อดึงข้อมูลล่าสุด
      dispatch(fetchCart()); 
      
      return { item, size, quantity }; // คืนค่าข้อมูลที่เพิ่มสำเร็จ (ถ้าต้องการ)

    } catch (error) {
      console.error('API Add to Cart Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: 'ไม่สามารถเพิ่มสินค้าได้' });
    }
  }
);

// --- Thunk สำหรับลบสินค้าออกจากตะกร้า ---
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ item, size }, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.user) {
      return rejectWithValue({ message: 'Not logged in' });
    }
    try {
      await apiClient.post('/carts/remove', { email: auth.user, item, size });
      // หลังจากลบสำเร็จ ให้ dispatch(fetchCart()) เพื่อดึงข้อมูลล่าสุด
      dispatch(fetchCart()); 
      return { item, size }; // คืนค่าข้อมูลที่ลบสำเร็จ (ถ้าต้องการ)
    } catch (error) {
      console.error('API Remove From Cart Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: 'ไม่สามารถลบสินค้าได้' });
    }
  }
);

// --- Thunk สำหรับ Checkout ---
export const checkout = createAsyncThunk(
  'cart/checkout',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { auth, cart } = getState();
    if (!auth.user) {
      return rejectWithValue({ message: 'กรุณาเข้าสู่ระบบ' });
    }
    if (cart.items.length === 0) {
      return rejectWithValue({ message: 'ตะกร้าของคุณว่างเปล่า' });
    }

    // 1. คัดลอกรายการสินค้าก่อนลบ
    const itemsToOrder = [...cart.items];

    try {
      // 2. เพิ่มรายการสั่งซื้อ
      await apiClient.post('/users/addOrder', {
        email: auth.user,
        order: itemsToOrder,
      });

      // 3. สร้าง Promises สำหรับลบสินค้าทุกชิ้นในตะกร้า (เหมือนโค้ดเดิม)
      const removalPromises = itemsToOrder.flatMap(item => 
        Array(item.amount).fill().map(() => 
          apiClient.post('/carts/remove', {
            email: auth.user,
            item: item.item,
            size: item.size
          })
        )
      );
      await Promise.all(removalPromises); // รอให้ลบเสร็จ

      // 4. ดึงข้อมูลตะกร้าใหม่ (ซึ่งควรจะว่าง)
      dispatch(fetchCart()); 
      return { success: true }; // คืนค่าว่าสำเร็จ

    } catch (error) {
      console.error('API Checkout Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: 'เกิดข้อผิดพลาดระหว่าง Checkout' });
    }
  }
);

// ==================
//      Slice
// ==================
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
   
   clearCart: (state) => {
  state.items = []; 
    state.status = 'idle'; 
      state.error = null;  
    }
    
  },
  // extraReducers ใช้จัดการ state ตามสถานะของ Async Thunks
  extraReducers: (builder) => {
    builder
      // --- Cases for fetchCart ---
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null; // เคลียร์ error เก่า
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // อัปเดตรายการสินค้า
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch cart'; // เก็บ error message
      })

      // --- Cases for addToCart ---
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading'; // เปลี่ยน status เป็น loading ตอนกดปุ่ม
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.status = 'succeeded'; // สำเร็จ (state.items จะถูกอัปเดตโดย fetchCart ที่ตามมา)
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to add item to cart'; // เก็บ error
      })

      // --- Cases for removeFromCart ---
      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading'; 
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to remove item';
      })

      // --- Cases for checkout ---
      .addCase(checkout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state) => {
        state.status = 'succeeded';
        // state.items ถูกเคลียร์โดย fetchCart ที่ถูก dispatch ไปแล้ว
      })
      .addCase(checkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Checkout failed';
      });
  },
});

// (ถ้ามี reducers ปกติ ก็ export actions ตรงนี้)
// export const { clearCart } = cartSlice.actions; 
export default cartSlice.reducer;
export const { clearCart } = cartSlice.actions;