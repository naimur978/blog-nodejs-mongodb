const loggedInOnly = (req, res, next) => {
    if (req.isAuthenticated()) { next(); }
    else {
        //save the requested page and then redirected
        req.session.pageAfterLogin = req.url;
        req.flash("error", "You must be logged in first!");
        res.redirect("/login");
    }
};

const loggedOutOnly = (req, res, next) => {
    if (req.isUnauthenticated()) next();
    else res.redirect("/");
};

module.exports = {
    loggedInOnly,
    loggedOutOnly
};
