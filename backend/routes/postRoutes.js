const express = require('express');
const { createPost, deletePost, getPostLikes, getPostDislikes, addLike, addDislike, addComment, createMedia} = require('../controllers/postController');

const router = express.Router();

// Route to create a post
router.post('/createPost', createPost);

router.post('/createMedia', createMedia);

// Route to delete a post
router.delete('/deletePost/:postId', deletePost);

// Route to get likes for a post
router.get('/getPostLikes/:postId', getPostLikes);

// Route to get dislikes for a post
router.get('/getPostDislikes/:postId', getPostDislikes);

// Route to get dislikes for a post
router.get('/addLike/:postId', addLike);

// Route to get dislikes for a post
router.get('/addDislike/:postId', addDislike);

// Route to get dislikes for a post
router.get('/addComment/:postId', addComment);

module.exports = router;