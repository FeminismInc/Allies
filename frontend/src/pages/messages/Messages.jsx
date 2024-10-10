import axios from 'axios';
import React, { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import "./messages.css"
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Sidebar from '../../components/sidebar/Sidebar';
import { Button } from 'react-native';
import SendIcon from '@mui/icons-material/Send';
import io from "../../../node_modules/socket.io/client-dist/socket.io.js";
export default function MessagesPage() {
    
    const uri = 'http://localhost:5050/api';
    const [conversationIds, setConversationIds] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [otherUsername, setOtherUsername] = useState('');

    // for testing purposes 
    const currentUsername = "matthew500";
    const currentUserId = '66fe3c39f0478c848d7bc7d5'; 

    const handleOpenModal = () => {
        setShowModal(true);
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
        setOtherUsername('');
        setError('');
      };

      const handleCreateConversation = async () => {
        try {
          const response = await axios.post(`${uri}/messages/conversation`, {
            currentUserId, // logged-in users Id
            otherUsername // the entered username
          });
    
          if (response.status === 201) {
            alert('Conversation created successfully');
            handleCloseModal();
          } else if (response.status === 404) {
            setError('User not found');
          }
        } catch (error) {
          console.error('Error creating conversation-frontend', error);
          setError('Something went wrong, please try again.');
        }
      };

    useEffect(() => {
        const socket = io.connect("http://localhost:5050");
        axios.get(`${uri}/users/getConversations/${currentUsername}`, {})
            .then(response => {
                setConversationIds(response.data);
            })
            .catch(error => {
                console.error('Error fetching conversationIds:', error);

            });
    }, []);

    


    const [message, setMessage] = useState('');
  

    //TODO: we need an API for sending messages. Once that's created we can fill this in
     const send = (e) => {
        e.preventDefault();
        console.log(message);
        setMessage('');
        
     };
    return (
        <div className='conversationMainContent'>
                <Sidebar />
            {/* left side of the messages page (list of recent messages, add new message, search bar?) */}
            <div className='conversationsList'>
                <div className="header">
                    <h1>Recent Messages</h1>
                    <IconButton aria-label="create-conversation" onClick={handleOpenModal}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                    {/* modal where the current user will enter the username of the user they want to start a conversation with.
                        Maybe turn into component later  */}
                    {showModal && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Start a Conversation</h2>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={otherUsername}
                                    onChange={(e) => setOtherUsername(e.target.value)}
                                />
                                {error && <p className="error">{error}</p>}
                                <button onClick={handleCreateConversation}>Start Conversation</button>
                                <button onClick={handleCloseModal}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
                {/* clickable previews of conversations (display profile picture and username of the user that's in correspondence) */}
                <div className='conversations'>
                    {conversationIds.length > 0 ? (
                        conversationIds.map((conversation) => (
                            <div key={conversation._id} className="convo" onClick={() => {
                              }}
                            >
                                <IconButton aria-label="profile-picture">
                                    <AccountCircleOutlinedIcon />
                                </IconButton>
                                {/* Filter out the current user from the conversation's user list */}
                                {conversation.users
                                    .filter(user => user.username !== currentUsername)  // Exclude current user
                                    .map((user, index) => (
                                        <div key={index} className="user-info">
                                            <span className="username">{user.username}</span>
                                        </div>
                                    ))}
                            </div>
                        ))) : (<p>No posts found.</p>)}
                </div>
            </div>

            {/* right side of messages page: displays the messages of the clicked conversation and input text bar thingy*/}
            <div className='messages-container'>
                <div className='messagelog-container'>
                    <h1>{"Messages here"}</h1>
                    {/* testing purposes */}
                    <div className="message">
                        <div className="message-header">
                        {/* <AccountCircleOutlinedIcon className="profile-picture" /> */}
                            <div className="message-info">
                                <span className="username">{"username"}</span>
                                {/* <span className="handle">@{post.author}</span>
                                <span className="post-date">
                                    {new Date(post.datetime).toLocaleString()}

                                </span> */}
                            </div>
                        </div>
                        <div className="message-content">
                            <p>{'How do you feel about overthrowing a small government asdfjpoqj adskfpok c [psdfl[[pl ckn qooc[ l[pla[p lsd dsf'}</p>
                        </div>
                    </div>
                    <div className="message">
                        <div className="message-header">
                        {/* <AccountCircleOutlinedIcon className="profile-picture" /> */}
                            <div className="message-info">
                                <span className="username">{"username2"}</span>
                                {/* <span className="handle">@{post.author}</span>
                                <span className="post-date">
                                    {new Date(post.datetime).toLocaleString()}

                                </span> */}
                            </div>
                        </div>
                        <div className="message-content">
                            <p>{'maybe you shouldnt'}</p>
                        </div>
                    </div>
                </div>

                {/* Unsure if i did this part right */}
                <div className="message-input-container">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => { setMessage(e.target.value) }}
                        className="message-input"
                        placeholder="Type your message..."
                    />
                    <button
                        className="send-button"
                        onClick={send}
                        >
                        Send
                    </button>
                </div>
            </div>

        </div>

    )

}
