const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');


router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',catchAsync(
    async (req,res) => {
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
))

router.get('/login',(req,res) => {
    res.render('users/login')
})

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res) => {
    //we use res.locals.returnTo here instead of req.session.returnTo
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    req.flash('success','Welcome Back!');
    res.redirect(redirectUrl);
})
router.get('/logout',(req,res,next)=>{
    req.logout((err) => {
        if(err) {
            return next(err)
        }
        req.flash('success','Goodbye!');
        res.redirect('/campgrounds')
    })
})

module.exports = router