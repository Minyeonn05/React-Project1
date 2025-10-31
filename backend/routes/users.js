const express = require('express');
const router = express.Router();
// ‼️ (ลบ import 'path' และ 'fs' ออก เพราะย้ายไป service แล้ว)

// ‼️ (มีแค่ import เดียว)
const userService = require('../services/userServices');

// ‼️ (ลบ Helper function 'getUidByEmail' และ 'readCartsFile' ออก)

// --- GET Routes (ชี้ไปที่ Service) ---
router.get('/getName', userService.getName);
router.get('/getProfile', userService.getProfile);
router.get('/getOrder', userService.getOrder);
router.get('/getAddress', userService.getAddress);

// ‼️ --- ADMIN GET Route (เปลี่ยนชื่อจาก /getOrderAll เป็น /getAllOrders) --- ‼️
router.get('/getAllOrders', userService.getAllOrders);

// --- POST Routes (เหมือนเดิม แต่ชี้ไปฟังก์ชันที่ Refactor แล้ว) ---
router.post('/login', userService.login); //
router.post('/register', userService.register); //
router.post('/changePass', userService.changePass); //
router.post('/addOrder', userService.addOrder); //
router.post('/removeOrder', userService.removeOrder); //
router.post('/addAddress', userService.addAddress); //
router.post('/removeAddress', userService.removeAddress); //

// ‼️ --- ADMIN POST Route (เพิ่มใหม่) --- ‼️
router.post('/removeAdminOrder', userService.removeAdminOrder);

module.exports = router;