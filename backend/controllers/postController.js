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
            likes: [],
            dislikes: [],
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
        const entry = await LikeModel.findOne({ postId });        
        if (!entry) {
            res.status(500).json({ message: 'Post does not exist' });
        } else {
            res.status(200).json(entry.accounts_that_liked);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching likes for post' });
    }
};

// Get dislikes for a post by ID
exports.getPostDislikes = async (req, res) => {
    const { postId } = req.params;

    try {
        const entry = await DislikeModel.findOne({ postId });        
        if (!entry) {
            res.status(500).json({ message: 'Post does not exist' });
        } else {
            res.status(200).json(entry.accounts_that_disliked);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching dislikes for post' });
    }
};

exports.addLike = async (req, res) => {
    const { postId } = req.params;
    const { username } = req.body; 

    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user already liked the post
        const entry = await LikeModel.findOne({ postId });        
        if (!entry) {
            await LikeModel.create({ postId, accounts_that_liked: [username] });
        } else {
            if (entry.accounts_that_liked.includes(username)) {
                entry.accounts_that_liked.splice(entry.accounts_that_liked.indexOf(username),1);
            }
            else {
                entry.accounts_that_liked.push(username);
            }
            await entry.save();
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
    const { username } = req.body; 

    try {
        
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user already disliked the post
        const entry = await DislikeModel.findOne({ postId });        
        if (!entry) {
            await DislikeModel.create({ postId, accounts_that_disliked: [username] });
        } else {
            if (entry.accounts_that_disliked.includes(username)) {
                entry.accounts_that_disliked.splice(entry.accounts_that_disliked.indexOf(username),1);
            }
            else {
                entry.accounts_that_disliked.push(username);
            }
            await entry.save();
        }

        res.status(200).json({ message: 'Post disliked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error disliking post' });
    }
};

// functions used to create like and dislike models associated with posts and comments
exports.newLikes = async(req, res, next) => {
  
    try {
      const newLiked = new LikeModel({
        accounts_that_liked: []
      })
  
      await newLiked.save();
      res.status(201).json({ message: "Likes created successfully" });
  
    } catch (err) {
      next(err);  
    }
  }

exports.newDislikes = async(req, res, next) => {
  
    try {
      const newDisliked = new DislikeModel({
        accounts_that_disliked: []
      })
  
      await newDisliked.save();
      res.status(201).json({ message: "Dislikes created successfully" });
  
    } catch (err) {
      next(err);  
    }
}

// Add a comment to a post
exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const { username, text, PostId } = req.body; 

    try {
        // Check if the post exists
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newLikes = new LikeModel();
        const newDislikes = new DislikeModel();

        // Save the new models to get their IDs
        await newLikes.save();
        await newDislikes.save();

        // Create a new comment
        const newComment = new CommentModel({
            author: username,
            datetime: new Date(),
            text: text,
            likes: newLikes._id, 
            dislikes: newDislikes._id, 
            replies: [],
            parentIsPost: true,
            postId: PostId,
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

// gets comments of the post by ID
// not sure if this works havent tested yet
exports.getPostComments = async (req, res, next) => {
    const { postId } = req.params;

    try {
        const post = await PostModel.findById(postId).populate('comments') // use postId to find
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        const comments = post.comments
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
  
};