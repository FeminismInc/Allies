import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CommentComponent from './CommentComponent';
import axios from 'axios';
import { it, describe, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock axios
vi.mock('axios');

// Helper to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

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
    renderWithRouter(<CommentComponent comment={mockComment} username={username} />);

    expect(screen.getByText(mockComment.author)).toBeInTheDocument();
    expect(screen.getByText(new Date(mockComment.datetime).toLocaleString())).toBeInTheDocument();
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(screen.getByText(/0 likes/i)).toBeInTheDocument();
    expect(screen.getByText(/0 dislikes/i)).toBeInTheDocument();
  });
  

  it('should display the profile picture if available', async () => {
    axios.get.mockResolvedValueOnce({ data: { profilePicture: 'http://example.com/profile.jpg' } });

    renderWithRouter(<CommentComponent comment={mockComment} username={username} />);

    await waitFor(() => {
      const profileImage = screen.getByAltText('Comment');
      expect(profileImage).toBeInTheDocument();
      expect(profileImage).toHaveAttribute('src', 'http://example.com/profile.jpg');
    });
  });

  it('should use default icon if no profile picture is available', async () => {
    axios.get.mockResolvedValueOnce({ data: { profilePicture: null } });

    renderWithRouter(<CommentComponent comment={mockComment} username={username} />);

    await waitFor(() => {
      const defaultIcon = screen.getByTestId('AccountCircleOutlinedIcon');
      expect(defaultIcon).toBeInTheDocument();
    });
  });

  it('should fetch and filter comment text', async () => {
    renderWithRouter(<CommentComponent comment={mockComment} username={username} />);

    const filteredText = screen.getByText('This is a test comment'); // Assuming no profanity
    expect(filteredText).toBeInTheDocument();
  });

  it('should fetch likes and dislikes on mount', async () => {
    axios.get.mockResolvedValueOnce({ data: ['user1', 'user2'] }); // Likes
    axios.get.mockResolvedValueOnce({ data: ['user3'] }); // Dislikes

    renderWithRouter(<CommentComponent comment={mockComment} username={username} />);

    await waitFor(() => {
      expect(screen.getByText(/1 likes/i)).toBeInTheDocument();
      expect(screen.getByText(/0 dislikes/i)).toBeInTheDocument();
    });
  });

  it('should handle like button click and update likes', async () => {
    axios.post.mockResolvedValueOnce({ message: 'Liked successfully' });
    axios.get.mockResolvedValueOnce({ data: ['user1', 'user2', username] }); // Updated likes
  
    renderWithRouter(<CommentComponent comment={mockComment} username={username} />);
  
    const likeButton = screen.getByRole('button', { name: /thumb up/i });
    fireEvent.click(likeButton);
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `http://localhost:5050/api/comments/addLike/${mockComment._id}`,
        { username }
      );
      expect(screen.getByText((content) => content.includes('0 likes'))).toBeInTheDocument();
    });
  });

  it('should handle dislike button click and update dislikes', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Disliked successfully' } });
    axios.get.mockResolvedValueOnce({ data: ['user3', username] });

    renderWithRouter(<CommentComponent comment={mockComment} username={username} />);

    // const dislikeButton = screen.getByRole('button', { name: /thumb down/i });
    const dislikeButton = screen.getByLabelText('thumb down');
    fireEvent.click(dislikeButton);


    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `http://localhost:5050/api/comments/addDislike/${mockComment._id}`,
        { username }
      );
      expect(screen.getByText(/1 dislikes/i)).toBeInTheDocument();
    });
  });

  it('should toggle like box visibility when clicked', async () => {
    renderWithRouter(<CommentComponent comment={mockComment} username={username} />);

    const likeCount = screen.getByText(/0 likes/i);
    fireEvent.click(likeCount);

    await waitFor(() => {
      expect(screen.getByText('Accounts that liked')).toBeInTheDocument();
    });
  });

  it('should toggle dislike box visibility when clicked', async () => {
    renderWithRouter(<CommentComponent comment={mockComment} username={username} />);

    const dislikeCount = screen.getByText(/0 dislikes/i);
    fireEvent.click(dislikeCount);

    await waitFor(() => {
      expect(screen.getByText('Accounts that disliked')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch likes/dislikes'));

    renderWithRouter(<CommentComponent comment={mockComment} username={username} />);

    await waitFor(() => {
      expect(screen.getByText(/0 likes/i)).toBeInTheDocument();
      expect(screen.getByText(/0 dislikes/i)).toBeInTheDocument();
    });
  });
});
