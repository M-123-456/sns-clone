import express from 'express';

import User from '../models/User.js';

const router = express.Router();

// CRUD
// Update user information
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json('User is updated');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('You are allowed to change only the information of your account')
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json('User is deleted');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('You are allowed to delete only your account')
    }
});

// Get user information
// router.get('/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         const { password, email, updatedAt, isAdmin, ...other } = user._doc;
//         return res.status(200).json(other);
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// });

// get user info by query
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username.toLowerCase() });
        const { password, updatedAt, ...other } = user._doc;
        return res.status(200).json(other);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// Follow user
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            // If currentUser is not included in the followers of user, you can follow the user
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: {
                        followers: req.body.userId,
                    }
                });
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id,
                    }
                });
                return res.status(200).json('successflly followed')
            } else {
                return res.status(403).json('You are already following this user')
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json('You cannot follow yourself.')
    }
});

// Unfollow user
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            // If currentUser is not included in the followers of user, you can follow the user
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId,
                    }
                });
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id,
                    }
                });
                return res.status(200).json('successflly unfollowed')
            } else {
                return res.status(403).json('You already unfollowed this user')
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json('You cannot unfollow yourself.')
    }
})


export default router;