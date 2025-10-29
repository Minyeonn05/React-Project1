import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ⭐️ เพิ่มส่วนนี้เข้าไป ⭐️
  css: {
    devSourcemap: false,
  }
})