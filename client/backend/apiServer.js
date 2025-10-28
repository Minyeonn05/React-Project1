import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure the 'uploads' directory exists
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir); // Files will be saved in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        // Use the original file name with a timestamp to avoid conflicts
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Use bodyParser for JSON parsing (for non-file data)
app.use(bodyParser.json());
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

import cartsRouter from './routes/carts.js';
import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';

app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})
