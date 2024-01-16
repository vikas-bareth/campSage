const Campground = require("./models/campground");
const Review = require('./models/review')
const { joiCampgroundSchema , joiReviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');


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

module.exports.isAuthor = async (req,res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permision to do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permision to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req,res,next) => {
    const {error } = joiCampgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new Error(msg,400)
    } else{
        next();
    }
}


module.exports.validateReview = (req,res,next) => {
    const {error} = joiReviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new Error(msg,400)
    } else{
        next();
    }
}

