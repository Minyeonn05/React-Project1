const fs = require('fs');
const path = require('path');

// ‼️ --- กำหนด Path หลักไว้ด้านบน --- ‼️
const userFilePath = path.join(__dirname, "..", "data", "user.json");
const usersDirectory = path.join(__dirname, "..", "users"); // (เปลี่ยนจาก directoryPath)

// ‼️ --- START: NEW HELPER FUNCTIONS --- ‼️

/**
 * (Helper 1) ค้นหา ID ของ User จาก Email
 * (นำ Logic จาก users.js และ userServices.js มารวมกัน)
 */
function getUserIdByEmail(email) {
    if (!fs.existsSync(userFilePath)) {
        console.warn(`Warning: user.json not found. Cannot map email to ID.`);
        return null;
    }
    try {
        const data = fs.readFileSync(userFilePath, "utf-8");
        const users = JSON.parse(data);
        const user = users.find(u => u.email === email);
        return user ? user.id : null;
    } catch (e) {
        console.error("Error reading user.json in getUserIdByEmail:", e);
        return null;
    }
}

/**
 * (Helper 2) อ่านไฟล์ข้อมูล User (เช่น 123.json)
 * (Logic นี้ถูกใช้ซ้ำๆ ใน addOrder, removeOrder)
 */
function readUserFile(id) {
    const filePath = path.join(usersDirectory, `${id}.json`);
    if (!fs.existsSync(filePath)) {
        console.warn(`User file not found: ${id}.json`);
        return null;
    }
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        // ไฟล์ user ของคุณเก็บข้อมูลใน Array [ { ... } ]
        return JSON.parse(data); 
    } catch (e) {
         console.error(`Error reading ${id}.json:`, e);
         return null;
    }
}

/**
 * (Helper 3) เขียนไฟล์ข้อมูล User (เช่น 123.json)
 */
