const express = require('express');
const router = express.Router();
const path = require('path'); // Import path for resolving upload directory
const fs = require('fs'); // Import fs to ensure directory exists

const userService = require('../services/userServices');

// กำหนด Path ไปยังไฟล์ product.json ของคุณ
const cartsFilePath = path.join(__dirname, '..', 'data', 'cart.json');

// --- Mock/Placeholder for getting UID by Email ---
// *** สำคัญ: ฟังก์ชันนี้คือหัวใจสำคัญที่คุณต้องนำไปปรับใช้ใน userService ของคุณ ***
// ในความเป็นจริง, ฟังก์ชันนี้ควรเชื่อมต่อกับฐานข้อมูลผู้ใช้ หรือไฟล์ที่เก็บการแมป
// ระหว่าง email และ uid
const getUidByEmail = async (email) => {
    // ตัวอย่างการทำงาน: สมมติว่ามีไฟล์ 'data/users.json' ที่เก็บข้อมูลผู้ใช้ในรูปแบบ:
    // [
    //   { "email": "user1@example.com", "uid": "abc-123" },
    //   { "email": "user2@example.com", "uid": "def-456" }
    // ]
    const usersFilePath = path.join(__dirname, '..', 'data', 'user.json');
    try {
        // ตรวจสอบว่าไฟล์ users.json มีอยู่หรือไม่
        if (!fs.existsSync(usersFilePath)) {
            console.warn(`Warning: users.json not found at ${usersFilePath}. Cannot map email to ID.`);
            return null;
        }

        const users = fs.readFileSync(usersFilePath, "utf-8");
        const user = JSON.parse(users).find(u => u.email === email);
        //console.log(user);
        if (user && user.id) {
            //console.log(user.id);
            return user.id;
        }
        return null; // ไม่พบ uid สำหรับ email นี้
    } catch (error) {
        console.error("Error in getIdByEmail (mock function):", error);
        return null;
    }
};

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

router.get('/getName', async (req, res) => { // ทำให้เป็น async เพราะ getUidByEmail อาจจะ async
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ status: "Error: Email parameter is required." });
    }

    try {
        const uid = await getUidByEmail(email); // หา uid จาก email
        //console.log(uid);
        if (!uid) {
            return res.status(404).json({ status: "Error: User not found or UID missing for the provided email." });
        }

        // สร้าง path ของไฟล์ตาม uid ที่ได้มา
        const nameFilePath = path.join(__dirname, '..', 'users', `${uid}.json`);
        //console.log(ordersFilePath);
        const name = JSON.parse(fs.readFileSync(nameFilePath, "utf-8"));
        //console.log({ fname: name[0].fname, lname: name[0].lname })
        res.json({ fname: name[0].fname, lname: name[0].lname });
    } catch (e) {
        console.error(`Error retrieving orders for email: ${email}, UID: ${uid}`, e);
        res.status(500).json({ status: "Error: Could not retrieve orders for this user." });
    }
});

router.get('/getProfile', async (req, res) => { // ทำให้เป็น async เพราะ getUidByEmail อาจจะ async
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ status: "Error: Email parameter is required." });
    }

    try {
        const uid = await getUidByEmail(email); // หา uid จาก email
        //console.log(uid);
        if (!uid) {
            return res.status(404).json({ status: "Error: User not found or UID missing for the provided email." });
        }

        // สร้าง path ของไฟล์ตาม uid ที่ได้มา
        const profileFilePath = path.join(__dirname, '..', 'users', `${uid}.json`);
        //console.log(ordersFilePath);
        const profile = JSON.parse(fs.readFileSync(profileFilePath, "utf-8"));
        //console.log({ fname: name[0].fname, lname: name[0].lname })
        res.json(profile[0].profile);
    } catch (e) {
        console.error(`Error retrieving orders for email: ${email}, UID: ${uid}`, e);
        res.status(500).json({ status: "Error: Could not retrieve orders for this user." });
    }
});

