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
    getBlockedByUsername,
    newBlocked,
    newFollowers,
    newFollowing
 } = require('../controllers/userController');

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

// this section's methods may merge with other methods
router.post('/newFollowers', newFollowers); // Route to create a new followers object
router.post('/newFollowing', newFollowing); // Route to create a new following object
router.post('/newBlocked', newBlocked); // Route to create a new blocked object

module.exports = router;