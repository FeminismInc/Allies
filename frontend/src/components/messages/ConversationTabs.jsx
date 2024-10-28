import IconButton from '@mui/material/IconButton';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import './conversationtabs.css';
import React from "react";

export default function ConversationTabs({
    conversation,
    currentUsername,
    isSelected
}) {
    return (
        <div className={`convo-tab ${isSelected ? 'selected' : ''}`}>
            <IconButton aria-label="profile-picture">
                <AccountCircleOutlinedIcon />
            </IconButton>
            {conversation.users
                .filter(user => user !== currentUsername)
                .map((user, index) => (
                    <div key={index} className="user-info">
                        <span className="username">{user}</span>
                    </div>
                ))}
        </div>
    );
}
