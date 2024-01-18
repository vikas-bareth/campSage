const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor, validateCampground} = require('../middleware');
// const ExpressError = require('../utils/ExpressError');
const {index, renderNewFrom, createCampground, showCampground, editCampground, renderEditForm, updateCampground, deleteCampground} = require('../controllers/campgrounds')

router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn,validateCampground, catchAsync(createCampground))

router.get('/new',isLoggedIn,renderNewFrom )

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn,isAuthor,validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isAuthor,catchAsync(deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(renderEditForm))

module.exports = router;