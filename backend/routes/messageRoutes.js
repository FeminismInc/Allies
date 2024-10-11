const express = require('express');
const router = express.Router();
const { getConversation, newConversation, deleteConversation, createMessage, getMessagesByDest, addMessageToConversation} = require('../controllers/messageController'); // Adjust the path as necessary

// Route to get a conversation by ID
router.get('/conversation/:conversationId', getConversation);

// Route to create a new conversation
router.post('/conversation', newConversation);

// Route to delete a conversation by ID
router.delete('/conversation/:conversationId', deleteConversation);

//Route to create a new message
router.post('/newMessage', createMessage);

router.post('/addMessageConversation', addMessageToConversation);

//Route to get messages by their destination
router.get('/getMessages/:username', getMessagesByDest)

module.exports = router;