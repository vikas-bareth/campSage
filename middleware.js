module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','you must be logged in')
        return res.redirect('/login')
    }
    next();
}


//passport.authenticate destroys session so we run this middleware to store the returnTo url into res.locals middleware
module.exports.storeReturnTo = (req,res,next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}