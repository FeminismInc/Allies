import React from "react";
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import './messagelog.css';
import { Link } from 'react-router-dom';
import { Filter } from 'bad-words'


export default function MessageLog({
    currentUsername,
    currentConversation,
    messageList,
    message,
    setMessage,
    send,
    deleteConversation,
}) {
    // gets the usernames of all participants except for current user

    const otherParticipants = currentConversation
        ? currentConversation.users.filter(user => user !== currentUsername)
        : [];

    const filter = new Filter();

    return (
        <div className='messages-container'>
            <div className="header-container" >
                <span className="header">
                    {otherParticipants.length > 0
                        ? otherParticipants.map((participant) => (
                            <span key={participant}>
                                <Link to={`/profile/${participant}`} className="username-link">
                                    <span className="name">{participant}</span>
                                </Link>
                            </span>
                        ))
                        : 'No other participants'}
                </span>
                <IconButton
                    className="delete-button"
                    onClick={() => {deleteConversation()}}>
                <DeleteIcon   
                    />
                </IconButton>
            </div>

            <div className='messagelog-container'>
                {messageList.map((message) => (
                    <div className='message' key={uuidv4()}>
                        <div className={message.sender === currentUsername ? "mine" : "yours"}>
                            <span className="message-content">{filter.clean(message.message_content)}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="message-input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="message-input"
                    placeholder="Type your message..."
                    id="message-input"
                />
                <IconButton aria-label="send-button" size='large' onClick={send}>
                    <SendIcon fontSize="inherit" />
                </IconButton>
            </div>
        </div>
    );
};


