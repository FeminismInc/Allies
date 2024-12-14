import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import SearchResults from './SearchResults';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('axios');

describe('SearchResults Component', () => {
    const mockUsername = 'testuser';
    const mockHandle = 'testhandle';
    const mockProfilePicture = 'https://mock-url.com/image.jpg';
    const mockUri = process.env.REACT_APP_URI;

    beforeEach(() => {
        axios.get.mockReset();
        axios.post.mockReset();
    });

    const renderComponent = (initialIsFollowing = false, initialIsRequested = false, publicBoolean = true) => {
        axios.get
            .mockResolvedValueOnce({ data: { profilePicture: mockProfilePicture } }) // Mock profile picture response
            .mockResolvedValueOnce({ data: { public_boolean: publicBoolean } }); // Mock publicBoolean response

        render(
            <BrowserRouter>
                <SearchResults
                    username={mockUsername}
                    handle={mockHandle}
                    isFollowing={initialIsFollowing}
                    isRequested={initialIsRequested}
                />
            </BrowserRouter>
        );
    };

    it('renders the username and handle correctly', async () => {
        renderComponent();

        expect(screen.getByText(mockUsername)).toBeInTheDocument();
        expect(screen.getByText(`@${mockHandle}`)).toBeInTheDocument();
    });

    it('fetches and displays the profile picture', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByAltText('Profile')).toHaveAttribute('src', mockProfilePicture);
        });
    });

    it('shows "Follow" for a non-following user with public profile', async () => {
        renderComponent(false, false, true);

        await waitFor(() => {
            expect(screen.getByText('Follow')).toBeInTheDocument();
        });
    });

    it('shows "Requested" for a non-following user with private profile and a sent request', async () => {
        renderComponent(false, true, false);

        await waitFor(() => {
            expect(screen.getByText('Requested')).toBeInTheDocument();
        });
    });

    it('shows "Following" for a following user', async () => {
        renderComponent(true);

        await waitFor(() => {
            expect(screen.getByText('Following')).toBeInTheDocument();
        });
    });

    it('handles follow and unfollow button clicks for public user', async () => {
        renderComponent(false, false, true);

        const followButton = await screen.findByText('Follow');

        // Mock follow API response
        axios.post.mockResolvedValueOnce({ data: { success: true } });

        fireEvent.click(followButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(`${mockUri}/users/addFollower`, { username: mockUsername });
            expect(screen.getByText('Following')).toBeInTheDocument();
        });

        // Mock unfollow API response
        axios.post.mockResolvedValueOnce({ data: { success: true } });

        fireEvent.click(screen.getByText('Following'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(`${mockUri}/users/removeFollowing`, { username: mockUsername });
            expect(screen.getByText('Follow')).toBeInTheDocument();
        });
    });

    it('handles follow request button clicks for private user', async () => {
        renderComponent(false, false, false);

        const followButton = await screen.findByText('Follow');

        // Mock follow request API response
        axios.post.mockResolvedValueOnce({ data: { success: true } });

        fireEvent.click(followButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(`${mockUri}/users/sendFollowRequest`, { username: mockUsername });
            expect(screen.getByText('Requested')).toBeInTheDocument();
        });

        // Mock remove follow request API response
        axios.post.mockResolvedValueOnce({ data: { success: true } });

        fireEvent.click(screen.getByText('Requested'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(`${mockUri}/users/removeFollowRequest`, { username: mockUsername });
            expect(screen.getByText('Follow')).toBeInTheDocument();
        });
    });

    it('shows "Loading..." while fetching public status', async () => {
        renderComponent();

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });
    });

    it('displays fallback icon if no profile picture is available', async () => {
        axios.get
            .mockResolvedValueOnce({ data: { profilePicture: null } })
            .mockResolvedValueOnce({ data: { public_boolean: true } });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('AccountCircleOutlinedIcon')).toBeInTheDocument();
        });
    });

    it('handles errors gracefully', async () => {
        axios.get.mockRejectedValue(new Error('Failed to fetch profile picture'));
        axios.get.mockRejectedValueOnce(new Error('Failed to fetch privacy status'));

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Follow')).toBeInTheDocument(); // Defaults to public profile behavior
        });
    });
});
