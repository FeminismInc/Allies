const express = require('express');

const { 
    getUsers, 
    findUserByEmail, 
    createUser,
    getFollowers,
    getFollowing,
    addFollower,
    removeFollowing,
    getPostsByUsername,
    getBlockedByUsername, } = require('../controllers/userController');

const router = express.Router();

router.get('/getUsers', getUsers); // Route to get all users
router.post('/findUserbyEmail', findUserByEmail); // Route to find a user by email
router.post('/form', createUser); // Route to create a new user
router.get('/followers/:username', getFollowers); // Fetch followers of a user
router.get('/following/:username', getFollowing); // Fetch following of a user
router.post('/addFollower', addFollower); // Add follower (follow a user)
router.post('/removeFollowing', removeFollowing); // Unfollow a user  
router.get('/getPosts/:username', getPostsByUsername);  // Fetch posts by username
router.get('/getBlocked/:username', getBlockedByUsername);  // Fetch blocked accounts by username            

module.exports = router;
