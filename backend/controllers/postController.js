const PostModel = require('../models/Posts'); 
const LikeModel = require('../models/Likes'); 
const DislikeModel = require('../models/Dislikes'); 
const CommentModel = require('../models/Comments');

// Create a new post
exports.createPost = async (req, res) => {
    const { text, media, hashtags } = req.body;
    try {
        console.log("creating post for ",req.session.username );
        const newPost = new PostModel({
            text,
            author: req.session.username, //username
            media: media || [],
            hashtags: hashtags || [],
            datetime: new Date(),
            comments: [],
            likes: null,
            dislikes: null,
            repost: null
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating post' });
    }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
    const { postId } = req.params;
    const { username } = req.body; 

    try {
        
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        
        if (post.author !== username) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        
        await PostModel.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting post' });
    }
};

// Get likes for a post by ID
exports.getPostLikes = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await PostModel.findById(postId).populate('likes');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const likes = post.likes; 
        res.status(200).json(likes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching likes for post' });
    }
};

// Get dislikes for a post by ID
exports.getPostDislikes = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await PostModel.findById(postId).populate('dislikes');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const dislikes = post.dislikes; 
        res.status(200).json(dislikes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching dislikes for post' });
    }
};

// Add a like to a post
exports.addLike = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body; 

    try {
        
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user already liked the post
        const likeEntry = await LikeModel.findOne({ postId });
        if (likeEntry && likeEntry.accounts_that_liked.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        // Add userId to the likes
        if (!likeEntry) {
            await LikeModel.create({ postId, accounts_that_liked: [userId] });
        } else {
            likeEntry.accounts_that_liked.push(userId);
            await likeEntry.save();
        }

        res.status(200).json({ message: 'Post liked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error liking post' });
    }
};

// Add a dislike to a post
exports.addDislike = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body; 

    try {
        
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user already disliked the post
        const dislikeEntry = await DislikeModel.findOne({ postId });
        if (dislikeEntry && dislikeEntry.accounts_that_disliked.includes(userId)) {
            return res.status(400).json({ message: 'You have already disliked this post' });
        }

        // Add userId to the dislikes
        if (!dislikeEntry) {
            await DislikeModel.create({ postId, accounts_that_disliked: [userId] });
        } else {
            dislikeEntry.accounts_that_disliked.push(userId);
            await dislikeEntry.save();
        }

        res.status(200).json({ message: 'Post disliked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error disliking post' });
    }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const { authorId, text } = req.body; 

    try {
        // Check if the post exists
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create a new comment
        const newComment = new CommentModel({
            author: authorId,
            text: text,
            likes: [], 
            dislikes: [], 
            replies: [] 
        });

        // Save the comment to the database
        await newComment.save();

        // save comment in post
        post.comments.push(newComment._id);
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding comment' });
    }
};