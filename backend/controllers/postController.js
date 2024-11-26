const PostModel = require('../models/Posts'); 
const LikeModel = require('../models/Likes'); 
const DislikeModel = require('../models/Dislikes'); 
const CommentModel = require('../models/Comments');
const UserModel = require('../models/Users');
const FollowingModel = require('../models/Following');
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
        
        const updatePost = await UserModel.findOneAndUpdate(
            { username: req.session.username },
            { $addToSet: { posts: savedPost._id } },
            { new: true } // To return the updated document
          );
        console.log("Update post",updatePost);
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
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // ensure post even exists here
        const entry = await LikeModel.findOne({ postId }); 
        // console.log("entry:  ",entry);   
        if (!entry) {
            //console.log("!entry:  ",entry);  
            return res.status(200).json({ message: 'Post does not contain likes' });
        } else {
            //console.log("else entry:  ",entry);  
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
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
            
        }
        const entry = await DislikeModel.findOne({ postId });        
        if (!entry) { 
            //console.log("post does not contain dislikes-entry:  ",entry);  
            return res.status(200).json({ message: 'Post does not contain dislikes' });
        }
        //console.log(" post contains dislikes:  ",entry);  
        res.status(200).json(entry.accounts_that_disliked);
        
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


// Add a comment to a post
exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const { username, text} = req.body; 

    try {
        // Check if the post exists
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create a new comment
        const newComment = new CommentModel({
            author: username,
            datetime: new Date(),
            text: text,
            likes: [],
            dislikes: [],
            replies: [],
            parentIsPost: true,
            postId: postId,
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
        const post = await PostModel.findById(postId).populate('comments'); // use postId to find
        if (!post.comments) {
            return res.status(404).json({ message: 'Post not found' })
        }
        
        //console.log(post);
        console.log(post.comments);
        res.status(200).json(post.comments);
    } catch (err) {
        next(err);
    }
  
};
exports.createRepost = async (req, res) => {
    const { post } = req.body;
    
    try {
        
        const childPost = await PostModel.findById(post._id)
        console.log(childPost);
        const newPost = new PostModel({
            author: req.session.username, //username
            datetime: new Date(),
            comments: [],
            likes: [],
            dislikes: [],
            repost: childPost._id
        });
        const savedPost = await newPost.save();
        const populatedRepost = await PostModel.findById(savedPost._id)
            .populate({
                path: 'repost',
                select: 'text author media datetime', 
            });
        // const repost = await PostModel.findById(newPost._id).select('reposts').populate('posts');
        // }).populate({ path:'repost', populate: { path: 'posts', select: 'text author media datetime',}
        //  });
        const savedRepost = await populatedRepost.save();
        const updatePost = await UserModel.findOneAndUpdate(
            { username: req.session.username },
            { $addToSet: { posts: savedPost._id } },
            { new: true } // To return the updated document
          );
       
        //console.log("saved repost",savedRepost);
        res.status(201).json(savedRepost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating repost'})
    }
};

exports.getChildPost = async (req, res) => {
    
    const { childPostId } = req.params;
    //console.log("childPostId",childPostId);
    try {
        const post = await PostModel.findById(childPostId).populate({
            path: 'repost',
            select: 'text author media datetime', 
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }
        const childPost = post
        //console.log("saved post",childPost);
        res.status(200).json(childPost);
    } catch (err) {
        next(err);
    }
  
};


exports.getFeedPosts = async (req, res) => {
    const { loggedInUsername } = req.params;
    
    try {
        
        console.log("feed user ",loggedInUsername);
        // currently logged-in user's own posts
        const loggedInUser = await UserModel.findOne({ username: loggedInUsername }).select('posts');
        if (!loggedInUser) {
            return res.status(404).json({ message: 'Logged-in user not found' });
        }
        //const user = await FollowingModel.findOne({loggedInUsername}).populate('accounts_followed');
        const user = await FollowingModel.findOne({username: loggedInUsername}).populate('accounts_followed');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // extracts the post_ids from all the users in user.accounts_followed
        const postIds = user.accounts_followed.flatMap(account => account.posts);
        const userPostIds = loggedInUser.posts;

        const allPostIds = [...postIds, ...userPostIds];
        //console.log("All post IDs (including logged-in user's):", allPostIds);
        // const posts = await PostModel.find({ author: { $in: user.accounts_followed.username } })
        //     .sort({ datetime: -1 }); 
        const posts = await PostModel.find({ _id: { $in: allPostIds } }).sort({ datetime: -1 });
        console.log("posts ", posts);


        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching feed posts:', error);
        res.status(500).json({ message: 'Error fetching feed posts' });
    }
};


exports.getPost = async(req, res, next) => {
    const { PostId } = req.params;

    try {
        const post = await PostModel.findById(PostId);
        console.log(post);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        res.status(200).json(post)
    } catch (err) {
        next(err);
    }
}