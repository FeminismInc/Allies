import axios from 'axios';
import React, { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import "./messages.css"
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Sidebar from '../../components/sidebar/Sidebar';
import { Button } from 'react-native';
import SendIcon from '@mui/icons-material/Send';

export default function MessagesPage() {
    //TODO: make a component called 'conversations' that display the profile pic, name, and snippet of most recent message
    // it will be used in both the messages widget in the home page and in the messages page (here)
    const uri = 'http://localhost:5050/api';
    const [conversationIds, setConversationIds] = useState([]);
    //const [username, setUsername] = useState('');
    const username = "BarbieRoberts59";

    useEffect(() => {
        axios.get(`${uri}/users/getConversations/${username}`, {})
            .then(response => {
                setConversationIds(response.data.conversationIds);
            })
            .catch(error => {
                console.error('Error fetching conversationIds:', error);

            });
    }, []);

    const [message, setMessage] = useState('')

    //TODO: we need an API for sending messages. Once that's created we can fill this in
    // const send = async (e) => {
    //     console.log("entered submit");
    //     e.preventDefault();
    //     try {

    //     }
    //     catch(e) {
    //         console.log('Something went wrong sending a message')
    //     }
    // }

    return (
        <div className='conversationMainContent'>
            <div className="sidebarContainer">
                <Sidebar />
            </div>
            {/* left side of the messages page (list of recent messages, add new message, search bar?) */}
            <div className='conversationsList'>
                <div className="header">
                    <h1>Recent Messages</h1>
                    <IconButton aria-label="create-conversation">
                        <AddCircleOutlineIcon />
                    </IconButton>
                </div>
                {/* clickable previews of conversations (display profile picture and username of the user that's in correspondence) */}
                <div className='conversations'>
                    {conversationIds.length > 0 ? (
                        conversationIds.map((id) => (
                            <div key={id} className="convo">
                                <IconButton aria-label="profile-picture">
                                    <AccountCircleOutlinedIcon />
                                </IconButton>
                                <span className="username">{"ConversationId: "}{id}</span>  {/* will need to replace this whole section with conversation component that uses a request to get the conversation by conversationId and populates */}
                            </div>
                        ))) : (<p>No posts found.</p>)}
                </div>
            </div>

            {/* right side of messages page: displays the messages of the clicked conversation and input text bar thingy*/}
            <div className='messages-container'>
                <div className='messagelog-container'>
                    <h1>{"Messages here"}</h1>
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
                        //onClick={send}
                        >
                        Send
                    </button>
                </div>
            </div>

        </div>

    )

}
