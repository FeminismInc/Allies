const express = require('express');
const { createPost, createRepost,getChildPost, getFeedPosts, deletePost, getPostComments, getPostLikes, getPostDislikes, addLike, addDislike, addComment, } = require('../controllers/postController');

const router = express.Router();

// Route to create a post
router.post('/createPost', createPost);

// Route to create a repost
router.post('/createRepost', createRepost);

router.get('/getChildPost/:childPostId', getChildPost);

router.get('/getFeedPosts/:loggedInUsername', getFeedPosts);



// Route to delete a post
router.delete('/deletePost/:postId', deletePost);

// route to get comments for a post
router.get('/getPostComments/:postId', getPostComments);

// Route to get likes for a post
router.get('/getPostLikes/:postId', getPostLikes);

// Route to get dislikes for a post
router.get('/getPostDislikes/:postId', getPostDislikes);

// Route to add likes for a post
router.post('/addLike/:postId', addLike);

// Route to add dislikes for a post
router.post('/addDislike/:postId', addDislike);

// Route to add comment for a post
router.post('/addComment/:postId', addComment);

module.exports = router;