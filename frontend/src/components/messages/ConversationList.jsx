import React from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

export default function ConversationList({
  conversationIds,
  currentUsername,
  setSelectedConversationId,
}) {
  if (conversationIds.length === 0) return <p>No posts found.</p>;

  return (
    <div className="conversations">
      {conversationIds.map((conversation) => (
        <div
          key={conversation._id}
          className="convo"
          onClick={() => setSelectedConversationId(conversation._id)}
          style={{ cursor: 'pointer' }}
        >
          <IconButton aria-label="profile-picture">
            <AccountCircleOutlinedIcon />
          </IconButton>
          {conversation.users
            .filter((user) => user.username !== currentUsername)
            .map((user, index) => (
              <div key={index} className="user-info">
                <span className="username">{user.username}</span>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
