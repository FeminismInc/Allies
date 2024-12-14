import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileTabs from './ProfileTabs';
import UserPost from '../../components/post/userPost';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { it, vi, describe, beforeEach, expect } from 'vitest';

// Mock axios and child components
vi.mock('axios');
vi.mock('../../components/post/userPost', () => ({
  __esModule: true,
  default: vi.fn(() => <div>Mocked UserPost</div>),
}));

describe('ProfileTabs Component', () => {
  const routeUsername = 'testuser';
  const username = 'loggedInUser';
  const mockPosts = [
    { id: 1, author: 'testuser', datetime: '2023-11-23T12:00:00Z', text: 'Test Post 1' },
    { id: 2, author: 'testuser', datetime: '2023-11-23T14:00:00Z', text: 'Test Post 2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the "posts" tab as active by default and fetch posts', async () => {
    // Arrange
    axios.get.mockResolvedValueOnce({ data: mockPosts });

    // Act
    render(
      <MemoryRouter>
        <ProfileTabs routeUsername={routeUsername} username={username} />
      </MemoryRouter>
    );

    // Assert the active tab
    const postsTab = screen.getByRole('button', { name: /posts/i });
    expect(postsTab).toHaveClass('active');

    // Wait for the fetch call
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:5050/api/users/getPosts/${routeUsername}`,
        expect.objectContaining({})
      );
    });

    // Ensure UserPost is rendered for each post
    expect(UserPost).toHaveBeenCalledTimes(mockPosts.length);
    expect(UserPost).toHaveBeenCalledWith(
      expect.objectContaining({ post: mockPosts[0], username }),
      {}
    );
    expect(UserPost).toHaveBeenCalledWith(
      expect.objectContaining({ post: mockPosts[1], username }),
      {}
    );
  });

  it('should display "No posts found" if there are no posts', async () => {
    // Arrange
    axios.get.mockResolvedValueOnce({ data: [] });

    // Act
    render(
      <MemoryRouter>
        <ProfileTabs routeUsername={routeUsername} username={username} />
      </MemoryRouter>
    );

    // Assert
    await waitFor(() => expect(screen.getByText('No posts found.')).toBeInTheDocument());
  });

  it('should fetch posts only when the "posts" tab is active', async () => {
    // Act
    render(
      <MemoryRouter>
        <ProfileTabs routeUsername={routeUsername} username={username} />
      </MemoryRouter>
    );

    const postsTab = screen.getByRole('button', { name: /posts/i });

    // Assert fetch call only on active tab
    expect(axios.get).toHaveBeenCalledTimes(1); // Only called initially
    fireEvent.click(postsTab);
    expect(axios.get).toHaveBeenCalledTimes(1); // No extra calls as tab is already active
  });

  it('should handle fetch errors gracefully', async () => {
    // Arrange
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    

    // Act
    render(
      <MemoryRouter>
        <ProfileTabs routeUsername={routeUsername} username={username} />
      </MemoryRouter>
    );

    // Assert
    await waitFor(() => expect(screen.getByText('No posts found.')).toBeInTheDocument());
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
