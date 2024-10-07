const ConversationModel = require('../models/Conversations');

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
    const { users } = req.body; 

    try {
        const newConversation = await ConversationModel.create({ users });
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