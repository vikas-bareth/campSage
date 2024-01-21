const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor, validateCampground} = require('../middleware');
const {index, renderNewFrom, createCampground, showCampground, editCampground, renderEditForm, updateCampground, deleteCampground} = require('../controllers/campgrounds')

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.route('/')
    .get(catchAsync(index))
    // .post(isLoggedIn,validateCampground, catchAsync(createCampground))
    .post(upload.array('image'),(req,res) => {
        console.log(req.body);
        console.log("*******");
        console.log(req.files)
        res.send(req.body)
    })

router.get('/new',isLoggedIn,renderNewFrom )

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn,isAuthor,validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isAuthor,catchAsync(deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(renderEditForm))

module.exports = router;