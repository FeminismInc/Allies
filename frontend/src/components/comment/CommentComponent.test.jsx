import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CommentComponent from './CommentComponent';
import axios from 'axios';
import { it, describe, expect, vi, beforeEach } from 'vitest';

// Mock axios
vi.mock('axios');

describe('CommentComponent', () => {
  const mockComment = {
    _id: '123',
    author: 'testauthor',
    datetime: '2023-11-25T12:00:00Z',
    text: 'This is a test comment',
  };
  const username = 'testuser';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the comment details', () => {
    // Arrange & Act
    render(<CommentComponent comment={mockComment} username={username} />);

    // Assert
    expect(screen.getByText(mockComment.author)).toBeInTheDocument();
    expect(screen.getByText(new Date(mockComment.datetime).toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(mockComment.text)).toBeInTheDocument();
    expect(screen.getByText(/0 likes/i)).toBeInTheDocument();
    expect(screen.getByText(/0 dislikes/i)).toBeInTheDocument();
  });

  it('should fetch likes and dislikes on mount', async () => {
    // Arrange
    axios.get.mockResolvedValueOnce({ data: { accounts_that_liked: ['user1', 'user2'] } });
    axios.get.mockResolvedValueOnce({ data: { accounts_that_disliked: ['user3'] } });

    // Act
    render(<CommentComponent comment={mockComment} username={username} />);

    // Assert
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:5050/api/comments/getCommentLikes/${mockComment._id}`,
        {}
      );
      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:5050/api/comments/getCommentDislikes/${mockComment._id}`,
        {}
      );
    });

    expect(screen.getByText(/2 likes/i)).toBeInTheDocument();
    expect(screen.getByText(/1 dislikes/i)).toBeInTheDocument();
  });

  it('should handle like button click and update likes', async () => {
    // Arrange
    axios.post.mockResolvedValueOnce({ data: { message: 'Liked successfully' } });
    axios.get.mockResolvedValueOnce({ data: { accounts_that_liked: ['user1', 'user2', 'testuser'] } });
  
    render(<CommentComponent comment={mockComment} username={username} />);
  
    // Act
    const buttons = screen.getAllByRole('button', { name: /like/i });
    const likeButton = buttons[0]; // Assuming the first "Like" button is the one to click
    fireEvent.click(likeButton);
  
    // Assert
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `http://localhost:5050/api/comments/addLike/${mockComment._id}`,
        { username }
      );
    });
  
    await waitFor(() => {
      expect(screen.getByText(/3 likes/i)).toBeInTheDocument();
    });
  });
  

  it('should handle dislike button click and update dislikes', async () => {
    // Arrange
    axios.post.mockResolvedValueOnce({ data: { message: 'Disliked successfully' } });
    axios.get.mockResolvedValueOnce({ data: { accounts_that_disliked: ['user3', 'testuser'] } });

    render(<CommentComponent comment={mockComment} username={username} />);

    // Act
    const dislikeButton = screen.getByRole('button', { name: /dislike/i });
    fireEvent.click(dislikeButton);

    // Assert
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `http://localhost:5050/api/comments/addDislike/${mockComment._id}`,
        { username }
      );
    });

    const dislikeText = await screen.findByText(/2 dislikes/i);
expect(dislikeText).toBeInTheDocument();
  });

  it('should toggle like box visibility when clicked', () => {

    // Arrange & Act
    render(<CommentComponent comment={mockComment} username={username} />);

    const likeCount = screen.getByText(/0 likes/i);
    fireEvent.click(likeCount);

    // Assert
    expect(screen.getByText('Accounts that liked')).toBeInTheDocument();
  });

  it('should toggle dislike box visibility when clicked', () => {
    // Arrange & Act
    render(<CommentComponent comment={mockComment} username={username} />);

    const dislikeCount = screen.getByText(/0 dislikes/i);
    fireEvent.click(dislikeCount);

    // Assert
    expect(screen.getByText('Accounts that disliked')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    axios.get.mockRejectedValue(new Error('Failed to fetch likes/dislikes'));

    render(<CommentComponent comment={mockComment} username={username} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/0 likes/i)).toBeInTheDocument();
      expect(screen.getByText(/0 dislikes/i)).toBeInTheDocument();
    });
  });
});
