const express = require('express');
const viewsController = require('../controllers/views');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/profile', authController.protectedRoute, viewsController.getAccount);

router.post('/submit-user-data', authController.protectedRoute, viewsController.updateUserData);

module.exports = router;