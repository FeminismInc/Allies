const express = require('express');
const { createPost, deletePost, getPostComments, getPostLikes, getPostDislikes, addLike, addDislike, addComment, } = require('../controllers/postController');

const router = express.Router();

// Route to create a post
router.post('/createPost', createPost);

// Route to delete a post
router.delete('/deletePost/:postId', deletePost);

// route to get comments for a post
router.get('/getPostComments/:postId', getPostComments);

// Route to get likes for a post
router.get('/getPostLikes/:postId', getPostLikes);

// Route to get dislikes for a post
router.get('/getPostDislikes/:postId', getPostDislikes);

// Route to get dislikes for a post
router.get('/addLike/:postId', addLike);

// Route to get dislikes for a post
router.get('/addDislike/:postId', addDislike);

// Route to get dislikes for a post
router.post('/addComment/:postId', addComment);

module.exports = router;