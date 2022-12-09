import express from 'express';
import bcrypt from 'bcrypt';

import User from '../models/User.js';

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body);

    try {
        // hash password and save user
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await new User({
            username: username,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();


        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send('User not found');

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).json('Wrong password');


        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
});

export default router;