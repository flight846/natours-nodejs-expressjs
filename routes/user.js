const express = require('express');
const userController = require('./../controllers/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// All routes after this point requires login
router.use(authController.protectedRoute);
router.patch( '/updatePassword', authController.updatePassword );
router.get(
    '/profile', 
    userController.getMyId,
    userController.getProfile
);

router.patch('/updateProfile', userController.uploadUserPhoto, userController.updateProfile);
router.delete('/deleteProfile', userController.deleteProfile);

// All routes after this point requires admin permission
router.use(authController.restrictTo('admin'))

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;