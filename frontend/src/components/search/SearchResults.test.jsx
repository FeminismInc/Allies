import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchResults from './SearchResults';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { it, describe, expect, vi, beforeEach } from 'vitest';

// Mock axios
vi.mock('axios');

describe('SearchResults Component', () => {
  const username = 'testuser';
  const handle = 'testhandle';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render user information and follow button', () => {
    // Arrange & Act
    render(
      <MemoryRouter>
        <SearchResults username={username} handle={handle} isFollowing={false} />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByText(`@${handle}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
  });

  it('should display "Following" if the user is initially following', () => {
    // Arrange & Act
    render(
      <MemoryRouter>
        <SearchResults username={username} handle={handle} isFollowing={true} />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
  });

  it('should call API and update state when "Follow" button is clicked', async () => {
    // Arrange
    axios.post.mockResolvedValueOnce({ data: { message: 'Followed successfully' } });

    render(
      <MemoryRouter>
        <SearchResults username={username} handle={handle} isFollowing={false} />
      </MemoryRouter>
    );

    // Act
    const followButton = screen.getByRole('button', { name: /follow/i });
    fireEvent.click(followButton);

    // Assert
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`http://localhost:5050/api/users/addFollower`, { username });
      expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
    });
  });

  it('should call API and update state when "Following" button is clicked', async () => {
    // Arrange
    axios.post.mockResolvedValueOnce({ data: { message: 'Unfollowed successfully' } });

    render(
      <MemoryRouter>
        <SearchResults username={username} handle={handle} isFollowing={true} />
      </MemoryRouter>
    );

    // Act
    const followButton = screen.getByRole('button', { name: /following/i });
    fireEvent.click(followButton);

    // Assert
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`http://localhost:5050/api/users/removeFollowing`, { username });
      expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    axios.post.mockRejectedValueOnce(new Error('Failed to follow'));

    render(
      <MemoryRouter>
        <SearchResults username={username} handle={handle} isFollowing={false} />
      </MemoryRouter>
    );

    // Act
    const followButton = screen.getByRole('button', { name: /follow/i });
    fireEvent.click(followButton);

    // Assert
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`http://localhost:5050/api/users/addFollower`, { username });
      // Ensure the button state doesn't change
      expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
    });
  });
});
