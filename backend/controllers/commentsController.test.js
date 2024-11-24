

/* 
i think comments controller is outdated...

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as commentsController from '../controllers/commentsController';
import CommentModel from '../models/Comments.js';
import LikeModel from '../models/Likes';
import DislikeModel from '../models/Dislikes';

//mocking models
vi.mock('../models/Comments');
vi.mock('../models/Likes');
vi.mock('../models/Dislikes');

describe('Comments Controller', () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        //reset mocks
        vi.clearAllMocks();

        //setting up mock request and response
        mockRequest = {
            params: {},
            body: {}
        };

        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });

    describe('addComment', () => {
        it('should successfully add a reply to an existing comment', async () => {
            //arrange
            const commentId = 'comment123';
            const newReplyId = 'reply123';
            const replyData = {
                author: 'Test User',
                text: 'Test Reply'
            };

            mockRequest.params = { commentId };
            mockRequest.body = replyData;

            const mockComment = {
                _id: commentId,
                replies: [],
                save: vi.fn()
            };

            const mockNewReply = {
                _id: newReplyId,
                ...replyData,
                likes: [],
                dislikes: [],
                replies: [],
                save: vi.fn()
            };

            CommentModel.findById.mockResolvedValue(mockComment);
            CommentModel.mockImplementation(() => mockNewReply);

            //act
            await commentsController.addComment(mockRequest, mockResponse);

            //assert
            expect(CommentModel.findById).toHaveBeenCalledWith(commentId);
            expect(mockComment.replies).toContain(newReplyId);
            expect(mockComment.save).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Reply added successfully',
                reply: mockNewReply
            });
        });

        it('should return 404 when a comment is not found', async () => {
            //arrange
            mockRequest.params = { commentId : 'nonexistent' };
            CommentModel.findById.mockResolvedValue(null);

            //act
            await commentsController.addComment(mockRequest, mockResponse);

            //assert
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Comment not found'
            });
        });
    });

    describe('getComments', () => {
        it('should successfully retrieve replies for a comment', async () => {
            //arrange
            const commentId = 'comment123';
            const mockReplies = [
                { _id: 'reply1', text: 'Reply 1' },
                { _id: 'reply2', text: 'Reply 2' }
            ];

            mockRequest.params = { commentId };

            const mockComment = {
                _id: commentId,
                replies: mockReplies
            };

            CommentModel.findById.mockReturnValue({
                populate: vi.fn().mockResolvedValue(mockComment)
            });

            //act
            await commentsController.getComments(mockRequest, mockResponse);

            //assert
            expect(CommentModel.findById).toHaveBeenCalledWith(commentId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockReplies);
        });

        it('should return 404 when a comment is not found', async () => {
            //arrange
            mockRequest.params = { commentId: 'nonexistent' };
            CommentModel.findById.mockResolvedValue(null);

            //act
            await commmentsController.addComment(mockRequest, mockResponse);

            //assert
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Comment not found'
            });
        });
    });

    describe('getComments', () => {
        it('should successfully retrive replies for a comment', async () => {
            //arrange
            const commentId = 'comment123';
            const mockReplies = [
                { _id: 'reply1', text: 'Reply1' },
                { _id: 'reply2', text: 'Reply2' }
            ];

            mockRequest.params = { commentId };

            const mockComment = {
                _id: commentId,
                replies: mockReplies
            };

            CommentModel.findById.mockReturnValue({
                populate: vi.fn().mockResolvedValue(mockComment)
            });

            //act
            await commentsController.getComments(mockRequest, mockResponse);

            //assert
            expect(CommentModel.findById).toHaveBeenCalledWith(commentId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockReplies);
        });

        it('should return 404 when comment is not found', async () => {
            //arrange
            mockRequest.params = { commentId: 'nonexistent' };
            CommentModel.findById.mockReturnValue({
                populate: vi.fn().mockResolvedValue(null)
            });

            //act
            await commentsController.getComments(mockRequest, mockResponse);

            //assert
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Comment not found'
            });
        });
    });

    describe('addLike', () => {
        it('should successfully add a like to a comment', async () => {
            //arrange
            const commentId = 'comment123';
            const userId = 'user123';

            mockRequest.params = { commentId };
            mockRequest.body = { userId };

            CommentModel.findById.mockResolvedValue({ _id: commentId });
            LikeModel.findOne.mockResolvedValue(null);
            LikeModel.create.mockResolvedValue({
                comment: commentId,
                accounts_that_liked: [userId]
            });

            //act
            await commentsController.addLike(mockRequest, mockResponse);

            //assert
            expect(LikeModel.create).toHaveBeenCalledWith({
                comment: commentId,
                accounts_that_liked: [userId]
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Comment liked successfully'
            });
        });

        it('should prevent duplicate likes from the same user', async () => {
            //arrange
            const commentId = 'comment123';
            const userId = 'user123';

            mockRequest.params = { commentId };
            mockRequest.body = { userId };

            CommentModel.findById.mockResolvedValue({ _id: commentId });
            LikeModel.findOne.mockResolvedValue({
                comment: commentId,
                accounts_that_liked: [userId]
            });

            //act
            await commentsController.addLike(mockRequest, mockResponse);

            //assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'You have already liked this comment'
            });
        });
    });


    describe('addDislike', () => {
        it('should successfully add a dislike to a comment', async () => {
            //arrange
            const commentid = 'comment123';
            const userId = 'user123';

            mockRequest.params = { commentId };
            mockRequest.body = { userId };

            CommentModel.findById.mockResolvedValue({ _id: commentId });
            DislikeModel.findOne.mockResolvedValue(null);
            DislikeModel.create.mockResolvedValue({
                comment: commentId,
                accounts_that_disliked: [userId]
            });

            //act
            await commentsController.addDislike(mockRequest, mockResponse);

            //assert
            expect(DislikeModel.create).toHaveBeenCalledWith({
                comment: commentId,
                accounts_that_disliked: [userId]
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Comment disliked successfully'
            });
        });

        it('should prevent duplicate dislikes from the same user', async () => {
            //arrange
            const commentId = 'comment123';
            const userId = 'user123';

            mockRequest.params = { commentId };
            mockRequest.body = { userId };

            CommentModel.findByid.mockResolvedValue({ _id: commentId });
            DislikeModel.findOne.mockResolvedValue({
                comment: commentId,
                accounts_that_disliked: [userId]
            });

            //act
            await commentsController.addDislike(mockRequest, mockResponse);

            //assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'You have already disliked this comment'
            });
        });
    });
});
*/