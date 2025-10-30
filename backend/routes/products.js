const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. (สำคัญ) Import service ที่เป็น CommonJS
// ‼️ (สังเกตว่าเรา import 'getProducts' มาด้วย)
const productService = require('../services/productServices');

// 2. กำหนด Path (ถูกต้องแล้ว)
// (นี่คือโฟลเดอร์ "ชั่วคราว" สำหรับ Multer)
const tempUploadDir = path.join(__dirname, '..', 'temp_uploads');

// 3. ตั้งค่า Multer (ถูกต้องแล้ว)
if (!fs.existsSync(tempUploadDir)) {
    fs.mkdirSync(tempUploadDir, { recursive: true });
}
const upload = multer({ dest: tempUploadDir });

// --- Routes ---

// ‼️ --- START: ADDED GET ROUTE --- ‼️
// นี่คือ Route ที่หายไป ที่ทำให้เกิด Lỗi 404
router.get('/', productService.getProducts);
// ‼️ --- END: ADDED GET ROUTE --- ‼️


// (POST /api/products/add)
// (ใช้ field 'newImages' ให้ตรงกับ ProductModal.jsx)
router.post('/add', upload.array('newImages', 5), productService.addProduct);

// (POST /api/products/edit)
router.post('/edit', upload.array('newImages', 5), productService.editProduct);

// (Route อื่นๆ เหมือนเดิม)
router.post('/remove', productService.removeProduct);
router.post('/sizeAdd', productService.sizeAdd);
router.post('/sizeRemove', productService.sizeRemove);

// (Export แบบ CommonJS)
module.exports = router;