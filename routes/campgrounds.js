const express = require('express');
const router = express.Router();

const { joiCampgroundSchema } = require('../schemas');
const Campground = require('../models/campground');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const {isLoggedIn} = require('../middleware');

const validateCampground = (req,res,next) => {
    const {error } = joiCampgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new Error(msg,400)
    } else{
        next();
    }
}


router.get('/',catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}))

router.get('/new',isLoggedIn, (req,res) =>{
    res.render('campgrounds/new')
})

router.post('/',isLoggedIn,validateCampground, catchAsync(async (req,res,next) => {
    const campground = new Campground(req.body.campgrounds)
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews')
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground,})
}))

router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground})
}))

router.put('/:id', isLoggedIn,validateCampground, catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body.campgrounds,{new:true});
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
   
}))

router.delete('/:id',isLoggedIn, catchAsync(async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}))



module.exports = router;