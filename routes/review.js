const express = require('express');
const reviewController = require('./../controllers/review');
const authController = require('../controllers/auth');

const router = express.Router({ mergeParams: true });

router.use(authController.protectedRoute);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'), 
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.restrictTo('admin', 'user'),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo('admin', 'user'),
        reviewController.deleteReview
    );

module.exports = router;