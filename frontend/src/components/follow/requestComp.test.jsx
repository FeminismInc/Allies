import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RequestCard from './requestComp';
import axios from 'axios';

vi.mock('axios');

describe('RequestCard Component', () => {
  const mockUserID = '12345';
  const mockUsername = 'testuser';
  const mockUri = process.env.REACT_APP_URI;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and displays the username on mount', async () => {
    axios.get.mockResolvedValueOnce({ data: { username: mockUsername } });

    render(<RequestCard userID={mockUserID} />);

    // Ensure username is fetched and displayed
    await waitFor(() => expect(screen.getByText(mockUsername)).toBeInTheDocument());

    // Ensure axios called with correct endpoint
    expect(axios.get).toHaveBeenCalledWith(`${mockUri}/users/findUserById/${mockUserID}`);
  });

  it('renders accept and decline buttons', async () => {
    axios.get.mockResolvedValueOnce({ data: { username: mockUsername } });

    render(<RequestCard userID={mockUserID} />);

    await waitFor(() => {
      expect(screen.getByText('"Accept"')).toBeInTheDocument();
      expect(screen.getByText('"Decline"')).toBeInTheDocument();
    });
  });

  it('handles accept action correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: { username: mockUsername } });
    axios.post.mockResolvedValueOnce({ data: 'Success' });

    render(<RequestCard userID={mockUserID} />);

    // Wait for username to be displayed
    await waitFor(() => expect(screen.getByText(mockUsername)).toBeInTheDocument());

    // Click accept button
    fireEvent.click(screen.getByText('"Accept"'));

    // Ensure the component disappears
    await waitFor(() => expect(screen.queryByText(mockUsername)).not.toBeInTheDocument());

    // Ensure axios called with correct endpoint
    expect(axios.post).toHaveBeenCalledWith(`${mockUri}/users/acceptFollowRequest`, { username: mockUsername });
  });

  it('handles decline action correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: { username: mockUsername } });
    axios.post.mockResolvedValueOnce({ data: 'Success' });

    render(<RequestCard userID={mockUserID} />);

    // Wait for username to be displayed
    await waitFor(() => expect(screen.getByText(mockUsername)).toBeInTheDocument());

    // Click decline button
    fireEvent.click(screen.getByText('"Decline"'));

    // Ensure the component disappears
    await waitFor(() => expect(screen.queryByText(mockUsername)).not.toBeInTheDocument());

    // Ensure axios called with correct endpoint
    expect(axios.post).toHaveBeenCalledWith(`${mockUri}/users//removeFollowRequest`, { username: mockUsername });
  });

  it('handles fetch error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<RequestCard userID={mockUserID} />);

    // Ensure username is not displayed due to error
    await waitFor(() => expect(screen.queryByText(mockUsername)).not.toBeInTheDocument());

    // Ensure error logged in console (optional: mock console.error for validation)
    expect(axios.get).toHaveBeenCalledWith(`${mockUri}/users/findUserById/${mockUserID}`);
  });
});
