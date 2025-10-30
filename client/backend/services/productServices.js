import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productFilePath = path.join(__dirname, "..", "data", "product.json");
// --- START: PATH CHANGE ---
// เปลี่ยนโฟลเดอร์ปลายทางจาก 'uploads' เป็น 'temp_uploads'
const finalUploadDir = path.join(__dirname, '..', 'temp_uploads'); // Reference to final upload directory
// --- END: PATH CHANGE ---

// Helper function to clean up temporary uploaded files
// (ฟังก์ชันนี้จะไม่มีผลกับ addProduct/editProduct ที่ส่ง JSON
// แต่มันอาจจะมีประโยชน์กับส่วนอื่นของ Server ที่ใช้ Multer จริงๆ)
function cleanupTempFiles(files) {
    if (files && files.length > 0) {
        files.forEach(file => {
            const tempFilePath = file.path; // Multer provides the full path in file.path
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
                console.log(`Cleaned up temporary file: ${tempFilePath}`);
            }
        });
    }
}

// Helper function to delete files from the final upload directory
function deleteFinalFiles(filePaths) {
    if (filePaths && filePaths.length > 0) {
        filePaths.forEach(relativePath => {
            // --- START: PATH CHANGE ---
            // เปลี่ยน Path ที่ตรวจสอบจาก '/uploads/' เป็น '/temp_uploads/'
            if (relativePath.startsWith('/temp_uploads/')) {
            // --- END: PATH CHANGE ---
                const filename = path.basename(relativePath);
                const fullPath = path.join(finalUploadDir, filename);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    console.log(`Deleted old image: ${fullPath}`);
                }
            }
        });
    }
}

function addProduct(req, res) {
    // --- START: FIX for JSON Payload ---
    // รับ 'img' (ที่เป็น Array of strings) มาจาก req.body
    // ไม่ต้องใช้ req.files อีกต่อไป
    const { id, name, price, detail, type, size, onShop, img } = req.body;
    // const uploadedFiles = req.files; // <--- ลบออก
    // --- END: FIX for JSON Payload ---


    // --- START: FIX for 'onShop error' ---
    // Set default value for on_off to prevent 'undefined' error
    // Convert string 'true'/'false' to boolean, default to false if not provided
    let on_off = false; // Default value
    if (onShop === 'true' || onShop === true) {
        on_off = true;
    }
    // --- END: FIX for 'onShop error' ---

    const filePath = path.join(__dirname, "..", "data", "product.json");
    let products = [];

    // --- START: FIX for JSON Payload ---
    // ลบ Helper 'processUploadAndCreateProduct' ทิ้ง
    // เพราะเราไม่ได้ "ย้าย" ไฟล์อีกแล้ว เราแค่ "บันทึก" path ที่ได้มา

    const product = {
        id,
        name,
        img: img || [], // ใช้ 'img' array ที่รับมาจาก req.body (ถ้าไม่มีให้เป็น array ว่าง)
        price,
        detail,
        type,
        sizes: [{
            size: size,
            onShop: on_off // Use the sanitized boolean value
        }]
    };

    if (fs.existsSync(filePath)) {
        let dataProduct = fs.readFileSync(filePath, "utf-8");
        try {
            products = JSON.parse(dataProduct);
        } catch (e) {
            console.error("Error parsing product.json:", e);
            // (เราไม่ได้อัปโหลดไฟล์ เลยไม่ต้อง cleanupTempFiles)
            return res.status(500).json({ status: "Error reading product data." });
        }
        
        // Check for duplicate ID
        let findId = products.findIndex(p => p.id == id);
        if (findId !== -1) {
            console.log('AddProduct idsame error', { id });
            // (เราไม่ได้ย้ายไฟล์ เลยไม่ต้อง deleteFinalFiles)
            return res.status(400).json({ status: 'AddProduct idsame error', product });
        }

        products.push(product);
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
        console.log('AddProduct successfully', { id });
        return res.status(200).json({ status: 'AddProduct successfully', product });

    } else {
        // File doesn't exist, this is the first product.
        products.push(product);
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
        console.log('AddProduct successfully (new file)', { id });
        return res.status(200).json({ status: 'AddProduct successfully', product });
    }
    // --- END: FIX for JSON Payload ---
}


