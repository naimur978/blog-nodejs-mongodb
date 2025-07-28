const loggedInOnly = (req, res, next) => {
    if (req.isAuthenticated()) { 
        next(); 
    } else {
        // Check if it's an API request (starts with /api)
        if (req.path.startsWith('/api')) {
            res.status(401).json({
                success: false,
                message: "You must be logged in first!"
            });
        } else {
            //save the requested page and then redirect
            req.session.pageAfterLogin = req.url;
            req.flash("error", "You must be logged in first!");
            res.redirect("/login");
        }
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
