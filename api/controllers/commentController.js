const Post = require('../models/post');
const Comment = require('../models/comment');

const commentController = {
    getComments: (req, res) => {
        Post.findById(req.params.id).populate('comments')
        .exec()
        .then(post => {
            res.render("comment", { post : post });
        })
        .catch(err => {
            console.error(err.stack);
            if (err) {
                req.flash('error', 'Something wrong happened while fetching comments!');
                res.redirect("/");
            } else next(err);
        });
    },

    createComment: async (req, res) => {
        try {
            if (!req.body.message || !req.body.email || !req.body.postId) {
                req.flash('error', 'Missing required fields');
                return res.redirect(`/post/${req.body.postId || ''}`);
            }
            
            const post = await Post.findById(req.body.postId);
            if (!post) {
                req.flash('error', 'Post not found!');
                return res.redirect("/");
            }
            
            const comment = new Comment({
                name: req.body.name || req.user.username,
                email: req.body.email,
                message: req.body.message
            });
            
            const savedComment = await comment.save();
            console.log('Comment saved successfully:', savedComment._id);
            
            post.comments.push(savedComment._id);
            await post.save();
            
            req.flash('success', 'Comment added successfully!');
            res.redirect(`/post/${req.body.postId}`);
            
        } catch (err) {
            console.error('Error processing comment:', err);
            req.flash('error', 'Something went wrong while adding your comment');
            res.redirect(`/post/${req.body.postId || ''}`);
        }
    }
};

module.exports = commentController;
