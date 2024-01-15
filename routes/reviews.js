const express = require('express');
const router = express.Router({ mergeParams: true });

const { joiReviewSchema } = require('../schemas');
const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');



const validateReview = (req,res,next) => {
    const {error} = joiReviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new Error(msg,400)
    } else{
        next();
    }
}



router.post('/',validateReview,catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.reviews);
    campground.reviews.push(review);
    await review.save()
    await campground.save()
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId',async(req,res) => {
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
})


module.exports = router;