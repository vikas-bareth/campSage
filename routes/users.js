const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const {registerUser, loginUser, logoutUser, renderRegister, renderLogin} = require('../controllers/users')

router.route('/login')
    .get(renderLogin)
    .post(storeReturnTo,
        passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),
        loginUser
        )

router.route('/register')
        .get(renderRegister)
        .post(catchAsync(registerUser))

router.get('/logout',logoutUser)

module.exports = router