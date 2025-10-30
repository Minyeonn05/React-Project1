const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. (สำคัญ) Import service ที่เป็น CommonJS
// ‼️ (สังเกตว่าเรา import 'getProducts' มาด้วย)
const productService = require('../services/productServices');

// 2. กำหนด Path (เหมือนเดิม)
const tempUploadDir = path.join(__dirname, '..', 'temp_uploads');

// 3. ตั้งค่า Multer (เหมือนเดิม)
if (!fs.existsSync(tempUploadDir)) {
    fs.mkdirSync(tempUploadDir, { recursive: true });
}
const upload = multer({ dest: tempUploadDir });

// --- Routes ---

// ‼️ --- START: ADDED GET ROUTE --- ‼️
// นี่คือ Route ที่หายไป ที่ทำให้เกิด Lỗi 404
router.get('/', productService.getProducts);
// ‼️ --- END: ADDED GET ROUTE --- ‼️


// 6. (สำคัญ) แก้ชื่อ field เป็น 'newImages' (ให้ตรงกับ ProductModal.jsx)
router.post('/add', upload.array('newImages', 5), productService.addProduct);
router.post('/edit', upload.array('newImages', 5), productService.editProduct);

// 7. (สำคัญ) ลบการอ่านไฟล์ที่ซ้ำซ้อนออก
router.post('/remove', productService.removeProduct);
router.post('/sizeAdd', productService.sizeAdd);
router.post('/sizeRemove', productService.sizeRemove);

// 8. (สำคัญ) Export แบบ CommonJS
module.exports = router;