import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cartService } from '../services/cartService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// กำหนด Path ไปยังไฟล์ product.json ของคุณ
const cartsFilePath = path.join(__dirname, '..', 'data', 'cart.json');

// --- Helper Functions สำหรับอ่าน/เขียนไฟล์ JSON ---
const readCartsFile = () => {
    try {
        const data = fs.readFileSync(cartsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return []; // ถ้าไฟล์ไม่มี ให้คืนค่าเป็น Array ว่าง
        }
        throw error;
    }
};

router.get('/', (req, res) => {
    try {
        // *** สำคัญ: อ่านไฟล์ JSON จากดิสก์ใหม่ทุกครั้งที่มี GET Request ***
        const carts = readCartsFile();
        res.json(carts);
    } catch (e) {
        res.status(400).json({ status: "Error Don't have file" });
    }
})

router.post('/add', (req, res) => {
    // *** สำคัญ: อ่านไฟล์ JSON จากดิสก์ใหม่ทุกครั้งที่มี GET Request ***
    const carts = readCartsFile();
    const response = cartService.addCart(req, res);
})

router.post('/remove', (req, res) => {
    // *** สำคัญ: อ่านไฟล์ JSON จากดิสก์ใหม่ทุกครั้งที่มี GET Request ***
    const carts = readCartsFile();
    const response = cartService.removeCart(req, res);
})

export default router;