function editProduct(req, res) {
    // --- START: FIX for JSON Payload ---
    // รับ 'img' (ที่เป็น Array of strings) มาจาก req.body
    // ไม่ต้องใช้ req.files อีกต่อไป
    const { id, name, price, detail, type, img } = req.body;
    // const uploadedFiles = req.files; // <--- ลบออก
    // --- END: FIX for JSON Payload ---

    const filePath = path.join(__dirname, "..", "data", "product.json");
    let products = [];

    if (fs.existsSync(filePath)) {
        let dataProduct = fs.readFileSync(filePath, "utf-8");
        products = JSON.parse(dataProduct);
        let findId = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                findId = i;
                break;
            }
        }
        const oldProduct = products[findId];
        let newImgPaths = [];
        if (findId == -1) {
            console.log('EditProduct NotHaveId error', { id });
            // (ไม่ต้อง cleanupTempFiles)
            return res.status(400).json({ status: 'EditProduct NotHaveId error', oldProduct });
        } else {
            // --- START: FIX for JSON Payload ---
            // ลบ Case 1 (ที่เช็ค uploadedFiles) ทิ้ง
            // เพราะเราไม่ได้รับ 'req.files' อีกต่อไป

            // Case 2 (ที่เช็ค req.body.img) จะกลายเป็น Logic หลัก
            if (img) { // 'img' คือ array ที่ส่งมาจาก req.body
                // (โค้ดข้างในนี้เกือบถูกอยู่แล้ว)
                if (!Array.isArray(img)) {
                    if (typeof img === 'string') {
                        newImgPaths = [img];
                    } else {
                        console.log('EditProduct img format error: img must be an array or string of paths.', { id });
                        return res.status(400).json({ status: 'EditProduct img format error', product: { id } });
                    }
                } else {
                    newImgPaths = img;
                }
                // Compare old paths with new paths and delete old files that are no longer needed
                const oldPathsToDelete = oldProduct.img.filter(oldPath => !newImgPaths.includes(oldPath));
                deleteFinalFiles(oldPathsToDelete);

            } else {
                // Case 3: No img paths in req.body, keep old images
                newImgPaths = oldProduct.img;
            }
            // --- END: FIX for JSON Payload ---

            const updatedProduct = {
                id,
                name: name || oldProduct.name, // Keep old name if not provided
                img: newImgPaths,
                price: price || oldProduct.price,
                detail: detail || oldProduct.detail,
                type: type || oldProduct.type,
                sizes: oldProduct.sizes // Keep old sizes
            };

            products[findId] = updatedProduct;
            fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
            console.log('EditProduct successfully', { id });
            res.status(200).json({ status: 'EditProduct successfully', updatedProduct });
        }
    } else {
        console.log('EditProduct NotHaveFile error', { id });
        // (ไม่ต้อง cleanupTempFiles)
        res.status(400).json({ status: 'EditProduct NotHaveFile error' });
    }
}

