const User = require('../models/user');
const keys = require('../config/keys');
const mailer = require('../mailer/nodemailer');
const crypto = require("crypto");
const async = require('async');

const authController = {
    login: (req, res) => {
        res.render("login", {layout: 'pre_signin'});
    },

    logout: (req, res, next) => {
        req.logout(function(err) {
            if (err) { return next(err); }
            req.session.destroy();
            res.redirect("/login");
        });
    },

    register: (req, res) => {
        res.render("register", {layout: 'pre_signin'});
    },

    registerHandler: (req, res, next) => {
        User.create(req.body)
        .then(user => {
            let regMailOptions = keys.addKeyValue(keys.regMailOptions, 'to', user.email)

            let disableMailSending = keys.disableMailSending;
                
            if(disableMailSending && disableMailSending == "no") {
                mailer.sendMail(regMailOptions, function(err, info) {
                    if (err) console.log(err);
                });
            }
            else {
                console.warn('Email sending is disbaled!');
            }
            req.login(user, err => {
                if (err) { next(err); }
                else {
                    req.flash('success', 'Congrats! Your registration has been successful.');
                    res.redirect("/");
                }
            });
        })
        .catch(err => {
            console.error(err.stack);
            if (err.name === "ValidationError") {
                req.flash("error", "Sorry, that username is already taken.");
                res.redirect("/register");
            } else next(err);
        });
    },

    forgot: (req, res) => {
        res.render("forgot", {layout: 'pre_signin'});
    },

    forgotHandler: (req, res, next) => {
        async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                User.findOne({ email: req.body.email }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/forgot');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + keys.passwordExpirationTimeInMills;

                    user.save(function(err) {
                        done(err, token, user);
                    });
                });
            },
            function(token, user, done) {
                let mailOptions = keys.addKeyValue(keys.forgotMailOptions, 'to', user.email)
                let replaceHostAndToken = mailOptions['text'].replace('<host>', req.headers.host).replace('<token>', token);
                let disableEmailSending = keys.disableEmailSending;
                
                if(disableEmailSending && disableEmailSending == "no") {
                    mailOptions['text'] = replaceHostAndToken
                    mailer.sendMail(mailOptions, function(err, info) {
                        if(info)
                            req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                        done(err, info);
                    });
                }
                else {
                    done(`Email sending is disabled`, null);
                }
            }
        ],
        function(err, info) {
            if (err) 
                req.flash('error', "Something wrong happened, probably Email sending is disabled.");
            else 
                console.log(info);    
            res.redirect('/forgot');
        });
    },

    reset: (req, res) => {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', { 
                layout: 'pre_signin',
                token: req.params.token 
            });
        });
    },

    resetHandler: (req, res, next) => {
        async.waterfall([
            function(done) {
                User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        done(err, user);
                    });
                });
            },
            function(user, done) {
                let mailOptions = keys.addKeyValue(keys.resetMailOptions, 'to', user.email)
                replaceEmail = mailOptions['text'].replace('<email>', user.email);
                let disableMailSending = keys.disableMailSending;
                
                if(disableMailSending && disableMailSending == "no") {
                    mailOptions['text'] = replaceEmail
                    mailer.sendMail(mailOptions, function(err, info) {
                        req.flash('success', 'Success! Your password has been changed.');
                        done(err, info);
                    });
                }
                else {
                    console.warn("Email sending is disabled, Success! Your password has been changed.");
                }
            }
        ],
        function(err, info) {
            if (err) return next(err);
            res.redirect('/login');
        });
    }
};

module.exports = authController;
