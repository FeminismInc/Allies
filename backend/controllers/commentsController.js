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
        console.log("getComments - CommentModel.findById(commentId).populate('replies'); ", comment)
        if (!comment) {
            console.log("!comment");

            return res.status(404).json({ message: 'Comment not found' });
        }

        
        res.status(200).json(comment.replies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching replies' });
    }
};

// Get likes for a comment by ID
exports.getCommentLikes = async (req, res) => {
    const { commentId } = req.params;
    try {
        const comment = await CommentModel.findById(commentId);    
        if (!comment) {
            return res.status(404).json({ message: 'comment does not exist' });
        }    
        const entry = await LikeModel.findOne({ postId: commentId });   
        //console.log("get comment likes: ", entry)
        if (!entry) {
            //console.log("!get comment likes: ", entry)

            return res.status(200).json([]);
  
        }
        return res.status(200).json(entry.accounts_that_liked);
        // else {
        //     console.log("comment likes ",entry);
        //     res.status(200).json(entry);
        // }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching likes for comment' });
    }
};

// Get dislikes for a comment by ID
exports.getCommentDislikes = async (req, res) => {
    const { commentId } = req.params;


    try {
        // check if the comment even exists first 
        const comment = await CommentModel.findById(commentId);    
        //console.log("comment dislikes",comment);
        if (!comment) {
            return res.status(404).json({ message: 'comment does not exist' });
        }    
        const entry = await DislikeModel.findOne({ postId: commentId });  
        //console.log("entry: ",entry)  ;
        if (!entry) {
            return res.status(200).json([]);
            
        }
        return res.status(200).json(entry.accounts_that_disliked);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching dislikes for comment' });
    }
};

exports.addLike = async (req, res) => {
    const { commentId } = req.params;
    const { username } = req.body; 

    try {
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user already liked the comment
        const entry = await LikeModel.findOne({ postId: commentId });        
        if (!entry) {
            await LikeModel.create({ postId: commentId , accounts_that_liked: [username] });
        } else {
            if (entry.accounts_that_liked.includes(username)) {
                entry.accounts_that_liked.splice(entry.accounts_that_liked.indexOf(username),1);
            }
            else {
                entry.accounts_that_liked.push(username);
            }
            await entry.save();
        }
        res.status(200).json({ message: 'Comment liked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error liking comment' });
    }
};

// Add a dislike to a Comment
exports.addDislike = async (req, res) => {
    const { commentId } = req.params;
    const { username } = req.body; 

    try {
        
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user already disliked the comment
        const entry = await DislikeModel.findOne({ postId: commentId });        
        if (!entry) {
            await DislikeModel.create({ postId: commentId, accounts_that_disliked: [username] });
        } else {
            if (entry.accounts_that_disliked.includes(username)) {
                entry.accounts_that_disliked.splice(entry.accounts_that_disliked.indexOf(username),1);
            }
            else {
                entry.accounts_that_disliked.push(username);
            }
            await entry.save();
        }

        res.status(200).json({ message: 'comment disliked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error disliking comment' });
    }
};