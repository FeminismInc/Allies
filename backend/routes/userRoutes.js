const express = require('express');

const { 
    findUserByEmail, 
    createUser,
    getFollowers,
    getFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    getPostsByUsername,
    getBlockedByUsername,
    newBlocked,
    newFollowers,
    newFollowing,
    findUser,
    getConversationsByUsername,
    getCurrentUserID,
    searchUsers,
    getBioByUsername,
    updateBioByUsername,
    updatePrivacyStatus,
    getPrivacyStatus,
    requestFollowing,
    acceptFollowing,
    followRequests,
    saveRequestFollowing,
    removeRequestFollowing,
    updateProfilePicture,
    getProfilePicture,
    getProfilePictureByUsername,
    getPrivacyStatusByUsername,
    getRequested,
    findUserById
 } = require('../controllers/userController');


const router = express.Router();

router.get('/findUser', findUser); // Route to get all users
router.get('/findUserById/:userid',findUserById);
router.post('/findUserbyEmail', findUserByEmail); // Route to find a user by email
router.post('/form', createUser); // Route to create a new user
router.get('/followers/:username', getFollowers); // Fetch followers of a user
router.get('/following/:username', getFollowing); // Fetch following of a user
router.post('/addFollower', addFollower); // Add follower (follow a user)
router.post('/removeFollowing', removeFollowing); // Unfollow a user  
router.post('/removeFollower', removeFollower); 
router.get('/getPosts/:username', getPostsByUsername);  // Fetch posts by username
router.get('/getBlocked/:username', getBlockedByUsername);  // Fetch blocked accounts by username     

// this section's methods may merge with other methods
router.post('/newFollowers', newFollowers); // Route to create a new followers object
router.post('/newFollowing', newFollowing); // Route to create a new following object
router.post('/newBlocked', newBlocked); // Route to create a new blocked object
router.get('/getConversations/:username',getConversationsByUsername );
router.get('/getCurrentUserID',getCurrentUserID);

router.post('/search', searchUsers);
router.get('/getBio/:username',getBioByUsername);
router.post('/updateBio',updateBioByUsername);

router.patch('/updatePrivacyStatus', updatePrivacyStatus);
router.get('/getPrivacyStatus/:username', getPrivacyStatusByUsername);
router.get('/getPrivacyStatus', getPrivacyStatus);

router.post('/sendFollowRequest', requestFollowing);
router.post('/saveFollowRequest',saveRequestFollowing);
router.post('/acceptFollowRequest', acceptFollowing);
router.post('/removeFollowRequest', removeRequestFollowing);
router.get('/followRequests/:username', followRequests); //sent ones
router.get('/getFollowRequests', getRequested);

router.post('/updateProfilePicture', updateProfilePicture);
router.get('/getProfilePicture', getProfilePicture);
router.get('/getProfilePicture/:username', getProfilePictureByUsername);

module.exports = router;

