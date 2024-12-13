import { describe, it, expect, vi } from 'vitest';
import * as postController from '../controllers/postController';
import PostModel from '../models/Posts';
import UserModel from '../models/Users';
import LikeModel from '../models/Likes';
import DislikeModel from '../models/Dislikes';
import CommentModel from '../models/Comments';


vi.mock('../models/Posts');
vi.mock('../models/Users');
vi.mock('../models/Likes');
vi.mock('../models/Dislikes');
vi.mock('../models/Comments');

describe('PostController', () => {
  // mocking express req and res objects
  const mockReq = {
    session: { username: 'testuser' },
    body: {},
    params: {}
  };
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  };

  describe('createPost', () => {
    it('should create a new post successfully', async () => {
      // arrange
      const postData = {
        text: 'Test post',
        media: ['test-media.jpg'],
        hashtags: ['#test']
      };
      mockReq.body = postData;

      const mockSavedPost = {
        _id: 'mockPostId',
        ...postData,
        author: 'testuser',
        datetime: expect.any(Date)
      };

      const mockUpdatedUser = {
        username: 'testuser',
        posts: ['mockPostId']
      };

      PostModel.prototype.save = vi.fn().mockResolvedValue(mockSavedPost);
      UserModel.findOneAndUpdate = vi.fn().mockResolvedValue(mockUpdatedUser);

      // act
      await postController.createPost(mockReq, mockRes);

      // assert
      expect(PostModel.prototype.save).toHaveBeenCalled();
      expect(UserModel.findOneAndUpdate).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockSavedPost);
    });

    it('should handle errors when creating a post', async () => {
      // arrange
      mockReq.body = {};
      PostModel.prototype.save = vi.fn().mockRejectedValue(new Error('Save failed'));

      // act
      await postController.createPost(mockReq, mockRes);

      // assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error creating post' });
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      // arrange
      mockReq.params.postId = 'testPostId';
      mockReq.body.username = 'testuser';

      const mockPost = {
        _id: 'testPostId',
        author: 'testuser'
      };

      PostModel.findById = vi.fn().mockResolvedValue(mockPost);
      PostModel.findByIdAndDelete = vi.fn().mockResolvedValue(mockPost);

      // act
      await postController.deletePost(mockReq, mockRes);

      // assert
      expect(PostModel.findById).toHaveBeenCalledWith('testPostId');
      expect(PostModel.findByIdAndDelete).toHaveBeenCalledWith('testPostId');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' });
    });

    it('should return 404 if post not found', async () => {
      // arrange
      mockReq.params.postId = 'nonexistentPostId';
      mockReq.body.username = 'testuser';

      PostModel.findById = vi.fn().mockResolvedValue(null);

      // act
      await postController.deletePost(mockReq, mockRes);

      // assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });
  });

  describe('addLike', () => {
    it('should add a like to a post', async () => {
      // arrange
      mockReq.params.postId = 'testPostId';
      mockReq.body.username = 'testuser';

      const mockPost = { _id: 'testPostId' };
      const mockLikeEntry = {
        postId: 'testPostId',
        accounts_that_liked: [],
        save: vi.fn()
      };

      PostModel.findById = vi.fn().mockResolvedValue(mockPost);
      LikeModel.findOne = vi.fn().mockResolvedValue(null);
      LikeModel.create = vi.fn().mockResolvedValue(mockLikeEntry);

      // act
      await postController.addLike(mockReq, mockRes);

      // assert
      expect(PostModel.findById).toHaveBeenCalledWith('testPostId');
      expect(LikeModel.create).toHaveBeenCalledWith({
        postId: 'testPostId',
        accounts_that_liked: ['testuser']
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post liked successfully' });
    });

    it('should toggle like if user has already liked', async () => {
      // arrange
      mockReq.params.postId = 'testPostId';
      mockReq.body.username = 'testuser';

      const mockPost = { _id: 'testPostId' };
      const mockLikeEntry = {
        postId: 'testPostId',
        accounts_that_liked: ['testuser'],
        save: vi.fn()
      };

      PostModel.findById = vi.fn().mockResolvedValue(mockPost);
      LikeModel.findOne = vi.fn().mockResolvedValue(mockLikeEntry);

      // act
      await postController.addLike(mockReq, mockRes);

      // assert
      expect(mockLikeEntry.accounts_that_liked).toEqual([]);
      expect(mockLikeEntry.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post liked successfully' });
    });
  });
});