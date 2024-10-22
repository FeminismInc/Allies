import axios from 'axios';
import React, { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Sidebar from '../../components/sidebar/Sidebar';
import { io } from "socket.io-client"; // Import socket.io
import "./messages.css";
import ConversationTabs from '../../components/messages/ConversationTabs';
import CreateConversationModal from '../../components/messages/CreateConversationModal';
import MessageLog from '../../components/messages/Messagelog';

export default function MessagesPage() {
    const uri = 'http://localhost:5050/api';
    const socket = io("http://localhost:5050"); // Initialize socket connection http://54.176.5.254:5050/api

    const [conversationIds, setConversationIds] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [otherUsername, setOtherUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [currentUserID, setCurrentUserID] = useState("");

    // Function to send a message
    const send = async (e) => {
        e.preventDefault();
        if (!currentConversation) return;
        const messageContent = document.getElementById("message-input").value;
        console.log(currentConversation);
        const messageObj = {
            sender: currentUserID,
            destination: currentConversation.users.filter(user => user !== currentUserID)[0],
            id: currentConversation._id,
            message_content: messageContent,
            datetime: Date.now()
        };

        try {
            // Create and save the message to the database
            const newMessage = await axios.post(`${uri}/messages/newMessage`, messageObj);
            console.log(newMessage.data);
            // Emit message to the server
            socket.emit("messageOut", { ...messageObj, _id: newMessage.data._id });

            await axios.post(`${uri}/messages/addMessageConversation`, {
                conversationId: currentConversation._id,
                messageId: newMessage.data._id
            });

            // Clear input
            setMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Listen for incoming messages
    useEffect(() => {
        socket.on('messageIn', (newMessage) => {
            console.log("Message received:", newMessage);
            // If the new message belongs to the current conversation, update the message list
            if (newMessage.id === currentConversation?._id) {
                setMessageList(prevMessages => [...prevMessages, newMessage]);
            }
        });

        return () => {
            socket.off('messageIn'); // Cleanup on component unmount
        };
    }, [currentConversation]);

    useEffect(() => {
        axios.get(`${uri}/users/getCurrentUserID`)
            .then(response => {
                console.log(response.data);
                setCurrentUserID(response.data.username);
                return axios.get(`${uri}/users/getConversations/${response.data.username}`);
            })
            .then(response => {
                const conversations = Array.isArray(response.data) ? response.data : [response.data];
                setConversationIds(conversations);
            })
            .catch(error => {
                console.error('Error fetching conversations:', error);
            });
    }, []);

    useEffect(() => {
        console.log('Updated Conversation IDs:', conversationIds);
    }, [conversationIds]);

    const handleOpenModal = () => setShowModal(true);

    const handleCloseModal = () => {
        setShowModal(false);
        setOtherUsername('');
        setError('');
    };

    const handleCreateConversation = async () => {
        try {
            const response = await axios.post(`${uri}/messages/conversation`, {
                currentUserID,
                otherUsername
            });

            if (response.status === 201) {
                alert('Conversation created successfully');
                setConversationIds(prevConversations => [...prevConversations, response.data]);
                handleCloseModal();
            } else if (response.status === 404) {
                setError('User not found');
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
            setError('Something went wrong, please try again.');
        }
    };

    const receiveMessages = async () => {
        console.log(currentConversation)
        try {
            const response = await axios.get(`${uri}/messages/getMessages/${currentConversation.users[1]}`);
            console.log("hello", response.data)
            setMessageList(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    return (
        <body id="messages">
            <div className='conversationMainContent'>
                <Sidebar />
                {/* Left side: Conversation List */}
                <div className='conversationsList'>
                    <div className="header">
                        <span className='heading' >Recent Messages</span>
                        <IconButton aria-label="create-conversation" onClick={handleOpenModal} >
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </div>
                    {/* Modal to start a new conversation */}
                    <CreateConversationModal
                        showModal={showModal}
                        closeModal={handleCloseModal}
                        otherUsername={otherUsername}
                        setOtherUsername={setOtherUsername}
                        error={error}
                        handleCreateConversation={handleCreateConversation}
                    />
                    {/* Conversation previews */}
                    <div className='conversations'>
                        {conversationIds.length > 0 ? (
                            conversationIds.map((conversation) => (
                                <div
                                    key={conversation._id}
                                    onClick={() => {
                                        setCurrentConversation(conversation);
                                        receiveMessages();
                                    }}
                                >
                                    <ConversationTabs
                                        conversation={conversation}
                                        currentUserID={currentUserID}
                                        isSelected={currentConversation?._id === conversation._id} 
                                    />
                                </div>
                            ))
                        ) : (<p>No recent messages</p>)}
                    </div>
                </div>
                {currentConversation && (
                    <MessageLog
                        currentUserID={currentUserID}
                        currentConversation={currentConversation}
                        messageList={messageList}
                        message={message}
                        setMessage={setMessage}
                        send={send}
                    />
                )}
            </div>
        </body>
    );
}
