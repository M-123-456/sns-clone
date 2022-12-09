import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import './config/config.js';
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import postsRoute from './routes/posts.js';
import uploadRoute from './routes/upload.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// Connect to database
mongoose
    .connect(process.env.MONGOURL)
    .then(() => {
        console.log('connected to database')
    }).catch((err) => {
        console.log(err);
    })

// Middleware
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use('/images', express.static(path.join(__dirname, "public/images")));

// app.use(express.static('public'));
app.use(cors(corsOptions));
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);
app.use('/api/upload', uploadRoute);


app.listen(process.env.PORT, () => console.log(`listening on port: ${process.env.PORT}`))