import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PostPage from './post'
import axios from 'axios'

// Mock axios
vi.mock('axios')

// Mock useNavigate hook
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate
}))

// Mock sidebar
vi.mock('../../components/sidebar/Sidebar', () => ({
    default: () => <div data-testid="sidebar">Sidebar</div>
}))

// Mock react-native Button
vi.mock('react-native', () => ({
    Button: ({ onPress, title }) => (
        <button onClick={onPress} data-testid="submit-button">
            {title}
        </button>
    )
}))

describe('PostPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the component with all required elements', () => {
        render(<PostPage />)
        expect(screen.getByText("What's on your mind?")).toBeInTheDocument()
        expect(screen.getByTestId('sidebar')).toBeInTheDocument()
        expect(screen.getByRole('textbox')).toBeInTheDocument()
        expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })

    it('updates text state when input value changes', () => {
        render(<PostPage />)
        const input = screen.getByRole('textbox')
        fireEvent.change(input, { target: { value: 'Test post content' } })
        expect(input.value).toBe('Test post content')
    })

    it('successfully creates a post and navigates to profile', async () => {
        const mockPost = { data: { success: true } }
        axios.post.mockResolvedValueOnce(mockPost)

        render(<PostPage />)
        const input = screen.getByRole('textbox')
        const submitButton = screen.getByTestId('submit-button')

        fireEvent.change(input, { target: { value: 'Test post content' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5050/api/posts/createPost',
                { text: 'Test post content' }
            )
            expect(mockNavigate).toHaveBeenCalledWith('/profile')
        })
    })

    it('handles post creation error well', async () => {
        const logs = []
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(msg => logs.push(msg))
        axios.post.mockRejectedValueOnce(new Error('Network error'))

        render(<PostPage />)
        const submitButton = screen.getByTestId('submit-button')
        //act
        fireEvent.click(submitButton)
        //assert
        await waitFor(() => {
            expect(logs).toContain('entered submit')
            expect(logs).toContain('trying')
            expect(logs.some(log => log.includes('Something went wrong with creating a post'))).toBe(true)
        })
        consoleSpy.mockRestore()
    })

    it('prevents default form submission behavior', async () => {
        render(<PostPage />)
        const preventDefault = vi.fn()
        const submitButton = screen.getByTestId('submit-button')

        fireEvent.click(submitButton, { preventDefault })

        await waitFor(() => {
            expect(preventDefault).toHaveBeenCalled()
        })
    })
})
