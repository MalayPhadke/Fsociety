module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        if(!['/', '/favicon.ico'].includes(req.originalUrl)){
            req.session.returnTo = req.originalUrl;
        }
        req.flash('error', "You must be signed in");
        return res.redirect('/');
    }
    next();
}
