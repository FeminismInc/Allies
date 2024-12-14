import { describe, it, expect, vi } from 'vitest';
import * as userController from '../controllers/userController';
import UserModel from '../models/Users';
import FollowingModel from '../models/Following';
import FollowersModel from '../models/Followers';
import BlockedModel from '../models/Blocked';
import PostModel from '../models/Posts';
import mongoose from 'mongoose';

// mock the models
vi.mock('../models/Users');
vi.mock('../models/Following');
vi.mock('../models/Followers');
vi.mock('../models/Blocked');
vi.mock('../models/Posts');
vi.mock('mongoose');

describe('UserController', () => {
  // mocking express req and res objects
  const mockReq = {
    session: { 
      username: 'testuser', 
      user_id: 'mockUserId',
      email: 'test@example.com'
    },
    body: {},
    params: {}
  };
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  };
  const mockNext = vi.fn();

  describe('findUser', () => {
    it('should find a user successfully', async () => {
      // arrange
      const mockUser = { 
        username: 'testuser', 
        email: 'test@example.com' 
      };
      UserModel.findOne = vi.fn().mockResolvedValue(mockUser);

      // act
      await userController.findUser(mockReq, mockRes, mockNext);

      // assert
      expect(UserModel.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 401 if no username in session', async () => {
      // arrange
      const reqWithoutUsername = { 
        ...mockReq, 
        session: {} 
      };

      // act
      await userController.findUser(reqWithoutUsername, mockRes, mockNext);

      // assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User is not logged in' });
    });

    it('should return 404 if user not found', async () => {
      // arrange
      UserModel.findOne = vi.fn().mockResolvedValue(null);

      // act
      await userController.findUser(mockReq, mockRes, mockNext);

      // assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('findUserByEmail', () => {
    it('should login successfully with correct credentials', async () => {
      // arrange
      const mockUser = { 
        _id: 'mockUserId',
        username: 'testuser', 
        email: 'test@example.com',
        password: 'correctpassword'
      };
      mockReq.body = { 
        email: 'test@example.com', 
        password: 'correctpassword' 
      };
      UserModel.findOne = vi.fn().mockResolvedValue(mockUser);

      // act
      await userController.findUserByEmail(mockReq, mockRes, mockNext);

      // assert
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockReq.session.user_id).toBe('mockUserId');
      expect(mockReq.session.username).toBe('testuser');
      expect(mockReq.session.email).toBe('test@example.com');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user does not exist', async () => {
      // arrange
      mockReq.body = { 
        email: 'nonexistent@example.com', 
        password: 'somepassword' 
      };
      UserModel.findOne = vi.fn().mockResolvedValue(null);

      // act
      await userController.findUserByEmail(mockReq, mockRes, mockNext);

      // assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User does not exist' });
    });

    it('should return 400 if password does not match', async () => {
      // arrange
      const mockUser = { 
        username: 'testuser', 
        email: 'test@example.com',
        password: 'correctpassword'
      };
      mockReq.body = { 
        email: 'test@example.com', 
        password: 'wrongpassword' 
      };
      UserModel.findOne = vi.fn().mockResolvedValue(mockUser);

      // act
      await userController.findUserByEmail(mockReq, mockRes, mockNext);

      // assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Handle does not match' });
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // arrange
      mockReq.body = {
        birthdate: '1990-01-01',
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        handle: '@newuser',
        pronouns: 'they/them'
      };

      // mocking mongoose ObjectId
      mongoose.Types.ObjectId = vi.fn().mockReturnValue('mockObjectId');

      // mocking save methods
      FollowingModel.prototype.save = vi.fn().mockResolvedValue({ _id: 'mockFollowingId' });
      FollowersModel.prototype.save = vi.fn().mockResolvedValue({ _id: 'mockFollowersId' });
      BlockedModel.prototype.save = vi.fn().mockResolvedValue({ _id: 'mockBlockedId' });
      UserModel.prototype.save = vi.fn().mockResolvedValue({});

      // act
      await userController.createUser(mockReq, mockRes, mockNext);

      // assert
      expect(FollowingModel.prototype.save).toHaveBeenCalled();
      expect(FollowersModel.prototype.save).toHaveBeenCalled();
      expect(BlockedModel.prototype.save).toHaveBeenCalled();
      expect(UserModel.prototype.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User created successfully" });
    });
  });

  describe('addFollower', () => {
    it('should add a follower successfully', async () => {
      // arrange
      const mockUserToFollow = { 
        _id: 'userToFollowId', 
        username: 'followeduser' 
      };
      mockReq.body = { username: 'followeduser' };

      UserModel.findOne = vi.fn().mockResolvedValue(mockUserToFollow);
      FollowersModel.findOneAndUpdate = vi.fn().mockResolvedValue({});
      FollowingModel.findOneAndUpdate = vi.fn().mockResolvedValue({});

      // act
      await userController.addFollower(mockReq, mockRes, mockNext);

      // assert
      expect(UserModel.findOne).toHaveBeenCalledWith({ username: 'followeduser' });
      expect(FollowersModel.findOneAndUpdate).toHaveBeenCalled();
      expect(FollowingModel.findOneAndUpdate).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          message: expect.stringContaining('Successfully followed') 
        })
      );
    });

    it('should return 404 if user to follow not found', async () => {
      // arrange
      mockReq.body = { username: 'nonexistentuser' };
      UserModel.findOne = vi.fn().mockResolvedValue(null);

      // act
      await userController.addFollower(mockReq, mockRes, mockNext);

      // assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });

  describe('getPostsByUsername', () => {
    it('should fetch posts for a valid username', async () => {
      // arrange
      const mockUser = { 
        username: 'testuser', 
        _id: 'userId' 
      };
      const mockPosts = [
        { _id: 'post1', author: 'testuser' },
        { _id: 'post2', author: 'testuser' }
      ];
      mockReq.params = { username: 'testuser' };

      UserModel.findOne = vi.fn().mockResolvedValue(mockUser);
      PostModel.find = vi.fn().mockResolvedValue(mockPosts);

      // act
      await userController.getPostsByUsername(mockReq, mockRes, mockNext);

      // assert
      expect(UserModel.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(PostModel.find).toHaveBeenCalledWith({ author: 'testuser' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPosts);
    });

    it('should return 404 if user not found', async () => {
      // arrange
      mockReq.params = { username: 'nonexistentuser' };
      UserModel.findOne = vi.fn().mockResolvedValue(null);

      // act
      await userController.getPostsByUsername(mockReq, mockRes, mockNext);

      // assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
});