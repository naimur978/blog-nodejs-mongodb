const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'An error occurred during authentication'
            });
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: info.message || 'Invalid credentials'
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'An error occurred during login'
                });
            }
            return res.json({
                success: true,
                message: 'Login successful',
                user: {
                    email: user.email,
                    username: user.username
                }
            });
        });
    })(req, res, next);
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await User.create({ email, username, password });
        
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Registration successful but failed to log in'
                });
            }
            return res.status(201).json({
                success: true,
                message: 'Registration successful',
                user: {
                    email: user.email,
                    username: user.username
                }
            });
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email or username already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'An error occurred during registration',
            error: error.message
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'An error occurred during logout'
            });
        }
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    });
});

// Get current user
router.get('/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
    res.json({
        success: true,
        user: {
            email: req.user.email,
            username: req.user.username
        }
    });
});

module.exports = router;
