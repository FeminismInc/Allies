const express = require('express');
const router = express.Router();
const { getConversation, newConversation, deleteConversation } = require('../controllers/messageController'); // Adjust the path as necessary

// Route to get a conversation by ID
router.get('/conversation/:conversationId', getConversation);

// Route to create a new conversation
router.post('/conversation', newConversation);

// Route to delete a conversation by ID
router.delete('/conversation/:conversationId', deleteConversation);

module.exports = router;