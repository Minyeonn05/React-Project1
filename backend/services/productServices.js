// backend/services/productServices.js

const fs = require('fs');
const path = require('path');

const productFilePath = path.join(__dirname, "..", "data", "product.json");

const finalUploadDir = path.join(__dirname, '..', 'uploads'); 

if (!fs.existsSync(finalUploadDir)) {
    fs.mkdirSync(finalUploadDir, { recursive: true });
    console.log(`Created directory: ${finalUploadDir}`);
}

function deleteFinalFiles(filePaths) {
    if (filePaths && filePaths.length > 0) {
        filePaths.forEach(relativePath => {
            if (relativePath.startsWith('/uploads/')) {
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

function getProducts(req, res) {
    const filePath = path.join(__dirname, "..", "data", "product.json");
    let products = [];
    if (fs.existsSync(filePath)) {
        let dataProduct = fs.readFileSync(filePath, "utf-8");
        try {
            products = dataProduct ? JSON.parse(dataProduct) : [];
            if (!Array.isArray(products)) {
                 products = [];
            }
        } catch (e) {
            products = [];
        }
    }
    res.status(200).json(products);
}


// --- REWRITE addProduct for Multer (ฉบับแก้ไข) ---
function addProduct(req, res) {
    const { name, price, description, category, onShop } = req.body;
    const uploadedFiles = req.files; 
    
    // ‼️ --- START: แก้ไข Logic --- ‼️
    // 1. ตั้งค่าเริ่มต้นให้ "เปิดขาย" (true)
    let on_off = true; 

    // 2. (ProductModal ไม่ได้ส่ง onShop มา ดังนั้นค่านี้จะเป็น undefined)
    // เราจะปิดการขาย (false) ก็ต่อเมื่อมีการส่ง 'false' มาอย่างชัดเจน
    if (onShop === 'false' || onShop === false) { 
        on_off = false; 
    }
    // (ถ้า onShop เป็น 'true' หรือ undefined มันก็จะเป็น true ตามค่าเริ่มต้น)
    // ‼️ --- END: แก้ไข Logic --- ‼️

    const filePath = path.join(__dirname, "..", "data", "product.json");
    let products = [];
    const newId = Date.now().toString();
    let imgPaths = []; 

    if (uploadedFiles && uploadedFiles.length > 0) {
        try {
            uploadedFiles.forEach(file => {
                const oldPath = file.path; 
                const newFilename = `${newId}-${file.originalname.replace(/\s+/g, '-')}`;
                const newPath = path.join(finalUploadDir, newFilename);
                
                fs.renameSync(oldPath, newPath); 
                imgPaths.push(`/uploads/${newFilename}`); 
            });
        } catch (error) {
            console.error("Error processing uploaded files:", error);
            deleteFinalFiles(imgPaths); 
            return res.status(500).json({ status: "Error saving uploaded files." });
        }
    }

    const product = {
        id: newId,
        name,
        img: imgPaths,
        price,
        detail: description, 
        type: category,     
        sizes: [{ //
            size: "M", 
            onShop: on_off // ‼️ (ค่านี้จะกลายเป็น true)
        }]
    };

    if (fs.existsSync(filePath)) {
        let dataProduct = fs.readFileSync(filePath, "utf-8");
        try {
            products = dataProduct ? JSON.parse(dataProduct) : [];
            if (!Array.isArray(products)) { products = []; }
        } catch (e) {
            products = []; 
        }
        
        let findId = products.findIndex(p => p.id == newId);
        if (findId !== -1) {
            console.log('AddProduct idsame error', { id: newId });
            deleteFinalFiles(imgPaths); 
            return res.status(400).json({ status: 'AddProduct idsame error', product });
        }

        products.push(product);
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
        console.log('AddProduct successfully', { id: newId });
        return res.status(200).json({ status: 'AddProduct successfully', product });

    } else {
        products.push(product);
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
        console.log('AddProduct successfully (new file)', { id: newId });
        return res.status(200).json({ status: 'AddProduct successfully', product });
    }
}


// --- REWRITE editProduct for Multer (ฉบับแก้ไขจากรอบที่แล้ว) ---
function editProduct(req, res) {
    const { id, name, price, description, category } = req.body;
    const uploadedFiles = req.files; 
    
    let existingImages = [];
    if (req.body.img) {
        if (Array.isArray(req.body.img)) {
            existingImages = req.body.img;
        } else {
            if (req.body.img) {
                existingImages = [req.body.img];
            }
        }
    }
    
    const filePath = path.join(__dirname, "..", "data", "product.json");
    let products = [];
    let newImgPaths = [...existingImages]; 
    let processedNewFiles = []; 

    if (fs.existsSync(filePath)) {
        let dataProduct = fs.readFileSync(filePath, "utf-8");
        try {
            products = dataProduct ? JSON.parse(dataProduct) : [];
            if (!Array.isArray(products)) {
                 return res.status(500).json({ status: 'product.json is corrupted'});
            }
        } catch (e) {
            return res.status(500).json({ status: 'Error parsing product.json'});
        }

        let findId = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                findId = i;
                break;
            }
        }
        
        if (findId == -1) {
            console.log('EditProduct NotHaveId error', { id });
            return res.status(400).json({ status: 'EditProduct NotHaveId error' });
        } 
        
        const oldProduct = products[findId];

        if (uploadedFiles && uploadedFiles.length > 0) {
            try {
                uploadedFiles.forEach(file => {
                    const oldPath = file.path; 
                    
                    // (เพิ่ม timestamp เพื่อแก้ปัญหา Cache)
                    const timestamp = Date.now();
                    const newFilename = `${id}-${timestamp}-${file.originalname.replace(/\s+/g, '-')}`; 

                    const newPath = path.join(finalUploadDir, newFilename);
                    fs.renameSync(oldPath, newPath); 
                    
                    const publicPath = `/uploads/${newFilename}`;
                    newImgPaths.push(publicPath); 
                    processedNewFiles.push(publicPath); 
                });
            } catch (error) {
                console.error("Error processing new files during edit:", error);
                deleteFinalFiles(processedNewFiles); 
                return res.status(500).json({ status: "Error saving new files." });
            }
        }
        
        const oldPathsToDelete = oldProduct.img.filter(oldPath => !newImgPaths.includes(oldPath));
        deleteFinalFiles(oldPathsToDelete);

        const updatedProduct = {
            id,
            name: name || oldProduct.name, 
            img: newImgPaths, 
            price: price || oldProduct.price,
            detail: description || oldProduct.detail, 
            type: category || oldProduct.type,       
            sizes: oldProduct.sizes 
        };

        products[findId] = updatedProduct;
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
        console.log('EditProduct successfully', { id });
        res.status(200).json({ status: 'EditProduct successfully', updatedProduct });
        
    } else {
        console.log('EditProduct NotHaveFile error', { id });
        res.status(400).json({ status: 'EditProduct NotHaveFile error' });
    }
}

// (ฟังก์ชัน removeProduct เหมือนเดิม)
function removeProduct(req, res) {
    const { id } = req.body;
    const filePath = path.join(__dirname, "..", "data", "product.json");
    let products = [];
    if (fs.existsSync(filePath)) {
        let dataProduct = fs.readFileSync(filePath, "utf-8");
        try {
            products = dataProduct ? JSON.parse(dataProduct) : [];
             if (!Array.isArray(products)) {
                 products = [];
            }
        } catch (e) {
            products = [];
        }

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
            const removedProduct = products[findId];
            if (removedProduct && Array.isArray(removedProduct.img)) {
                deleteFinalFiles(removedProduct.img);
            }
            const removedItems = products.splice(findId, 1);
            fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
            console.log('RemoveProduct successfully', { id });
            res.status(200).json({ status: 'RemoveProduct successfully', removedItems })
        }
    } else {
        console.log('RemoveProduct NotHaveFile error', { id });
        res.status(400).json({ status: 'RemoveProduct NotHaveFile error', id })
    }
}

// (ฟังก์ชัน sizeAdd เหมือนเดิม)
function sizeAdd(req, res) {
    const { id, size, onShop } = req.body;
    let on_off;
    if (onShop === 'true' || onShop === true) {
        on_off = true;
    } else if (onShop === 'false' || onShop === false) {
        on_off = false;
    } else {
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
        try {
            products = dataProduct ? JSON.parse(dataProduct) : [];
             if (!Array.isArray(products)) {
                 products = [];
            }
        } catch (e) {
            products = [];
        }
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
            if (!products[findId].sizes) {
                products[findId].sizes = [];
            }
            for (let i = 0; i < products[findId].sizes.length; i++) {
                if (products[findId].sizes[i].size == size) {
                    sizeSame = i;
                    break;
                }
            }
            if (sizeSame == -1) {
                products[findId].sizes.push(productSize);
                fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
                console.log('AddSize successfully (new)', { id, size });
                res.status(200).json({ status: 'AddSize successfully (new)', productSize });
            } else {
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

// (ฟังก์ชัน sizeRemove เหมือนเดิม)
function sizeRemove(req, res) {
    const { id, size } = req.body;
    const filePath = path.join(__dirname, "..", "data", "product.json");
    let products = [];
    if (fs.existsSync(filePath)) {
        let dataProduct = fs.readFileSync(filePath, "utf-8");
        try {
            products = dataProduct ? JSON.parse(dataProduct) : [];
             if (!Array.isArray(products)) {
                 products = [];
            }
        } catch (e) {
            products = [];
        }
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
            if (!products[findId].sizes) {
                 console.log('RemoveSize SizeNotFind error (no sizes array)', { id });
                return res.status(400).json({ status: 'RemoveSize SizeNotFind error (no sizes array)', id, size })
            }
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

module.exports = {
    getProducts, 
    addProduct,
    editProduct,
    removeProduct,
    sizeAdd,
    sizeRemove
};