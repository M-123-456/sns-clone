import express from 'express';

import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// Create post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// Update post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (req.body.userId === post.userId) {
            await post.updateOne({
                $set: req.body,
            })
            return res.status(200).json('Successfully updated')
        } else {
            return res.status(403).json('You are allowed to edit only your posts.')
        }
    } catch (err) {
        res.status(403).json(err);
    }
});

// Delete post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (req.body.userId === post.userId) {
            await post.deleteOne();
            return res.status(200).json('Post deleted')
        } else {
            return res.status(403).json('You are allowed to delete only your posts.')
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

// Get post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// Get post by ID and like the post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // If you haven't liked the post yet, you can like the post
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                }
            })
            return res.status(200).json("You liked the post");
        } else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                }
            })
            return res.status(200).json("You disliked the post")
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

// Get timeline posts for profile
router.get('/profile/:username', async (req, res) => {
    const username = req.params.username.toLowerCase();
    try {
        const user = await User.findOne( {username: username} );
        const posts = await Post.find({ userId: user._id });
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// Get timeline posts
router.get('/timeline/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        // Get all posts of users you are following
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        return res.status(500).json(err);
    }
});


export default router;