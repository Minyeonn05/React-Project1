import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// ตรวจสอบ localStorage ตอนเริ่ม
const user = JSON.parse(localStorage.getItem('loggedInUser'));

// 1. สร้าง Async Thunk (สำหรับยิง API)
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      localStorage.setItem('loggedInUser', JSON.stringify(response.data.email));
      return response.data.email;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/users/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 2. สร้าง Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user ? user : null,
    status: 'idle', // 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('loggedInUser');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      });
      // (เพิ่ม ...registerUser.pending/fulfilled/rejected... ที่นี่)
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;