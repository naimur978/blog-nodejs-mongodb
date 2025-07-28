const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

// Posts routes
router.get('/posts', postController.getPostsJson);
router.post('/posts', postController.createPostJson);
router.get('/posts/:id', postController.getPostDetailsJson);
router.put('/posts/:id', postController.updatePostJson);
router.delete('/posts/:id', postController.deletePost);

// Comment routes
router.post('/posts/:postId/comments', commentController.createCommentJson);
router.put('/comments/:id', commentController.updateCommentJson);
router.delete('/comments/:id', commentController.deleteCommentJson);

module.exports = router;
