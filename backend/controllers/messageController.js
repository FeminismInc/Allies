const ConversationModel = require('../models/Conversations');
const UserModel = require('../models/Users');
const MessageModel = require('../models/Messages');
 
// Get a conversation by ID
exports.getConversation = async (req, res) => {
    const { conversationId } = req.params;

    try {
        const conversation = await ConversationModel.findById(conversationId).populate('messages'); 
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        //edit this so that it sends a json that also includes the objectIds of the users involved in the conversation 
        res.status(200).json(conversation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching conversation' });
    }
};

// Create a new conversation
exports.newConversation = async (req, res) => {
    const { currentUserId, otherUsername } = req.body; 
    console.log("new conversation has been called");
    try {
        // check if other user even exists!
        const otherUser = await UserModel.findOne({username:otherUsername});
        console.log("checking if otherUser exists...");
        if (!otherUser) {
            return res.status(404).json({ message: 'User not found' });
          }

        // check if a conversation between the exact same users already exists
        const existingConversation = await ConversationModel.findOne({
            users: { $all: [currentUserId, otherUser._id] },  // makes sure all users in the conversation don't already have an existing convo
            $expr: { $eq: [{ $size: "$users" }, 2] }  
        });
        if (existingConversation) {
            return res.status(200).json({
                message: 'Conversation already exists'
            });
        }
        
        const newConversation = await ConversationModel.create({ users: [currentUserId, otherUser._id]});

        // Adds the newly created convo id to each UserDetail obj of the participant users
        await UserModel.updateMany(
            { _id: { $in: [currentUserId, otherUser._id] } },  
            { $addToSet: { conversations: newConversation._id } }  
          );
        res.status(201).json(newConversation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating conversation' });
    }
};

// Delete a conversation by ID
exports.deleteConversation = async (req, res) => {
    const { conversationId } = req.params;

    try {
        const deletedConversation = await ConversationModel.findByIdAndDelete(conversationId);
        if (!deletedConversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting conversation' });
    }
};

exports.createMessage = async (req, res) => {
    console.log(req.body);
    try {
        const newMessage = new MessageModel({
            sender: req.body.sender,
            destination: req.body.destination,
            id: req.body.id,
            datetime: Date.now(),
            message_content: req.body.message_content
        });

        const savedMessage = await newMessage.save();
        console.log(savedMessage);
        res.status(201).json(savedMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating message' });
    }
};

exports.getMessagesByDest = async (req, res, next) => {
    const { username } = req.params;
    console.log(username);
    try {  
      const messages = await MessageModel.find({ destination: username }).sort({ datetime: -1 });   //might need to change to user._id
      res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
};