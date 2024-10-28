// components/messages/ConversationList.js
import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConversationTabs from './ConversationTabs';
import CreateConversationModal from './CreateConversationModal';
import './conversationList.css';

const ConversationList = ({
    conversationIds,
    currentUsername,
    currentConversation,
    setCurrentConversation,
    showModal,
    handleOpenModal,
    handleCloseModal,
    otherUsername,
    setOtherUsername,
    error,
    handleCreateConversation,
}) => {
    return (
        <div className='conversationsList'>
            <div className="header">
                <span className='heading'>Recent Messages</span>
                <IconButton aria-label="create-conversation" onClick={handleOpenModal}>
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
                            onClick={() => setCurrentConversation(conversation)}
                        >
                            <ConversationTabs
                                conversation={conversation}
                                currentUsername={currentUsername}
                                isSelected={currentConversation?._id === conversation._id}
                            />
                        </div>
                    ))
                ) : (<p>No recent messages</p>)}
            </div>
        </div>
    );
};

export default ConversationList;
