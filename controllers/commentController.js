const Comment = require('../models/comment');
const Post = require('../models/post');

const commentController = {
    createCommentJson: async (req, res) => {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).json({
                    success: false,
                    message: 'Please login to comment'
                });
            }

            const post = await Post.findById(req.params.postId).exec();
            
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            const comment = await Comment.create({
                content: req.body.content,
                author: req.user.email,
                post: req.params.postId
            });

            // Add comment to post's comments array
            post.comments.push(comment._id);
            await post.save();

            return res.status(201).json({
                success: true,
                message: 'Comment added successfully',
                comment: comment
            });
        } catch (err) {
            console.error('Error creating comment:', err);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong while creating the comment',
                error: err.message
            });
        }
    },

    updateCommentJson: async (req, res) => {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).json({
                    success: false,
                    message: 'Please login to update comments'
                });
            }

            const comment = await Comment.findById(req.params.id).exec();
            
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }

            if (comment.author !== req.user.email) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only update your own comments'
                });
            }

            comment.content = req.body.content;
            await comment.save();

            return res.json({
                success: true,
                message: 'Comment updated successfully',
                comment: comment
            });
        } catch (err) {
            console.error('Error updating comment:', err);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong while updating the comment',
                error: err.message
            });
        }
    },

    deleteCommentJson: async (req, res) => {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).json({
                    success: false,
                    message: 'Please login to delete comments'
                });
            }

            const comment = await Comment.findById(req.params.id).exec();
            
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }

            if (comment.author !== req.user.email) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only delete your own comments'
                });
            }

            // Remove comment from post's comments array
            await Post.findByIdAndUpdate(comment.post, {
                $pull: { comments: comment._id }
            }).exec();

            await comment.deleteOne();

            return res.json({
                success: true,
                message: 'Comment deleted successfully'
            });
        } catch (err) {
            console.error('Error deleting comment:', err);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong while deleting the comment',
                error: err.message
            });
        }
    }
};

module.exports = commentController;