function writeUserFile(id, data) {
    try {
        const filePath = path.join(usersDirectory, `${id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        console.error(`Error writing ${id}.json:`, e);
        return false;
    }
}

// ‼️ --- END: NEW HELPER FUNCTIONS --- ‼️


// (ฟังก์ชัน login, register, changePass เหมือนเดิม)
// ... (ผมขอย่อส่วนนี้นะครับ ให้ใช้โค้ดเดิมของคุณได้เลย)
function login(req, res) { 
    /* ... โค้ด login เดิมของคุณ ... */
}
function register(req, res) { 
    /* ... โค้ด register เดิมของคุณ ... */
}
function changePass(req, res) { 
    /* ... โค้ด changePass เดิมของคุณ ... */
}


// ‼️ --- START: REFACTORED FUNCTIONS (ย้าย Logic มาที่นี่) --- ‼️

// (Refactored addOrder)
async function addOrder(req, res) {
    const { email, order } = req.body;
    const id = getUserIdByEmail(email); // ‼️ ใช้ Helper

    if (!id) {
        console.log('AddOrder IdNotFind error', { order });
        return res.status(400).json({ status: 'AddOrder IdNotFind error', order });
    }
    
    try {
        let userData = readUserFile(id); // ‼️ ใช้ Helper
        if (!userData) {
            console.log('AddOrder DontHaveFile error', { order });
            return res.status(400).json({ status: 'AddOrder DontHaveFile error', order });
        }
        
        userData[0].orders.push(order); //
        writeUserFile(id, userData); // ‼️ ใช้ Helper
        
        console.log('AddOrder successfully', { order });
        res.status(200).json({ status: 'AddOrder successfully', order });
    } catch (err) {
        console.error('Error in addOrder:', err);
        res.status(500).json({ status: 'Error processing request' });
    }
}

// (Refactored removeOrder)
async function removeOrder(req, res) {
    const { email, index } = req.body;
    const id = getUserIdByEmail(email); // ‼️ ใช้ Helper

    if (!id) {
        console.log('RemoveOrder IdNotFind error', { index });
        return res.status(400).json({ status: 'RemoveOrder IdNotFind error', index });
    }

    try {
        let userData = readUserFile(id); // ‼️ ใช้ Helper
        if (!userData || !userData[0].orders || !userData[0].orders[index]) {
            console.log('RemoveOrder DontHaveFile or Index error', { index });
            return res.status(400).json({ status: 'RemoveOrder DontHaveFile or Index error', index });
        }

        const removedOrder = userData[0].orders.splice(index, 1); //
        writeUserFile(id, userData); // ‼️ ใช้ Helper

        console.log('RemoveOrder successfully', { index });
        res.status(200).json({ status: 'RemoveOrder successfully', removedOrder });
    } catch (err) {
        console.error('Error in removeOrder:', err);
        res.status(500).json({ status: 'Error processing request' });
    }
}

// (Refactored addAddress)
async function addAddress(req, res) {
    const { email, address } = req.body;
    const id = getUserIdByEmail(email); // ‼️ ใช้ Helper

    if (!id) {
        console.log('addAddress IdNotFind error', { address });
        return res.status(400).json({ status: 'addAddress IdNotFind error', address });
    }

    try {
        let userData = readUserFile(id); // ‼️ ใช้ Helper
        if (!userData) {
            console.log('addAddress DontHaveFile error', { address });
            return res.status(400).json({ status: 'addAddress DontHaveFile error', address });
        }

        userData[0].address.push(address); //
        writeUserFile(id, userData); // ‼️ ใช้ Helper

        console.log('addAddress successfully', { address });
        res.status(200).json({ status: 'addAddress successfully', address });
    } catch (err) {
        console.error('Error in addAddress:', err);
        res.status(500).json({ status: 'Error processing request' });
    }
}

// (Refactored removeAddress)
async function removeAddress(req, res) {
    const { email, index } = req.body;
    const id = getUserIdByEmail(email); // ‼️ ใช้ Helper

    if (!id) {
        console.log('removeAddress IdNotFind error', { index });
        return res.status(400).json({ status: 'removeAddress IdNotFind error', index });
    }

    try {
        let userData = readUserFile(id); // ‼️ ใช้ Helper
        if (!userData || !userData[0].address || !userData[0].address[index]) {
            console.log('removeAddress DontHaveFile or Index error', { index });
            return res.status(400).json({ status: 'removeAddress DontHaveFile or Index error', index });
        }

        const removedAddress = userData[0].address.splice(index, 1); //
        writeUserFile(id, userData); // ‼️ ใช้ Helper

        console.log('removeAddress successfully', { index });
        res.status(200).json({ status: 'removeAddress successfully', removedAddress });
    } catch (err) {
        console.error('Error in removeAddress:', err);
        res.status(500).json({ status: 'Error processing request' });
    }
}

// ‼️ --- START: NEW GET FUNCTIONS (MOVED FROM ROUTER) --- ‼️

// (Logic จาก /getName)
function getName(req, res) {
    const { email } = req.query;
    if (!email) return res.status(400).json({ status: "Error: Email parameter is required." });

    const id = getUserIdByEmail(email);
    if (!id) return res.status(404).json({ status: "Error: User not found." });

    try {
        const userData = readUserFile(id);
        if (!userData) return res.status(404).json({ status: "Error: User data file not found." });
        
        res.json({ fname: userData[0].fname, lname: userData[0].lname });
    } catch (e) {
        console.error(`Error retrieving name for email: ${email}`, e);
        res.status(500).json({ status: "Error: Could not retrieve name." });
    }
}

// (Logic จาก /getProfile)
function getProfile(req, res) {
    const { email } = req.query;
    if (!email) return res.status(400).json({ status: "Error: Email parameter is required." });

    const id = getUserIdByEmail(email);
    if (!id) return res.status(404).json({ status: "Error: User not found." });

    try {
        const userData = readUserFile(id);
        if (!userData) return res.status(404).json({ status: "Error: User data file not found." });
        
        res.json(userData[0].profile);
    } catch (e) {
        console.error(`Error retrieving profile for email: ${email}`, e);
        res.status(500).json({ status: "Error: Could not retrieve profile." });
    }
}

// (Logic จาก /getOrder)
function getOrder(req, res) {
    const { email } = req.query;
    if (!email) return res.status(400).json({ status: "Error: Email parameter is required." });

    const id = getUserIdByEmail(email);
    if (!id) return res.status(404).json({ status: "Error: User not found." });

    try {
        const userData = readUserFile(id);
        if (!userData) return res.status(404).json({ status: "Error: User data file not found." });
        
        res.json(userData[0].orders);
    } catch (e) {
        console.error(`Error retrieving orders for email: ${email}`, e);
        res.status(500).json({ status: "Error: Could not retrieve orders." });
    }
}

// (Logic จาก /getAddress)
function getAddress(req, res) {
    const { email } = req.query;
    if (!email) return res.status(400).json({ status: "Error: Email parameter is required." });

    const id = getUserIdByEmail(email);
    if (!id) return res.status(404).json({ status: "Error: User not found." });

    try {
        const userData = readUserFile(id);
        if (!userData) return res.status(404).json({ status: "Error: User data file not found." });
        
        res.json(userData[0].address);
    } catch (e) {
        console.error(`Error retrieving addresses for email: ${email}`, e);
        res.status(500).json({ status: "Error: Could not retrieve addresses." });
    }
}

// ‼️ --- START: NEW ADMIN FUNCTIONS --- ‼️

/**
 * (Logic จาก /getOrderAll + แก้ไข Bug)
 * ดึง Order ทั้งหมดสำหรับหน้า Admin
 */
function getAllOrders(req, res) {
    let allOrders = [];
    let users = [];

    try {
        const data = fs.readFileSync(userFilePath, "utf-8");
        users = JSON.parse(data);

        // ‼️ แก้ไข Bug: เริ่ม loop ที่ 0 (ไม่ใช่ 1)
        for (let i = 0; i < users.length; i++) { 
            const user = users[i];
            
            // (แนะนำ: อาจจะข้าม user ที่เป็น admin)
            // if (user.email === 'admin@example.com') continue; 

            const id = user.id;
            if (!id) continue; // ข้าม user ที่ไม่มี id

            const userData = readUserFile(id);
            if (!userData || !userData[0] || !userData[0].orders) continue; // ข้าม user ที่ไม่มีไฟล์/ไม่มี orders

            // (ปรับ Logic จากที่ผมแนะนำครั้งก่อน ให้เข้ากับโครงสร้างของคุณ)
            if (Array.isArray(userData[0].orders)) {
                 userData[0].orders.forEach((orderGroup, index) => {
                    allOrders.push({
                        userEmail: user.email,
                        orderIndex: index, // Index ของ Order นี้ใน Array ของ User
                        items: orderGroup, // [ {item: 'Name', size: 'M', amount: 1}, ... ]
                        name: userData[0].fname + ' ' + userData[0].lname, //
                        address: userData[0].address //
                    });
                });
            }
        }
        res.json(allOrders);
    } catch (e) {
        console.error(`Error retrieving all orders`, e);
        res.status(500).json({ status: "Error: Could not retrieve all orders." });
    }
}

/**
 * ลบ Order (สำหรับ Admin)
 */
function removeAdminOrder(req, res) {
    const { email, orderIndex } = req.body; //

    if (!email || orderIndex === undefined || orderIndex === null) {
        return res.status(400).json({ status: 'Email and orderIndex are required' });
    }
    
    const id = getUserIdByEmail(email);
    if (!id) {
        return res.status(404).json({ status: 'User not found' });
    }

    try {
        let userData = readUserFile(id);
        
        // ตรวจสอบว่ามี Order และ Index ถูกต้อง
        if (!userData || !userData[0].orders || !userData[0].orders[orderIndex]) {
             return res.status(404).json({ status: 'Order not found at that index' });
        }

        // ลบ Order ออกจาก Array
        const removedOrder = userData[0].orders.splice(orderIndex, 1);
        
        // บันทึกไฟล์
        writeUserFile(id, userData);

        console.log(`Admin removed order (Index: ${orderIndex}) for user ${email}`);
        res.status(200).json({ status: 'Order removed successfully', removedOrder });

    } catch (e) {
        console.error("Error removing admin order:", e);
        res.status(500).json({ status: "Error processing request" });
    }
}

// ‼️ --- END: NEW ADMIN FUNCTIONS --- ‼️


// ‼️ --- อัปเดต Exports --- ‼️
module.exports = {
    login,
    register,
    changePass,
    addOrder,
    removeOrder,
    addAddress,
    removeAddress,
    
    // (ฟังก์ชันใหม่ที่ย้ายมา)
    getName,
    getProfile,
    getOrder,
    getAddress,

    // (ฟังก์ชัน Admin ใหม่)
    getAllOrders,
    removeAdminOrder
};