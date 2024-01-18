const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const {createReview , deleteReview} = require('../controllers/reviews')

router.post('/',validateReview,isLoggedIn,catchAsync(createReview));
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, deleteReview);

module.exports = router;