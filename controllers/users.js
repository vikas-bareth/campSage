const User = require('../models/user');

module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

module.exports.renderLogin = (req,res) => {
    res.render('users/login')
}

module.exports.registerUser = async (req,res) => {
    try{
        const {username, email,password} = req.body
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,err => {
            if(err) next(err);
            req.flash('success','Welcome to CampSage!');
            res.redirect('/campgrounds')
        })
    } catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
}

module.exports.loginUser = (req,res) => {
    //we use res.locals.returnTo here instead of req.session.returnTo
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    req.flash('success','Welcome Back!');
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err) => {
        if(err) {
            return next(err)
        }
        req.flash('success','Goodbye!');
        res.redirect('/campgrounds')
    })
}