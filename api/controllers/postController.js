const Post = require('../models/post');
const Comment = require('../models/comment');

const postController = {
    getAllPosts: (req, res, next) => {
        Post.find({}, function (err, posts) {
            if(err) { next(err); }
            else {
                res.render("index", { posts: posts });
            }
        });
    },

    getPostForm: (req, res) => {
        res.render('post');
    },

    createPost: (req, res, next) => {
        Post.create(req.body)
        .then(post => {
            req.flash('success', 'Blog Post posted successfully!');
            res.redirect("/");
        })
        .catch(err => {
            console.error(err.stack);
            if (err) {
                req.flash('error', 'Something wrong happened while creating the post!');
                res.redirect("/");
            } else next(err);
        });
    },

    getPostDetails: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
                .populate({
                    path: 'comments',
                    options: { sort: { 'createdAt': -1 } }
                })
                .exec();
                
            if (!post) { 
                req.flash('error', 'Post not found.');
                return res.redirect('/');
            }
            
            console.log(`Post "${post.title}" found with ${post.comments.length} comments`);
            
            res.render("post_detail", { 
                post: post,
                showCommentForm: true
            });
        } catch (err) {
            console.error('Error fetching post:', err);
            req.flash('error', 'Something went wrong while retrieving the post.');
            return res.redirect('/');
        }
    },

    getEditForm: (req, res) => {
        Post.findById(req.params.id)
            .exec()
            .then(post => {
                if (!post) {
                    req.flash('error', 'Post not found.');
                    return res.redirect('/');
                }
                if (post.author !== req.user.email) {
                    req.flash('error', 'You can only edit your own posts.');
                    return res.redirect('/');
                }
                res.render('edit_post', { post: post });
            })
            .catch(err => {
                console.error(err);
                req.flash('error', 'Something went wrong while fetching the post.');
                return res.redirect('/');
            });
    },

    updatePost: (req, res) => {
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            body: req.body.body,
            author: req.body.author
        };

        Post.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .exec()
        .then(post => {
            if (!post) {
                req.flash('error', 'Post not found.');
                return res.redirect('/');
            }
            req.flash('success', 'Post updated successfully!');
            res.redirect('/post/' + post._id);
        })
        .catch(err => {
            console.error(err);
            req.flash('error', 'Something went wrong while updating the post.');
            res.redirect('/post/' + req.params.id + '/edit');
        });
    },

    deletePost: async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({
                success: false,
                message: 'Please login to delete posts'
            });
        }

        try {
            const post = await Post.findById(req.params.id).exec();
            
            if (post.author !== req.user.email) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only delete your own posts'
                });
            }
            
            if (!post) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Post not found.' 
                });
            }

            if (post.comments && post.comments.length > 0) {
                await Comment.deleteMany({ _id: { $in: post.comments.map(c => c._id) } }).exec();
            }

            await post.deleteOne();

            return res.status(200).json({ 
                success: true, 
                message: 'Post and related comments deleted successfully!' 
            });
        } catch (err) {
            console.error('Error deleting post:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Something went wrong while deleting the post.' 
            });
        }
    }
};

module.exports = postController;
