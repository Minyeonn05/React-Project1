import { configureStore } from '@reduxjs/toolkit';
import productReducer from 'C:/react-app/React-Project/client/src/features/product/productSlice.js';
import cartReducer from 'C:/react-app/React-Project/client/src/features/cart/cartSlice.js';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});