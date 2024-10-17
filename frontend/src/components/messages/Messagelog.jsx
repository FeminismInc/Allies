import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import './messagelog.css';


export default function MessageLog  ({
    currentUserID,
    currentConversation,
    messageList,
    message,
    setMessage,
    send
}) {
    // gets the usernames of all participants except for current user
    const otherParticipants = currentConversation
        ? currentConversation.users.filter(user => user !== currentUserID)
        : [];

    return (
        <div className='messages-container'>
            <div className="header-container" >
                <span className="header">
                    {otherParticipants.length > 0
                        ? otherParticipants.join(', ')
                        : 'No other participants'}
                </span>
                <IconButton className="delete-button">
    <DeleteIcon className="delete-icon" />
</IconButton>
            </div>

            <div className='messagelog-container'>
                {messageList.map((message) => (
                    <div className='message' key={uuidv4()}>
                        <div className={message.sender === currentUserID ? "mine" : "yours"}>
                            <span className="message-content">{message.message_content}</span>
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