router.get('/getOrderAll', async (req, res) => { // ทำให้เป็น async เพราะ getUidByEmail อาจจะ async
    //const { email } = req.query;
    let ordersAll = [];
    let users = [];
    try {
        const usersFilePath = path.join(__dirname, '..', 'data', `user.json`);
        let dataUser = fs.readFileSync(usersFilePath, "utf-8");
        users = JSON.parse(dataUser);
        for (let i = 1; i < users.length; i++) {
            const uid = await getUidByEmail(users[i].email); // หา uid จาก email
            //console.log(uid);
            if (!uid) {
                return res.status(404).json({ status: "Error: User not found or UID missing for the provided email." });
            }

            // สร้าง path ของไฟล์ตาม uid ที่ได้มา
            const ordersFilePath = path.join(__dirname, '..', 'users', `${uid}.json`);
            //console.log(ordersFilePath);
            const orders = JSON.parse(fs.readFileSync(ordersFilePath, "utf-8"));
            ordersAll.push({
                email: users[i].email,
                name: orders[0].fname + ' ' + orders[0].lname,
                orders: orders[0].orders, // This assumes orders[0].orders is an array or object of orders
                address: orders[0].address
            });
            //ordersAll.push(users[i].email ,orders[0].fname+' '+orders[0].lname, orders[0].orders);
        }
        //console.log(ordersAll);
        res.json(ordersAll);
    } catch (e) {
        console.error(`Error retrieving orders all`, e);
        res.status(500).json({ status: "Error: Could not retrieve orders for this user." });
    }
});

router.get('/getOrder', async (req, res) => { // ทำให้เป็น async เพราะ getUidByEmail อาจจะ async
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ status: "Error: Email parameter is required." });
    }

    try {
        const uid = await getUidByEmail(email); // หา uid จาก email
        //console.log(uid);
        if (!uid) {
            return res.status(404).json({ status: "Error: User not found or UID missing for the provided email." });
        }

        // สร้าง path ของไฟล์ตาม uid ที่ได้มา
        const ordersFilePath = path.join(__dirname, '..', 'users', `${uid}.json`);
        //console.log(ordersFilePath);
        const orders = JSON.parse(fs.readFileSync(ordersFilePath, "utf-8"));
        res.json(orders[0].orders);
    } catch (e) {
        console.error(`Error retrieving orders for email: ${email}, UID: ${uid}`, e);
        res.status(500).json({ status: "Error: Could not retrieve orders for this user." });
    }
});

router.get('/getAddress', async (req, res) => { // ทำให้เป็น async เพราะ getUidByEmail อาจจะ async
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ status: "Error: Email parameter is required." });
    }

    try {
        const uid = await getUidByEmail(email); // หา uid จาก email
        //console.log(uid);
        if (!uid) {
            return res.status(404).json({ status: "Error: User not found or UID missing for the provided email." });
        }

        // สร้าง path ของไฟล์ตาม uid ที่ได้มา
        const addressesFilePath = path.join(__dirname, '..', 'users', `${uid}.json`);
        const addresses = JSON.parse(fs.readFileSync(addressesFilePath, "utf-8"));
        res.json(addresses[0].address);
    } catch (e) {
        console.error(`Error retrieving addresses for email: ${email}, UID: ${uid}`, e);
        res.status(500).json({ status: "Error: Could not retrieve addresses for this user." });
    }
});

router.post('/login', (req, res) => {
    const response = userService.login(req, res)
})

router.post('/register', (req, res) => {
    const response = userService.register(req, res)
})

router.post('/changePass', (req, res) => {
    const response = userService.changePass(req, res)
})

router.post('/addOrder', (req, res) => {
    const response = userService.addOrder(req, res)
})

router.post('/removeOrder', (req, res) => {
    const response = userService.removeOrder(req, res)
})

router.post('/addAddress', (req, res) => {
    const response = userService.addAddress(req, res)
})

router.post('/removeAddress', (req, res) => {
    const response = userService.removeAddress(req, res)
})

module.exports = router;
