import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// ตรวจสอบ localStorage ตอนเริ่ม
const userEmailFromStorage = JSON.parse(localStorage.getItem('loggedInUser'));

// --- Async Thunks (ส่วนเชื่อมต่อ Backend) ---
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      localStorage.setItem('loggedInUser', JSON.stringify(response.data.email));
      return response.data.email; 
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Invalid credentials' });
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
      return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
  }
);


export const fetchUserDetails = createAsyncThunk(
  'auth/fetchDetails',
  async (email, { rejectWithValue }) => {
    if (!email) {
      return rejectWithValue({ message: 'Email is required' });
    }
    try {
      
      const response = await apiClient.get(`/users/getName?email=${encodeURIComponent(email)}`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user details' });
    }
  }
);


export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ email, currentPass, newPass, samePass }, { rejectWithValue }) => {
    try {
      
      const response = await apiClient.post('/users/changePass', { email, currentPass, newPass, samePass });
      return response.data; 
    } catch (error) {
      
      return rejectWithValue(error.response?.data || { message: 'Password change failed' });
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userEmailFromStorage ? userEmailFromStorage : null, 
    userDetails: null, 
    status: 'idle', 
    error: null,    
  },
  reducers: {
    // Action สำหรับ Logout
    logout: (state) => {
      state.user = null;
      state.userDetails = null; 
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('loggedInUser'); 
    },
    // Action สำหรับเคลียร์ Error
    clearAuthError: (state) => {
      state.error = null;
      state.status = state.user ? 'succeeded' : 'idle'; // รีเซ็ต status
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Login Cases ---
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload; 
        state.userDetails = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Login failed';
      })

      // --- Register Cases ---
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.status || action.payload?.message || 'Registration failed';
      })

      // --- Cases สำหรับ fetchUserDetails ---
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload; // เก็บ { fname, lname }
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        console.error("fetchUserDetails rejected:", action.payload);
      })

      // --- Cases สำหรับ changePassword ---
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.status || action.payload?.message || 'Password change failed';
      });
  },
});


export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
