import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreatePostModal from './CreatePostModal';
import axios from 'axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('axios');

describe('CreatePostModal Component', () => {
    const mockCloseModal = vi.fn();
    const mockOnPostCreated = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the modal when `showModal` is true', () => {
        render(
            <CreatePostModal
                showModal={true}
                closeModal={mockCloseModal}
                onPostCreated={mockOnPostCreated}
                username="testuser"
            />
        );

        expect(screen.getByText("What's on your mind?")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('does not render the modal when `showModal` is false', () => {
        render(
            <CreatePostModal
                showModal={false}
                closeModal={mockCloseModal}
                onPostCreated={mockOnPostCreated}
                username="testuser"
            />
        );

        expect(screen.queryByText("What's on your mind?")).not.toBeInTheDocument();
    });

    it('calls `closeModal` when the Cancel button is clicked', () => {
        render(
            <CreatePostModal
                showModal={true}
                closeModal={mockCloseModal}
                onPostCreated={mockOnPostCreated}
                username="testuser"
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

        expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });

    it('submits the post', async () => {
        axios.post.mockResolvedValueOnce({});

        render(
            <CreatePostModal
                showModal={true}
                closeModal={mockCloseModal}
                onPostCreated={mockOnPostCreated}
                username="testuser"
            />
        );

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hello, world!' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/posts/createPost'), { text: 'Hello, world!' });
            expect(mockCloseModal).toHaveBeenCalledTimes(1);
            
        });
    });

    it('handles input changes correctly', () => {
        render(
            <CreatePostModal
                showModal={true}
                closeModal={mockCloseModal}
                onPostCreated={mockOnPostCreated}
                username="testuser"
            />
        );
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'New post content' } });

        expect(input.value).toBe('New post content');
    });

    it('handles submission errors gracefully', async () => {
        axios.post.mockRejectedValueOnce(new Error('Network error'));

        render(
            <CreatePostModal
                showModal={true}
                closeModal={mockCloseModal}
                onPostCreated={mockOnPostCreated}
                username="testuser"
            />
        );

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Error post' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/posts/createPost'), { text: 'Error post' });
            expect(mockCloseModal).not.toHaveBeenCalled();
            expect(mockOnPostCreated).not.toHaveBeenCalled();
        });
    });
});
