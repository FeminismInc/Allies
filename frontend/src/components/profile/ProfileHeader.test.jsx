import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import ProfileHeader from './ProfileHeader';
import WithProfileEdit from './WithProfileEdit';
import ForOtherUser from './ForOtheruser';



import { useNavigate } from 'react-router-dom';

vi.mock('axios');
vi.mock('../follow/requestComp', () => ({
  default: ({ userID }) => <div data-testid="request-card">{userID}</div>,
}));

// Mock `useNavigate`
const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

describe('ProfileHeader Component', () => {
  const mockUsername = 'testuser';
  const mockRouteUsername = 'testuser2';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('WithProfileEdit Wrapper', () => {
    it('renders ProfileHeader with profile editing features', async () => {
      axios.get
        .mockResolvedValueOnce({ data: true }) // Privacy status
        .mockResolvedValueOnce({ data: ['user1', 'user2'] }); // Follow requests

      const WrappedHeader = WithProfileEdit(ProfileHeader);
      render(<WrappedHeader username={mockUsername} isCurrentUser />);

      expect(screen.getByRole('button', { name: 'Edit Bio' })).toBeInTheDocument();
      expect(screen.getByText('New Post')).toBeInTheDocument();
    });
  });

  describe('ForOtherUser Wrapper', () => {
    it('navigates to messages on message button click', () => {
      const WrappedHeader = ForOtherUser(ProfileHeader);
      render(<WrappedHeader routeUsername={mockRouteUsername} username={mockUsername} isCurrentUser={false} />);
      
      const messageButton = screen.getByLabelText('message-button');
      fireEvent.click(messageButton);
      expect(navigateMock).toHaveBeenCalledWith('/messages', { state: { routeUsername: mockRouteUsername } });
    });
  });

  describe('General Behavior', () => {
    it('fetches and displays the profile picture and bio', async () => {
      axios.get
        .mockResolvedValueOnce({ data: { profilePicture: 'https://mock-url.com/image.jpg' } }) // Profile picture
        .mockResolvedValueOnce({ data: 'Test bio' }); // Bio

      render(<ProfileHeader username={mockUsername} />);

      await waitFor(() => {
        expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'https://mock-url.com/image.jpg');
        expect(screen.getByText('Test bio')).toBeInTheDocument();
      });
    });
  });
});
