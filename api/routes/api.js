const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const { loggedInOnly } = require('../middleware/auth');

// Posts routes
router.get('/posts', loggedInOnly, postController.getPostsJson);
router.post('/posts', loggedInOnly, postController.createPostJson);
router.get('/posts/:id', loggedInOnly, postController.getPostDetailsJson);
router.put('/posts/:id', loggedInOnly, postController.updatePostJson);
router.delete('/posts/:id', loggedInOnly, postController.deletePost);

// Comment routes
router.post('/posts/:postId/comments', loggedInOnly, commentController.createComment);
router.put('/comments/:id', loggedInOnly, commentController.updateComment);
router.delete('/comments/:id', loggedInOnly, commentController.deleteComment);

// Profile routes
router.get('/profile', loggedInOnly, (req, res) => {
    res.json({
        email: req.user.email,
        username: req.user.username,
        profile: req.user.profile || {}
    });
});

router.put('/profile', loggedInOnly, async (req, res) => {
    try {
        const updateData = {
            username: req.body.username,
            profile: req.body.profile
        };

        // Only include password if it was provided
        if (req.body.password) {
            updateData.password = req.body.password;
        }

        const user = await User.findById(req.user._id);
        Object.assign(user, updateData);
        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                email: user.email,
                username: user.username,
                profile: user.profile
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

module.exports = router;
