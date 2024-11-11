const CommentModel = require('../models/Comments');
const LikeModel = require('../models/Likes'); 
const DislikeModel = require('../models/Dislikes'); 
// Add a reply to an existing comment
exports.addComment = async (req, res) => {
    const { commentId } = req.params; 
    const { author, text, PostId } = req.body; 

    try {

        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Create a new reply as a comment
        const newReply = new CommentModel({
            author: author,
            datetime: new Date(),
            text: text,
            likes: [], 
            dislikes: [], 
            replies: [], 
            parentIsPost: true,
            parentID: PostId,
        });

        // Save the reply to the database
        await newReply.save();

        // Push the reply ID into the original comment's replies array
        comment.replies.push(newReply._id);
        await comment.save();

        res.status(201).json({ message: 'Reply added successfully', reply: newReply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding reply' });
    }
};

// Get all replies for a specific comment
exports.getComments = async (req, res) => {
    const { commentId } = req.params; 

    try {
        
        const comment = await CommentModel.findById(commentId).populate('replies'); 
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        
        res.status(200).json(comment.replies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching replies' });
    }
};

// Add a like to a comment
exports.addLike = async (req, res) => {
    const { commentId } = req.params; 
    const { userId } = req.body; 

    try {
        // Check if the comment exists
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user already liked the comment
        const likeEntry = await LikeModel.findOne({ comment: commentId });
        if (likeEntry && likeEntry.accounts_that_liked.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this comment' });
        }

        // Add userId to the likes
        if (!likeEntry) {
            await LikeModel.create({ comment: commentId, accounts_that_liked: [userId] });
        } else {
            likeEntry.accounts_that_liked.push(userId);
            await likeEntry.save();
        }

        res.status(200).json({ message: 'Comment liked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error liking comment' });
    }
};

// Add a dislike to a comment
exports.addDislike = async (req, res) => {
    const { commentId } = req.params; 
    const { userId } = req.body; 

    try {
        // Check if the comment exists
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user already disliked the comment
        const dislikeEntry = await DislikeModel.findOne({ comment: commentId });
        if (dislikeEntry && dislikeEntry.accounts_that_disliked.includes(userId)) {
            return res.status(400).json({ message: 'You have already disliked this comment' });
        }

        // Add userId to the dislikes
        if (!dislikeEntry) {
            await DislikeModel.create({ comment: commentId, accounts_that_disliked: [userId] });
        } else {
            dislikeEntry.accounts_that_disliked.push(userId);
            await dislikeEntry.save();
        }

        res.status(200).json({ message: 'Comment disliked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error disliking comment' });
    }
};