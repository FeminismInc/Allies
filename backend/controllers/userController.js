const UserModel = require('../models/Users');
const FollowingModel = require('../models/Following');
const FollowersModel = require('../models/Followers');
const PostModel = require('../models/Posts');
const BlockedModel = require('../models/Blocked');
const ConversationModel = require('../models/Conversations');
const io = require('../node_modules/socket.io/client-dist/socket.io.js');

// Get all users
exports.findUser = async (req, res, next) => {
  try {
    const username = req.session.userId;

    if (!username) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Return the found user
  } catch (err) {
    next(err);
  }
};

// Find a user by email and password
exports.findUserByEmail = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' }); //email is not connected to any user
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Handle does not match' }); //password doesnt match email
    }

    req.session.userId = user.username; // saving username
    req.session.email = user.email; // saving email

    res.status(200).json({ exists: true }); //return true if login was successful
    // about to change res.status to return anything, another way to get info rather than sessions
  } catch (err) {
    next(err);
  }
};


exports.newFollowing = async(req, res, next) => { 
  const { username } = req.body;

  try {
    const newFollowing = new FollowingModel({
      username,
      accounts_followed: []
    })

    await newFollowing.save();
    res.status(201).json({ message: "Following created successfully" });

  } catch (err) {
    next(err);  
  }
}

exports.newFollowers = async(req, res, next) => {
  const { username } = req.body;

  try {
    const newFollowers = new BlockedModel({
      username,
      follower_accounts: []
    })

    await newFollowers.save();
    res.status(201).json({ message: "Followers created successfully" });

  } catch (err) {
    next(err);  
  }
}

exports.newBlocked = async(req, res, next) => {
  const { username } = req.body;

  try {
    const newBlocked = new BlockedModel({
      username,
      blocked_accounts: []
    })

    await newBlocked.save();
    res.status(201).json({ message: "Blocked created successfully" });

  } catch (err) {
    next(err);  
  }
}

// Create a new user
exports.createUser = async (req, res, next) => {
  const { birthdate, username, email, password, handle, pronouns } = req.body;

  try {
    const following = await FollowingModel.findOne({username : username});
    const followers = await FollowersModel.findOne({username : username});
    const blocked = await BlockedModel.findOne({username : username});

    const newUser = new UserModel({
      birthdate,
      username,
      email,
      password,  
      handle,
      pronouns,
      bio: "",
      public_boolean: true,
      joined: new Date(),
      posts: [],
      tagged_media: [],
      conversations: [],
      blocked: blocked._id,
      followers: followers._id,
      following: following._id
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);  
  }
};

// Get followers of a user
exports.getFollowers = async (req, res, next) => {
    const { username } = req.params; 
  
    try {
      const followers = await FollowersModel.findById(username).populate('follower_accounts', 'username');
      res.status(200).json(followers);
    } catch (err) {
      next(err);
    }
};
  
// Get following of a user
exports.getFollowing = async (req, res, next) => {
    const { username } = req.params; 
  
    try {
      const following = await FollowingModel.findById(username).populate('accounts_followed', 'username');
      res.status(200).json(following);
    } catch (err) {
      next(err);
    }
};
  
// Add a follower
exports.addFollower = async (req, res, next) => {
    const { username, followerId } = req.body; 
  
    try {
    
      await FollowersModel.findOneAndUpdate(
        { username: username },
        { $addToSet: { follower_accounts: followerId } } 
      );
  
      await FollowingModel.findOneAndUpdate(
        { _id: followerId },
        { $addToSet: { accounts_followed: username } } 
      );
  
      res.status(200).json({ message: "Successfully followed" });
    } catch (err) {
      next(err);
    }
};


// Remove following (unfollow a user)
exports.removeFollowing = async (req, res, next) => {
    const { username, followingId } = req.body; 
  
    try {
     
      await FollowingModel.findOneAndUpdate(
        { username: username },
        { $pull: { accounts_followed: followingId } }
      );
  
     
      await FollowersModel.findOneAndUpdate(
        { _id: followingId },
        { $pull: { follower_accounts: username } }
      );
  
      res.status(200).json({ message: "Successfully unfollowed" });
    } catch (err) {
      next(err);
    }
};

// Fetch posts by a specific username
exports.getPostsByUsername = async (req, res, next) => {
    const { username } = req.params;
  
    try {

      const user = await UserModel.findOne({ username });  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const posts = await PostModel.find({ author: user.username }).sort({ datetime: -1 });   //might need to change to user._id
      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
};
  
// Fetch blocked accounts by username
exports.getBlockedByUsername = async (req, res, next) => {
    const { username } = req.params;
  
    try {

      const blockedData = await BlockedModel.findOne({ username });
  
      if (!blockedData) {
        return res.status(404).json({ message: 'No blocked accounts found for this user' });
      }
  
      res.status(200).json(blockedData.blocked_accounts);
    } catch (err) {
      next(err);
    }
};

exports.addBlocked = async (req, res) => {
    const { username, blockedUsername } = req.body;

    try {

        const user = await UserModel.findOne({ username });
        const blockedUser = await UserModel.findOne({ username: blockedUsername });

        if (!user || !blockedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        let blockedData = await BlockedModel.findOne({ username });

        if (!blockedData) {
            
            blockedData = new BlockedModel({
                username,
                blocked_accounts: []
            });
        }

        
        if (blockedData.blocked_accounts.includes(blockedUser.blockedUsername)) {
            return res.status(400).json({ message: 'User is already blocked' });
        }

        
        blockedData.blocked_accounts.push(blockedUser.blockedUsername);

        
        await blockedData.save();

        res.status(200).json({ message: `User ${blockedUsername} has been blocked.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }

};

//gets the array of conversationIds of user
// dunno if this is sustainable, there's probably a better way to get all conversationIds from UserDetail
// NEW: outputs a json of array of usernames
exports.getConversationsByUsername = async (req, res, next) => {
  const { username } = req.params;
    try {
      //const conversation = await ConversationModel.find({users: userId })
       const conversation = await UserModel.findOne({ username }).populate({
         path: 'conversations',
         populate: {
           path: 'users',  // populate users in each conversation
           select: 'username', 
         }
       })
       .select('conversations'); // Only select the conversations field
       //console.log(conversation.conversations);
    if (!conversation) {
        return res.status(404).json({ message: 'Conversations not found' });
      }
    // return the list of participating usernames and messageIds
    res.status(200).json(conversation.conversations );
  } catch (err) {
    next(err);
  }
};

// gets user info by userId
// might scrap
exports.getUserInfo = async(req,res, next) => {
  const {userId} = req.params;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  }catch (err) {
    next(err);
  }
};

exports.getCurrentUserID = async(req, res, next) => {
  try {
    res.status(200).json({currentUserID : req.session.userId});
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error getting current user ID' });
  }
}