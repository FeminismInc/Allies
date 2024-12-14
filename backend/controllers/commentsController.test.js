import { describe, it, expect, vi } from 'vitest';
import { addComment, getComments, getCommentLikes, getCommentDislikes, addLike, addDislike } from '../controllers/commentsController';
import CommentModel from '../models/Comments';
import LikeModel from '../models/Likes';
import DislikeModel from '../models/Dislikes';

vi.mock('../models/Comments');
vi.mock('../models/Likes');
vi.mock('../models/Dislikes');

describe('commentsController', () => {
  describe('addComment', () => {
    it('should add a reply to an existing comment', async () => {
        // arrange
        const req = {
          params: { commentId: 'comment123' },
          body: { author: 'User1', text: 'This is a reply' },
        };
        const res = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn(),
        };
        const mockComment = {
          _id: 'comment123',
          replies: [],
          save: vi.fn().mockResolvedValue({}),
        };
        CommentModel.findById = vi.fn().mockResolvedValue(mockComment);
      
        // act
        await addComment(req, res);
      
        // assert
        expect(CommentModel.findById).toHaveBeenCalledWith('comment123');
        expect(mockComment.replies).toHaveLength(1);
        expect(mockComment.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Reply added successfully' }));
      });
      

    it('should return 404 if comment does not exist', async () => {
      // arrange
      const req = { params: { commentId: 'nonexistent' }, body: {} };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      CommentModel.findById.mockResolvedValue(null);

      // act
      await addComment(req, res);

      // assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment not found' });
    });
  });

  describe('getComments', () => {
    it('should return all replies for a specific comment', async () => {
      // arrange
      const req = { params: { commentId: 'comment123' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockComment = { replies: ['reply1', 'reply2'] };
      CommentModel.findById.mockResolvedValue(mockComment);

      // act
      await getComments(req, res);

      // assert
      expect(CommentModel.findById).toHaveBeenCalledWith('comment123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockComment.replies);
    });

    it('should return 404 if comment does not exist', async () => {
      // arrange
      const req = { params: { commentId: 'nonexistent' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      CommentModel.findById.mockResolvedValue(null);

      // act
      await getComments(req, res);

      // assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment not found' });
    });
  });

  describe('addLike', () => {
    it('should add a like to a comment', async () => {
      // arrange
      const req = { params: { commentId: 'comment123' }, body: { username: 'User1' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockEntry = { accounts_that_liked: [], save: vi.fn() };
      CommentModel.findById.mockResolvedValue({});
      LikeModel.findOne.mockResolvedValue(mockEntry);

      // act
      await addLike(req, res);

      // assert
      expect(LikeModel.findOne).toHaveBeenCalledWith({ postId: 'comment123' });
      expect(mockEntry.accounts_that_liked).toContain('User1');
      expect(mockEntry.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment liked successfully' });
    });

    it('should toggle like if already liked', async () => {
      // arrange
      const req = { params: { commentId: 'comment123' }, body: { username: 'User1' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockEntry = { accounts_that_liked: ['User1'], save: vi.fn() };
      CommentModel.findById.mockResolvedValue({});
      LikeModel.findOne.mockResolvedValue(mockEntry);

      // act
      await addLike(req, res);

      // assert
      expect(mockEntry.accounts_that_liked).not.toContain('User1');
      expect(mockEntry.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment liked successfully' });
    });
  });

  describe('getCommentLikes', () => {
    it('should return likes for a specific comment', async () => {
      // arrange
      const req = { params: { commentId: 'comment123' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockLikes = { postId: 'comment123', accounts_that_liked: ['User1', 'User2'] };
      CommentModel.findById.mockResolvedValue({});
      LikeModel.findOne.mockResolvedValue(mockLikes);

      // act
      await getCommentLikes(req, res);

      // assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLikes);
    });

    it('should return message if no likes exist', async () => {
      // arrange
      const req = { params: { commentId: 'comment123' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      CommentModel.findById.mockResolvedValue({});
      LikeModel.findOne.mockResolvedValue(null);

      // act
      await getCommentLikes(req, res);

      // assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'comment does not contain likes' });
    });
  });

  describe('getCommentDislikes', () => {
    it('should return dislikes for a specific comment', async () => {
      // arrange
      const req = { params: { commentId: 'comment123' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockDislikes = { postId: 'comment123', accounts_that_disliked: ['User1', 'User2'] };
      CommentModel.findById.mockResolvedValue({});
      DislikeModel.findOne.mockResolvedValue(mockDislikes);

      // act
      await getCommentDislikes(req, res);

      // assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDislikes);
    });

    it('should return message if no dislikes exist', async () => {
      // arrange
      const req = { params: { commentId: 'comment123' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      CommentModel.findById.mockResolvedValue({});
      DislikeModel.findOne.mockResolvedValue(null);

      // act
      await getCommentDislikes(req, res);

      // assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'comment does not contain dislikes' });
    });
  });

  describe('addDislike', () => {
    it('should add a dislike to a comment', async () => {
      // arrange
      const req = { params: { commentId: 'comment123' }, body: { username: 'User1' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockEntry = { accounts_that_disliked: [], save: vi.fn() };
      CommentModel.findById.mockResolvedValue({});
      DislikeModel.findOne.mockResolvedValue(mockEntry);

      // act
      await addDislike(req, res);

      // assert
      expect(DislikeModel.findOne).toHaveBeenCalledWith({ postId: 'comment123' });
      expect(mockEntry.accounts_that_disliked).toContain('User1');
      expect(mockEntry.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'comment disliked successfully' });
    });

    it('should toggle dislike if already disliked', async () => {
      // arrange
      const req = { params: { commentId: 'comment123' }, body: { username: 'User1' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockEntry = { accounts_that_disliked: ['User1'], save: vi.fn() };
      CommentModel.findById.mockResolvedValue({});
      DislikeModel.findOne.mockResolvedValue(mockEntry);

      // act
      await addDislike(req, res);

      // assert
      expect(mockEntry.accounts_that_disliked).not.toContain('User1');
      expect(mockEntry.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'comment disliked successfully' });
    });
  });
});
