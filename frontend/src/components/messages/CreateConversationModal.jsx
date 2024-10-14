import React from 'react';

export default function CreateConversationModal({
  showModal,
  closeModal,
  otherUsername,
  setOtherUsername,
  error,
  handleCreateConversation,
}) {
  if (!showModal) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h1>Start a Conversation</h1>
        <input
          type="text"
          placeholder="Enter username"
          value={otherUsername}
          onChange={(e) => setOtherUsername(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleCreateConversation}>Start Conversation</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}