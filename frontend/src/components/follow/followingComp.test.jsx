import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import UserCard from './followingComp';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

vi.mock('axios');

describe('UserCard Component', () => {
  const mockUsername = 'testuser';
  const mockProfileImage = 'http://example.com/profile.jpg';
  const mockUri = process.env.REACT_APP_URI;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the username and default profile icon when no profile image exists', () => {
    render(
      <Router>
        <UserCard username={mockUsername} />
      </Router>
    );

    expect(screen.getByText(mockUsername)).toBeInTheDocument();
    expect(screen.getByTestId('AccountCircleOutlinedIcon')).toBeInTheDocument();
  });

  it('displays the profile image when available', async () => {
    axios.get.mockResolvedValueOnce({ data: { profilePicture: mockProfileImage } });

    render(
      <Router>
        <UserCard username={mockUsername} />
      </Router>
    );

    await waitFor(() => expect(screen.getByAltText('Profile')).toBeInTheDocument());
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', mockProfileImage);
  });

  it('toggles the follow/unfollow button text correctly', async () => {
    axios.post.mockResolvedValue({ data: 'Success' });

    render(
      <Router>
        <UserCard username={mockUsername} />
      </Router>
    );

    const button = screen.getByRole('button', { name: /following/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    await waitFor(() => expect(button).toHaveTextContent('Follow'));
    fireEvent.click(button);       // clicks again to toggle back

    await waitFor(() => expect(button).toHaveTextContent('Following'));
  });

  it('handles API errors gracefully when toggling follow status', async () => {
    axios.post.mockRejectedValueOnce(new Error('API Error'));

    render(
      <Router>
        <UserCard username={mockUsername} />
      </Router>
    );

    const button = screen.getByRole('button', { name: /following/i });
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument());
  });

  it('fetches the profile picture on mount', async () => {
    axios.get.mockResolvedValueOnce({ data: { profilePicture: mockProfileImage } });

    render(
      <Router>
        <UserCard username={mockUsername} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/users/getProfilePicture/${mockUsername}`)));
  });
});