function removeProduct(req, res) {
    const { id } = req.body;

    const filePath = path.join(__dirname, "..", "data", "product.json");
    let products = [];

    if (fs.existsSync(filePath)) {
        let dataProduct = fs.readFileSync(filePath, "utf-8");
        products = JSON.parse(dataProduct);
        let findId = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                findId = i;
                break;
            }
        }
        if (findId == -1) {
            console.log('RemoveProduct NotHaveId error', { id });
            res.status(400).json({ status: 'RemoveProduct NotHaveId error', id })
        } else {
            // ดึงข้อมูลสินค้าที่กำลังจะถูกลบ
            const removedProduct = products[findId];

            // ลบไฟล์รูปภาพที่เกี่ยวข้องออกไป
            if (removedProduct && Array.isArray(removedProduct.img)) {
                deleteFinalFiles(removedProduct.img);
            }

            // ลบข้อมูลสินค้าออกจาก Array
            const removedItems = products.splice(findId, 1);

            // บันทึกไฟล์ JSON ที่อัปเดตแล้ว
            fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
            console.log('RemoveProduct successfully', { id });
            res.status(200).json({ status: 'RemoveProduct successfully', removedItems })
        }
    } else {
        console.log('RemoveProduct NotHaveFile error', { id });
        res.status(400).json({ status: 'RemoveProduct NotHaveFile error', id })
    }
}

function sizeAdd(req, res) {
    const { id, size, onShop } = req.body;

    let on_off;
    if (onShop === 'true' || onShop === true) {
        on_off = true;
    } else if (onShop === 'false' || onShop === false) {
        on_off = false;
    } else {
        // Default value if onShop is undefined or invalid
        on_off = false; 
    }

    const productSize = {
        size: size,
        onShop: on_off
    };

    const filePath = path.join(__dirname, "..", "data", "product.json");
    let products = [];
    if (fs.existsSync(filePath)) {
        let dataProduct = fs.readFileSync(filePath, "utf-8");
        products = JSON.parse(dataProduct);
        let findId = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                findId = i;
                break;
            }
        }
        if (findId == -1) {
            console.log('AddSize NotHaveId error', { id });
            res.status(400).json({ status: 'AddSize NotHaveId error', id })
        } else {
            let sizeSame = -1;
            for (let i = 0; i < products[findId].sizes.length; i++) {
                if (products[findId].sizes[i].size == size) {
                    sizeSame = i;
                    break;
                }
            }
            
            if (sizeSame == -1) {
                // Add new size
                products[findId].sizes.push(productSize);
                fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
                console.log('AddSize successfully (new)', { id, size });
                res.status(200).json({ status: 'AddSize successfully (new)', productSize });
            } else {
                // Update existing size
                products[findId].sizes[sizeSame] = productSize;
                fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
                console.log('AddSize successfully (update)', { id, size });
                res.status(200).json({ status: 'AddSize successfully (update)', productSize });
            }

        }
    } else {
        console.log('AddSize NotHaveFile error', { id });
        res.status(400).json({ status: 'AddSize NotHaveFile error', id })
    }
}

function sizeRemove(req, res) {
    const { id, size } = req.body;

    const filePath = path.join(__dirname, "..", "data", "product.json");
    let products = [];
    if (fs.existsSync(filePath)) {
        let dataProduct = fs.readFileSync(filePath, "utf-8");
        products = JSON.parse(dataProduct);
        let findId = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                findId = i;
                break;
            }
        }
        if (findId == -1) {
            console.log('RemoveSize NotHaveId error', { id });
            res.status(400).json({ status: 'RemoveSize NotHaveId error', id })
        } else {
            let sizeSame = -1;
            for (let i = 0; i < products[findId].sizes.length; i++) {
                if (products[findId].sizes[i].size == size) {
                    sizeSame = i;
                    break;
                }
            }
            if (sizeSame == -1) {
                console.log('RemoveSize SizeNotFind error', { id });
                res.status(400).json({ status: 'RemoveSize SizeNotFind error', id, size })
            } else {
                
                const removedSizes = products[findId].sizes.splice(sizeSame, 1);
                fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
                console.log('RemoveSize successfully', { id, size });
                res.status(200).json({ status: 'RemoveSize successfully', removedSizes })
            }
        }
    } else {
        console.log('RemoveSize NotHaveFile error', { id });
        res.status(400).json({ status: 'RemoveSize NotHaveFile error', id })
    }
}

export const productService = {
    addProduct,
    editProduct,
    removeProduct,
    sizeAdd,
    sizeRemove
};

