import { describe, it, expect, vi } from 'vitest';
import {
  getConversation,
  newConversation,
  deleteConversation,
  addMessageToConversation,
  createMessage,
  getMessagesByDest
} from '../controllers/messageController';
import ConversationModel from '../models/Conversations';
import UserModel from '../models/Users';
import MessageModel from '../models/Messages';

vi.mock('../models/Conversations');
vi.mock('../models/Users');
vi.mock('../models/Messages');

describe('messageController', () => {
  describe('getConversation', () => {
    it('should return messages for a conversation if found', async () => {
      // arrange
      const req = { params: { conversationId: 'conversation123' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockConversation = { messages: ['message1', 'message2'] };
      ConversationModel.findById.mockResolvedValue(mockConversation);

      // act
      await getConversation(req, res);

      // assert
      expect(ConversationModel.findById).toHaveBeenCalledWith('conversation123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockConversation.messages);
    });

    it('should return 404 if conversation not found', async () => {
      // arrange
      const req = { params: { conversationId: 'nonexistent' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      ConversationModel.findById.mockResolvedValue(null);

      // act
      await getConversation(req, res);

      // assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Conversation not found' });
    });

    it('should return 500 on error', async () => {
      // arrange
      const req = { params: { conversationId: 'conversation123' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      ConversationModel.findById.mockRejectedValue(new Error('Database error'));

      // act
      await getConversation(req, res);

      // assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching conversation' });
    });
  });

  describe('newConversation', () => {
    it('should create a new conversation if no existing one is found', async () => {
      // arrange
      const req = {
        body: { currentUsername: 'User1', otherUsername: 'User2' }
      };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockUser = { username: 'User2' };
      const mockConversation = { _id: 'conversation123', users: ['User1', 'User2'] };
      UserModel.findOne.mockResolvedValue(mockUser);
      ConversationModel.findOne.mockResolvedValue(null);
      ConversationModel.create.mockResolvedValue(mockConversation);
      UserModel.updateMany.mockResolvedValue({});

      // act
      await newConversation(req, res);

      // assert
      expect(UserModel.findOne).toHaveBeenCalledWith({ username: 'User2' });
      expect(ConversationModel.findOne).toHaveBeenCalledWith({
        users: { $all: ['User1', 'User2'] },
        $expr: { $eq: [{ $size: '$users' }, 2] }
      });
      expect(ConversationModel.create).toHaveBeenCalledWith({
        users: ['User1', 'User2']
      });
      expect(UserModel.updateMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockConversation);
    });

    it('should return 404 if other user is not found', async () => {
      // arrange
      const req = { body: { currentUsername: 'User1', otherUsername: 'User2' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      UserModel.findOne.mockResolvedValue(null);

      // act
      await newConversation(req, res);

      // assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 200 if a conversation already exists', async () => {
      // arrange
      const req = { body: { currentUsername: 'User1', otherUsername: 'User2' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockConversation = { _id: 'conversation123', users: ['User1', 'User2'] };
      UserModel.findOne.mockResolvedValue({ username: 'User2' });
      ConversationModel.findOne.mockResolvedValue(mockConversation);

      // act
      await newConversation(req, res);

      // assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockConversation);
    });
  });

  describe('deleteConversation', () => {
    it('should delete a conversation and associated data', async () => {
      // arrange
      const req = { params: { conversationId: 'conversation123' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockConversation = { _id: 'conversation123', users: ['User1', 'User2'] };
      ConversationModel.findById.mockResolvedValue(mockConversation);
      UserModel.updateMany.mockResolvedValue({});
      MessageModel.deleteMany.mockResolvedValue({});
      ConversationModel.findByIdAndDelete.mockResolvedValue(mockConversation);

      // act
      await deleteConversation(req, res);

      // assert
      expect(UserModel.updateMany).toHaveBeenCalled();
      expect(MessageModel.deleteMany).toHaveBeenCalled();
      expect(ConversationModel.findByIdAndDelete).toHaveBeenCalledWith('conversation123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Conversation deleted successfully' });
    });

    it('should return 404 if conversation not found', async () => {
      // arrange
      const req = { params: { conversationId: 'nonexistent' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      ConversationModel.findById.mockResolvedValue(null);

      // act
      await deleteConversation(req, res);

      // assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Conversation not found' });
    });
  });

  describe('addMessageToConversation', () => {
    it('should add a message to a conversation and return the updated conversation', async () => {
      // arrange
      const req = { body: { conversationId: 'conversation123', messageId: 'message456' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockUpdatedConversation = {
        _id: 'conversation123',
        messages: ['message123', 'message456']
      };
      ConversationModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedConversation);
  
      // act
      await addMessageToConversation(req, res);
  
      // assert
      expect(ConversationModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'conversation123',
        { $addToSet: { messages: 'message456' } },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedConversation);
    });
  
    it('should return 404 if the conversation is not found', async () => {
      // arrange
      const req = { body: { conversationId: 'nonexistent', messageId: 'message456' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      ConversationModel.findByIdAndUpdate.mockResolvedValue(null);
  
      // act
      await addMessageToConversation(req, res);
  
      // assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Conversation not found' });
    });
  
    it('should return 500 on error', async () => {
      // arrange
      const req = { body: { conversationId: 'conversation123', messageId: 'message456' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      ConversationModel.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));
  
      // act
      await addMessageToConversation(req, res);
  
      // assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating conversation' });
    });
  });

  describe('createMessage', () => {
    it('should create a new message and return it', async () => {
      // arrange
      const req = {
        body: {
          sender: 'user1',
          destination: 'user2',
          id: 'message123',
          message_content: 'Hello, user2!'
        }
      };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockSavedMessage = {
        _id: 'message123',
        sender: 'user1',
        destination: 'user2',
        id: 'message123',
        datetime: expect.any(Number),
        message_content: 'Hello, user2!'
      };
      MessageModel.prototype.save = vi.fn().mockResolvedValue(mockSavedMessage);
  
      // act
      await hcreateMessage(req, res);
  
      // assert
      expect(MessageModel.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSavedMessage);
    });
  
    it('should return 500 on error', async () => {
      // arrange
      const req = {
        body: {
          sender: 'user1',
          destination: 'user2',
          id: 'message123',
          message_content: 'Hello, user2!'
        }
      };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      MessageModel.prototype.save = vi.fn().mockRejectedValue(new Error('Database error'));
  
      // act
      await createMessage(req, res);
  
      // assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating message' });
    });
  });
  
});
