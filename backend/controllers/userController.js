const UserModel = require('../models/Users');
const FollowingModel = require('../models/Following');
const FollowersModel = require('../models/Followers');
const PostModel = require('../models/Posts');
const BlockedModel = require('../models/Blocked');
const mongoose = require('mongoose');
const ConversationModel = require('../models/Conversations');
const io = require('../node_modules/socket.io/client-dist/socket.io.js');

// Get all users
exports.findUser = async (req, res, next) => {
  try {
    const username = req.session.username;

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

    req.session.user_id = user._id;
    req.session.username = user.username; // saving username
    req.session.email = user.email; // saving email
    res.status(200).json(user);

    // res.status(200).json({ exists: true }); //return true if login was successful
    // about to change res.status to return anything, another way to get info rather than sessions
  } catch (err) {
    next(err);
  }
};


exports.newFollowing = async(req, res, next) => { 
  const { username } = req.params;

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
    const newFollowing = new FollowingModel({ username });
    const newFollowers = new FollowersModel({ username });
    const newBlocked = new BlockedModel({ username });

    // Save the new models to get their IDs
    await newFollowing.save();
    await newFollowers.save();
    await newBlocked.save();
    console.log(birthdate);

    const newUser = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      birthday: new Date(birthdate),
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
      blocked: newBlocked._id,
      followers: newFollowers._id,
      following: newFollowing._id,
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
  //console.log("username", username);
  try {
      const followers = await FollowersModel.findOne({ username }) // Wrap username in an object
          .populate('follower_accounts', 'username'); // Assuming follower_accounts is an array of ObjectIds
          //console.log("follower_accounts", followers );
      res.status(200).json(followers);
  } catch (err) {
      next(err);
  }
};

// Get following of a user
exports.getFollowing = async (req, res, next) => {
  const { username } = req.params; 

  try {
      const following = await FollowingModel.findOne({ username }) // Wrap username in an object
          .populate('accounts_followed', 'username'); // Assuming accounts_followed is an array of ObjectIds
          //console.log("accounts_followed", following );
          res.status(200).json(following);
  } catch (err) {
      next(err);
  }
};
  
// Add a follower
exports.addFollower = async (req, res, next) => {
    const { username } = req.body; 
  
    try {
      console.log("Username from request body:", username);

      const userToFollow = await UserModel.findOne({ username: username });
      console.log("User to follow:", userToFollow);

      if (!userToFollow) {
          return res.status(404).json({ message: "User not found" });
      }

      const updateFollowers = await FollowersModel.findOneAndUpdate(
        { username: userToFollow.username },
        { $addToSet: { follower_accounts: req.session.user_id } },
        { new: true } // To return the updated document
      );
      console.log(updateFollowers); 
      
      const updateFollowing = await FollowingModel.findOneAndUpdate(
        { username: req.session.username },
        { $addToSet: { accounts_followed: userToFollow._id } },
        { new: true }
      );
      console.log(updateFollowing);
  
      res.status(200).json({ message: "Successfully followed", message: req.session.username });
    } catch (err) {
      next(err);
    }
};


// Remove following (unfollow a user)
exports.removeFollowing = async (req, res, next) => {
  const { username } = req.body; 

  try {
      console.log("Username from request body:", username);

      const userToUnfollow = await UserModel.findOne({ username: username });
      console.log("User to unfollow:", userToUnfollow);

      if (!userToUnfollow) {
          return res.status(404).json({ message: "User not found" });
      }

      // Remove the user from the current user's follower_accounts
      // const updateFollowers = await FollowersModel.findOneAndUpdate(
      //     { username: req.session.username },
      //     { $pull: { follower_accounts: userToUnfollow._id } }, // Remove the user's ID
      //     { new: true } // To return the updated document


      // if we're unfollowing someone, we update THEIR follower list and remove ourselves from it 
      const updateFollowers = await FollowersModel.findOneAndUpdate(
        { username: userToUnfollow },
        { $pull: { follower_accounts: req.session.user_id } }, // Remove the user's ID
        { new: true } // To return the updated document
      );
      console.log(updateFollowers); // Check if it's returning the expected updated document
      
      // Remove the current user's ID from the accounts_followed of the user being unfollowed
      const updateFollowing = await FollowingModel.findOneAndUpdate(
          { username: req.session.username },
          { $pull: { accounts_followed: userToUnfollow._id } }, // Remove the current user's ID
          { new: true }
      );
      console.log(updateFollowing);

      res.status(200).json({ message: "Successfully unfollowed", username: req.session.username });
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

      let blockedData = await BlockedModel.findOne({ username });
  
      if (!blockedData) {
          blockedData = new BlockedModel({
            username,
            blocked_accounts: []
        });
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
    // Find the user by username and populate their conversations
    const user = await UserModel.findOne({ username })
      .populate({
        path: 'conversations', // Populate the conversations field
        populate: {
          path: 'messages',  // Populate messages within each conversation
          select: 'sender message_content datetime', // Select only necessary fields
        },
      })
      .select('conversations'); // Only select the conversations field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has conversations
    if (!user.conversations || user.conversations.length === 0) {
      return res.status(404).json({ message: 'No conversations found for this user' });
    }

    // Return the populated conversations with messages
    res.status(200).json(user.conversations);
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
    const User = await UserModel.findOne({username: req.session.userId});
    res.status(200).json(User);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error getting current user ID' });
  }
}

exports.getBioByUsername  = async(req,res) => {
  const {username} = req.params;
  //console.log("getting bio  ");
  try {
    const user = await UserModel.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.bio);
  }catch (err) {
    next(err);
  }
};

exports.updateBioByUsername  = async(req,res) => {
  const {username ,bioText} = req.body;
  try {
    const updatedBio = await UserModel.findOneAndUpdate(
      { username }, 
      { bio: bioText }, 
      { new: true } 
    );
    //console.log(updatedBio);

    if (!updatedBio) {
      return res.status(404).json({ message: 'User not found or error updating bio' });
    }

    
    res.status(200).json(updatedBio);
  }catch (err) {
    next(err);
  }
};

exports.searchUsers = async (req, res) => {
  const { username } = req.body;
  try {
    const users = await UserModel.find({ username: { $regex: username, $options: 'i' } });
    res.json(users);
  } catch (error) {
    res.status(500).send('Error searching users');
  }
}