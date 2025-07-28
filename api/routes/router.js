const express = require("express");
const router = express.Router();
const { loggedInOnly, loggedOutOnly } = require('../middleware/auth');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const profileController = require('../controllers/profileController');

function authenticate(passport) {
    // Auth Routes
    router.get("/login", loggedOutOnly, authController.login);
    router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }));
    router.get("/logout", authController.logout);
    router.get("/register", loggedOutOnly, authController.register);
    router.post("/register", authController.registerHandler);
    router.get("/forgot", loggedOutOnly, authController.forgot);
    router.post("/forgot", authController.forgotHandler);
    router.get("/reset/:token", authController.reset);
    router.post("/reset", authController.resetHandler);

    // Post Routes
    router.get("/", loggedInOnly, postController.getAllPosts);
    router.get("/post", loggedInOnly, postController.getPostForm);
    router.post("/post", postController.createPost);
    router.get("/post/:id", loggedInOnly, postController.getPostDetails);
    router.get("/post/:id/edit", loggedInOnly, postController.getEditForm);
    router.post("/post/:id/edit", loggedInOnly, postController.updatePost);
    router.post("/post/:id/delete", loggedInOnly, postController.deletePost);

    // Comment Routes
    router.get("/post/:id/comments", loggedInOnly, commentController.getComments);
    router.post("/post/comments", loggedInOnly, commentController.createComment);

    // Profile Routes
    router.get("/profile", loggedInOnly, profileController.getProfile);
    router.post("/profile", loggedInOnly, profileController.updateProfile);

    return router;
}

module.exports = authenticate;
