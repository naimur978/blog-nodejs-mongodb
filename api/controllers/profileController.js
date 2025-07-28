const User = require('../models/user');
const Post = require('../models/post');

const profileController = {
    getProfile: (req, res, next) => {
        Post.find({ author: req.user.email })
            .sort({ createdAt: -1 })
            .exec()
            .then(posts => {
                res.render('profile', { userPosts: posts });
            })
            .catch(err => {
                console.error('Error fetching user posts:', err);
                res.render('profile', { error: 'Unable to fetch your posts' });
            });
    },

    updateProfile: (req, res, next) => {
        const newProfile = {
            username: req.body.username,
            profile: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                age: req.body.age,
                gender: req.body.gender,
                address: req.body.address,
                website: req.body.website
            }
        }
        User.findOne({username: req.body.username})
        .exec()
        .then(user => {
            if(user == null) {
                req.flash("error", "Sorry, can not change the username.");
                res.redirect("/profile");
            }
            else if(user && (req.user.username != user.username)) {
                req.flash("error", "Sorry, that username is already taken.");
                res.redirect("/profile");
            }
            else {
                user.username = newProfile.username,
                user.profile = newProfile.profile
                user.save()
                .then(user => { 
                    req.login(user, err => {
                        if (err) { next(err); }
                        else {
                            req.flash('success', 'Profile updated successfully!');
                            res.redirect("/");
                        }
                    });
                })
            }
        })
        .catch(err => {
            console.error(err.stack);
            if (err) {
                req.flash('error', "Something wrong happened while updating the user's profile!");
                res.redirect("/");
            } else { res.redirect("/"); }
        });
    }
};

module.exports = profileController;
