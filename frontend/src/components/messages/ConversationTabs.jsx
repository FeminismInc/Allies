import IconButton from '@mui/material/IconButton';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import './conversationtabs.css';
import React from "react";

export default function ConversationTabs({
    conversation,
    currentUserID,
    isSelected
}) {
    return (
        <div className={`convo ${isSelected ? 'selected' : ''}`}>
            <IconButton aria-label="profile-picture">
                <AccountCircleOutlinedIcon />
            </IconButton>
            {conversation.users
                .filter(user => user !== currentUserID)
                .map((user, index) => (
                    <div key={index} className="user-info">
                        <span className="username">{user}</span>
                    </div>
                ))}
        </div>
    );
}
