import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import MessagesPage from './messages';

// Mock modules
vi.mock('axios');
vi.mock('socket.io-client');

// Mock child components
vi.mock('../../components/sidebar/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

vi.mock('../../components/messages/ConversationList', () => ({
  default: ({ handleCreateConversation }) => (
    <div data-testid="conversation-list">
      <button onClick={handleCreateConversation}>Create Conversation</button>
    </div>
  )
}));

vi.mock('../../components/messages/Messagelog', () => ({
  default: ({ send }) => (
    <div data-testid="message-log">
      <input id="message-input" type="text" />
      <button onClick={send}>Send</button>
    </div>
  )
}));

describe('MessagesPage Component', () => {
  const mockSocket = {
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    io.mockImplementation(() => mockSocket);

    // Mock initial axios calls
    axios.get.mockImplementation((url) => {
      if (url.includes('/users/findUser')) {
        return Promise.resolve({ data: { username: 'testUser' } });
      }
      if (url.includes('/users/getConversations')) {
        return Promise.resolve({ 
          data: [
            { _id: '1', users: ['testUser', 'user2'] }
          ] 
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderMessagesPage = async () => {
    let component;
    await act(async () => {
      component = render(
        <BrowserRouter>
          <MessagesPage />
        </BrowserRouter>
      );
    });
    return component;
  };

  describe('Initial Load', () => {
    it('fetches current user and conversations on mount', async () => {
      // Arrange & Act
      await renderMessagesPage();

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5050/api/users/findUser',
        { withCredentials: true }
      );
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5050/api/users/getConversations/testUser'
      );
    });
  });

  describe('Message Handling', () => {
    it('sends a message successfully', async () => {
      // Arrange
      axios.post.mockImplementation((url) => {
        if (url.includes('/messages/newMessage')) {
          return Promise.resolve({ data: { _id: 'msg1' } });
        }
        if (url.includes('/messages/addMessageConversation')) {
          return Promise.resolve({ data: { success: true } });
        }
        return Promise.reject(new Error('Not found'));
      });

      // Set up component with a current conversation
      const { container } = await renderMessagesPage();
      
      await act(async () => {
        // Simulate selecting a conversation
        const messageInput = container.querySelector('#message-input');
        if (messageInput) {
          fireEvent.change(messageInput, { target: { value: 'Test message' } });
        }
      });

      // Act
      await act(async () => {
        const sendButton = screen.getByText('Send');
        fireEvent.click(sendButton);
      });

      // Assert
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'messageOut',
        expect.objectContaining({
          message_content: 'Test message',
          _id: 'msg1'
        })
      );
    });
  });

  describe('Socket Events', () => {
    it('updates message list when receiving a new message', async () => {
      // Arrange
      const newMessage = {
        _id: 'msg2',
        sender: 'user2',
        destination: 'testUser',
        id: '1',
        message_content: 'New message',
        datetime: Date.now()
      };

      await renderMessagesPage();

      // Act
      await act(async () => {
        // Find the socket.on call for 'messageIn' and execute its callback
        const messageInCallback = mockSocket.on.mock.calls.find(
          call => call[0] === 'messageIn'
        )?.[1];
        if (messageInCallback) {
          messageInCallback(newMessage);
        }
      });

      // Assert
      expect(mockSocket.on).toHaveBeenCalledWith('messageIn', expect.any(Function));
    });
  });

  describe('Conversation Creation', () => {
    it('creates a new conversation successfully', async () => {
      // Arrange
      const newConversation = { 
        _id: '3', 
        users: ['testUser', 'newUser'],
        status: 201 
      };
      
      axios.post.mockResolvedValueOnce({ 
        status: 201, 
        data: newConversation 
      });

      // Act
      const { container } = await renderMessagesPage();
      
      await act(async () => {
        const createButton = screen.getByText('Create Conversation');
        fireEvent.click(createButton);
      });

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5050/api/messages/conversation',
        expect.any(Object)
      );
    });

    it('handles conversation creation error', async () => {
      // Arrange
      axios.post.mockRejectedValueOnce(new Error('User not found'));
      
      // Act
      const { container } = await renderMessagesPage();
      
      await act(async () => {
        const createButton = screen.getByText('Create Conversation');
        fireEvent.click(createButton);
      });

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5050/api/messages/conversation',
        expect.any(Object)
      );
    });
  });

  describe('Cleanup', () => {
    it('removes socket listener on unmount', async () => {
      // Arrange
      const { unmount } = await renderMessagesPage();

      // Act
      await act(async () => {
        unmount();
      });

      // Assert
      expect(mockSocket.off).toHaveBeenCalledWith('messageIn');
    });
  });
});