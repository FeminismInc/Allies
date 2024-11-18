const express = require('express');
const router = express.Router();
const {addComment, getComments, addLike, addDislike, getCommentLikes, getCommentDislikes} = require('../controllers/commentsController'); // Adjust the path as necessary

// Route to add a reply to an existing comment
router.post('/addComment/:commentId', addComment);

// Route to get all replies for a specific comment
router.get('/getComments/:commentId', getComments);

// Route to add a like to a comment
router.post('/addLike/:commentId', addLike);

// Route to add a dislike to a comment
router.post('/addDislike/:commentId', addDislike);

// Route to get likes for a comment
router.get('/getCommentLikes/:commentId', getCommentLikes);

// Route to get dislikes for a comment
router.get('/getCommentDislikes/:commentId', getCommentDislikes);

module.exports = router;