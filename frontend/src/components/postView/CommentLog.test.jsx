import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CommentLog from './Commentlog';
import axios from 'axios';
import { it, describe, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock axios
vi.mock('axios');

// Helper to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CommentLog', () => {
  const mockPostId = 'post123';
  const mockUsername = 'testuser';
  const mockMessage = 'Test comment message';
  const setMessage = vi.fn();
  const send = vi.fn();

  const mockComments = [
    {
      _id: 'comment1',
      author: 'user1',
      text: 'First comment',
      datetime: new Date().toISOString(),
    },
    {
      _id: 'comment2',
      author: 'user2',
      text: 'Second comment',
      datetime: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the CommentLog component with no comments', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    renderWithRouter(
      <CommentLog
        PostId={mockPostId}
        username={mockUsername}
        message=""
        setMessage={setMessage}
        send={send}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('No comments found.')).toBeInTheDocument();
    });
  });

  it('fetches and renders comments for a post', async () => {
    axios.get.mockResolvedValueOnce({ data: mockComments });

    renderWithRouter(
      <CommentLog
        PostId={mockPostId}
        username={mockUsername}
        message=""
        setMessage={setMessage}
        send={send}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
      expect(screen.getByText('Second comment')).toBeInTheDocument();
    });
  });

  it('allows the user to type a new comment', () => {
    renderWithRouter(
      <CommentLog
        PostId={mockPostId}
        username={mockUsername}
        message={mockMessage}
        setMessage={setMessage}
        send={send}
      />
    );

    const input = screen.getByPlaceholderText('Type your comment...');
    fireEvent.change(input, { target: { value: 'New comment' } });

    expect(setMessage).toHaveBeenCalledWith('New comment');
  });

  it('calls the send function when clicking the send button', () => {
    renderWithRouter(
      <CommentLog
        PostId={mockPostId}
        username={mockUsername}
        message={mockMessage}
        setMessage={setMessage}
        send={send}
      />
    );

    const sendButton = screen.getByLabelText('send-button');
    fireEvent.click(sendButton);

    expect(send).toHaveBeenCalled();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch comments'));

    renderWithRouter(
      <CommentLog
        PostId={mockPostId}
        username={mockUsername}
        message=""
        setMessage={setMessage}
        send={send}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('No comments found.')).toBeInTheDocument();
    });
  });
});
