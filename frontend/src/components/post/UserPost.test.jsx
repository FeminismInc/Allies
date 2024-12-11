import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { vi } from 'vitest';
import UserPost from './userPost';
import { useNavigate } from "react-router-dom";


// Mock axios
vi.mock('axios');

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal(); // Import the actual module
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div>{children}</div>, // Mock BrowserRouter
    Link: ({ children }) => <div>{children}</div>, // Mock Link
    useNavigate: vi.fn(), // Mock useNavigate
  };
});
describe('UserPost Component', () => {
  const mockPost = { _id: '123', author: 'testauthor', text: 'Test post', repost: null };
  const username = 'testuser';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the post content correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: { profilePicture: 'url/to/profile-pic' } }); 
    axios.get.mockResolvedValueOnce({ data: ['user1', 'user2'] }); 
    axios.get.mockResolvedValueOnce({ data: [] }); 

    await act(async () => {
      render(
        <UserPost post={mockPost} username={username} />
      );
    });

    expect(screen.getByText(/Test post/i)).toBeInTheDocument();
    expect(screen.getByText(/2 likes/i)).toBeInTheDocument();
    expect(screen.getByText(/0 dislikes/i)).toBeInTheDocument();
  });

  it('should handle like button click and update likes', async () => {
    axios.get.mockResolvedValueOnce({ data: { profilePicture: 'url/to/profile-pic' } }); 
    axios.get.mockResolvedValueOnce({ data: ['user1', 'user2'] }); // Initial likes
    axios.get.mockResolvedValueOnce({ data: [] }); // Initial dislikes
    axios.post.mockResolvedValueOnce({}); // Like API mock
    axios.get.mockResolvedValueOnce({ data: ['user1', 'user2', 'testuser'] }); 

    await act(async () => {
      render(
        <UserPost post={mockPost} username={username} />
      );
    });

    const likeButton = screen.getByTestId('like-button');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(screen.getByText(/3 likes/i)).toBeInTheDocument();
    });
  });

  it('should handle dislike button click and update dislikes', async () => {
    axios.get.mockResolvedValueOnce({ data: { profilePicture: 'url/to/profile-pic' } }); 
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: ['user3'] }); 
    axios.post.mockResolvedValueOnce({}); 
    axios.get.mockResolvedValueOnce({ data: ['user3', 'testuser'] }); 

    await act(async () => {
      render(
        <UserPost post={mockPost} username={username} />
      );
    });

    const dislikeButton = screen.getByTestId('dislike-button');
    fireEvent.click(dislikeButton);

    await waitFor(() => {
      expect(screen.getByText(/2 dislikes/i)).toBeInTheDocument();
    });
  });

  it('should navigate to the comment view when the comment button is clicked', async () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    axios.get.mockResolvedValueOnce({ data: { profilePicture: 'url/to/profile-pic' } }); 
    axios.get.mockResolvedValueOnce({ data: [] }); 
    axios.get.mockResolvedValueOnce({ data: [] }); 

    await act(async () => {
      render(
        <UserPost post={mockPost} username={username} />
      );
    });

    const commentButton = screen.getByLabelText('Comment Icon Button');
    fireEvent.click(commentButton);

    expect(mockNavigate).toHaveBeenCalledWith('/PostView', { state: { post: mockPost } });
  });
});
