const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor, validateCampground} = require('../middleware');
const {index, renderNewFrom, createCampground, showCampground, editCampground, renderEditForm, updateCampground, deleteCampground} = require('../controllers/campgrounds')
const {storage} = require('../cloudinary')
const multer  = require('multer')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn,upload.array('image'),validateCampground, catchAsync(createCampground))

router.get('/new',isLoggedIn,renderNewFrom )

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isAuthor,catchAsync(deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(renderEditForm))

module.exports = router;