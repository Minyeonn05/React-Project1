const express = require('express');
const cors = require('cors');
// ‼️ (ลบ bodyParser และ multer ออกจากไฟล์นี้)
const path = require('path'); // (path ยังต้องใช้)

const app = express();
const PORT = 5000;

app.use(cors());

// ‼️ ใช้ express.json() (แบบใหม่) แทน bodyParser
app.use(express.json());

// ‼️ --- (นี่คือจุดที่แก้ไข) --- ‼️
// 1. (สำคัญ) เปลี่ยนไปเสิร์ฟโฟลเดอร์ 'uploads' (โฟลเดอร์เก็บไฟล์จริง)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// (เราไม่จำเป็นต้องเสิร์ฟ 'temp_uploads' แล้ว เพราะไฟล์จะถูกย้ายทันที)
// ‼️ --- (จบส่วนที่แก้ไข) --- ‼️

// (Route ของคุณเหมือนเดิม)
app.use('/api/carts', require('./routes/carts.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/api/products', require('./routes/products.js')); // (ไฟล์นี้จะจัดการ Multer เอง)

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})