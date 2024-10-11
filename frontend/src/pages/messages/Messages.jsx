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
import { v4 as uuidv4 } from 'uuid';

export default function MessagesPage() {
    
    const uri = 'http://localhost:5050/api';
    const socket = io.connect("http://localhost:5050");
    const [conversationIds, setConversationIds] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [otherUsername, setOtherUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    

    const currentUsername = "user2";
    const currentUserId = '66eb88bffe2b2e83e706b1cc'; //for testing purposes

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
        /*axios.get(`${uri}/users/getConversations/${currentUsername}`, {})

            .then(response => {
                setConversationIds(response.data);
            })
            .catch(error => {
                console.error('Error fetching conversationIds:', error);

            });*/
        console.log("trying to get messages")
        axios.get(`${uri}/messages/getMessages/${currentUsername}`, {})

            .then(response => {
                response.data.forEach(element => {
                    var found = false;
                    for(var i = 0; i < messageList.length; i++){
                        if(messageList[i].id == element.id){
                            found = true;
                        }
                    }
                    if(!found){
                        setMessageList([...messageList, element]);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching messages:', error);

            });
    }, [messageList]);
  
    //TODO: we need an API for sending messages. Once that's created we can fill this in
     const send = async (e) => {
        e.preventDefault();
        var c = document.getElementById("message-input").value;
        //socket.emit('messageOut', {contents:c, id:Date.now().toString()});
        console.log("trying");
            const post = await axios.post(`${uri}/messages/newMessage`, { //create message object
                sender: "user1",
                destination: "user2",
                id: Date.now().toString(),
                datetime: Date.now(),
                message_content: c
        })
        setMessage(''); 
     };

    /*socket.on('messageIn', (message) => {
        var messageContents = message.contents;
        var found = false;
        for(var i = 0; i < messageList.length; i++){
            if(messageList[i].id == message.id){
                found = true;
            }
        }
        if(!found){
            setMessageList([...messageList, message]);
        }
    });*/

    //socket.emit("messageOut", {contents:"whuh"});


    return (
        <div className='conversationMainContent'>
            <div className="sidebarContainer">
                <Sidebar />
            </div>
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
                        ))) : (<p>No conversations found.</p>)}
                </div>
            </div>

            {/* right side of messages page: displays the messages of the clicked conversation and input text bar thingy*/}
            <div className='messages-container'>
                <div className='messagelog-container'>
                    <ul className='messages'>
                        {messageList.map((message) => (
                            <div
                                key={uuidv4()}
                                className="message-container"
                            >
                                <span className="message">{message.message_content}</span>
                            </div>
                            ))
                        }
                    </ul>
                </div>
                <div className="message-input-container">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => { setMessage(e.target.value) }}
                        className="message-input"
                        placeholder="Type your message..."
                        id = "message-input"
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
