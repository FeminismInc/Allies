import axios from 'axios';
import React, { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/search_bar/searchBar';
import "./messages.css"
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

export default function MessagesPage(){
    //TODO: make a component called 'conversations' that display the profile pic, name, and snippet of most recent message
    // it will be used in both the messages widget int he home page and in the messages page (here)
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


    return (
        <div className='conversationContainer'>
            {/* left side of the messages page (list of recent messages, add new message, search bar?) */}
            <div className='conversationsList'>
                <div className="header">
                    <h1>Recent Messages</h1>
                    <IconButton aria-label="create-conversation">
                        <AddCircleOutlineIcon />
                    </IconButton>
                </div>
                <div className='conversations'>
                    {conversationIds.length > 0 ? (
                        conversationIds.map((id) => (
                            <div key={id} className="convo">
                                <IconButton aria-label="profile-picture">
                                <AccountCircleOutlinedIcon/>
                                </IconButton>
                                 <span className="username">{"Conversation Ids: "}{id}</span>  {/* will need to replace this whole section with conversation component that uses a request to get the conversation by conversationId and populates */}
                            </div>

                        ))): (<p>No posts found.</p>)}
                </div>
            </div>
            <div className='messages-container'>
            <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
            </div>
        </div>

    )

}