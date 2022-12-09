import express from 'express';
import multer from 'multer';

import User from '../models/User.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
})

const upload = multer({ storage });

// Upload file
router.post('/', upload.single('file'), (req, res) => {
    try {
        return res.status(200).json('Successfully uploaded the image');
    } catch (err) {
        console.log(err);
    }
})

export default router;