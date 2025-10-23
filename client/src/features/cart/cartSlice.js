import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.user) return rejectWithValue('Not logged in');
    try {
      const response = await apiClient.get('/carts');
      const userCart = response.data.find(cart => cart.email === auth.user);
      return userCart ? userCart.carts : [];
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ item, size }, { getState, dispatch }) => {
    const { auth } = getState();
    await apiClient.post('/carts/remove', { email: auth.user, item, size });
    dispatch(fetchCart()); // ดึงข้อมูลตะกร้าใหม่
    return { item, size };
  }
);

export const checkout = createAsyncThunk(
  'cart/checkout',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { auth, cart } = getState();
    if (!auth.user) return rejectWithValue('Not logged in');
    
    // 1. คัดลอก items
    const itemsToOrder = [...cart.items];

    // 2. เพิ่ม order
    await apiClient.post('/users/addOrder', {
      email: auth.user,
      order: itemsToOrder,
    });

    // 3. ลบของในตะกร้า (ทำซ้ำเหมือนโค้ดเดิม)
    const removalPromises = itemsToOrder.flatMap(item => 
      Array(item.amount).fill().map(() => 
        apiClient.post('/carts/remove', {
          email: auth.user,
          item: item.item,
          size: item.size
        })
      )
    );
    await Promise.all(removalPromises);

    dispatch(fetchCart()); // ดึงตะกร้าใหม่ (จะกลายเป็นว่างเปล่า)
    return { success: true };
  }
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // userCart.carts
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      });
      // ... (เพิ่ม cases สำหรับ thunks อื่นๆ)
  },
});

export default cartSlice.reducer;