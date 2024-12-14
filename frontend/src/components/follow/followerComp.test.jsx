import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { vi } from 'vitest';
import FollowerCard from './followerComp';

// all pass
vi.mock('axios');

describe('FollowerCard Component', () => {
  const mockUsername = 'testuser';
const mockIsCurrentUser = 'true';
  const mockFollowerUser = 'followerUser';
  const mockProfileImage = 'http://example.com/profile.jpg';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the username and default profile icon when no profile image exists', () => {
    render(
      <Router>
        <FollowerCard followerUser={mockFollowerUser} username={mockUsername} />
      </Router>
    );
    expect(screen.getByText(mockFollowerUser)).toBeInTheDocument();
    expect(screen.getByTestId('AccountCircleOutlinedIcon')).toBeInTheDocument();
  });

  it('displays the profile image when available', async () => {
    axios.get.mockResolvedValueOnce({ data: { profilePicture: mockProfileImage } });

    render(
      <Router>
        <FollowerCard username={mockUsername} />
      </Router>
    );

    await waitFor(() => expect(screen.getByAltText('Profile')).toBeInTheDocument());
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', mockProfileImage);
  });

  it('toggles the follow/unfollow button text correctly', async () => {
    axios.post.mockResolvedValue({ data: 'Success' });

    render(
      <Router>
        <FollowerCard followerUser={mockFollowerUser} username={mockUsername} isCurrentUser={mockIsCurrentUser} />
      </Router>
    );

    const button = screen.getByRole('button', { name: /block/i });
    expect(button).toBeInTheDocument();

    //toggle follow status
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('UnBlock'));

    //clicks again to toggle back (do the same for follower comp)
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('Block'));
  });

  it('handles API errors gracefully when toggling follow status', async () => {
    axios.post.mockRejectedValueOnce(new Error('API Error'));

    render(
      <Router>
        <FollowerCard followerUser={mockFollowerUser} username={mockUsername} isCurrentUser={mockIsCurrentUser} />
      </Router>
    );

    const button = screen.getByRole('button', { name: /block/i });

    fireEvent.click(button);

    await waitFor(() => expect(screen.getByRole('button', { name: /block/i })).toBeInTheDocument());
  });

  it('fetches the profile picture on mount', async () => {
    axios.get.mockResolvedValueOnce({ data: { profilePicture: mockProfileImage } });

    render(
      <Router>
        <FollowerCard followerUser={mockFollowerUser} username={mockUsername} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/users/getProfilePicture/${mockFollowerUser}`)));
  });
});


