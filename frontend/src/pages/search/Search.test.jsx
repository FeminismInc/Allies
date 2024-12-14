import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SearchPage from './Search'
import axios from 'axios'
import { beforeEach, expect, it, vi, describe } from 'vitest'

// Mock axios
vi.mock('axios')

describe('SearchPage Component', () => {
    const mockUser = { _id: '1', username: 'testuser', handle: '@testuser' }
    const mockFollowers = [{ _id: '1', username: 'follower1' }]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render Sidebar and SearchBar components', () => {
        // Arrange and act
        render(
            <MemoryRouter>
                <SearchPage />
            </MemoryRouter>
        )

        // Assert
        expect(screen.getByText(/search/i)).toBeInTheDocument()
        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should set search query and fetch results', async () => {
        // Arrange
        axios.get.mockResolvedValueOnce({ data: { username: 'testuser' } })
        axios.post.mockResolvedValueOnce({ data: [mockUser] })
        axios.get.mockResolvedValueOnce({ data: { follower_accounts: mockFollowers } })

        render(
            <MemoryRouter>
                <SearchPage />
            </MemoryRouter>
        )
        const searchBarInput = screen.getByRole('textbox')

        // Act
        fireEvent.change(searchBarInput, { target: { value: 'test' } })
        fireEvent.keyDown(searchBarInput, { key: 'Enter', code: 'Enter' })

        // Assert
        await waitFor(() =>
            expect(axios.post).toHaveBeenCalledWith("http://localhost:5050/api/users/search", { username: 'test' })
        )
        await waitFor(() =>
            expect(axios.get).toHaveBeenCalledWith("http://localhost:5050/api/users/followers/testuser")
        )
        expect(screen.getByText('@testuser')).toBeInTheDocument()
    })

    it('should display no results found if no users match the search query', async () => {
        // Arrange
        axios.get.mockResolvedValueOnce({ data: { username: 'testuser' } })
        axios.post.mockResolvedValueOnce({ data: [] })

        render(
            <MemoryRouter>
                <SearchPage />
            </MemoryRouter>
        )
        const searchBarInput = screen.getByRole('textbox')

        // Act
        fireEvent.change(searchBarInput, { target: { value: 'unknown' } })
        fireEvent.keyDown(searchBarInput, { key: 'Enter', code: 'Enter' })

        // Assert
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                "http://localhost:5050/api/users/search",
                { username: 'unknown' }
            )
        })

        await waitFor(() =>
            expect(
                screen.getByText((content, element) =>
                    /no results found/i.test(content)
                )
            ).toBeInTheDocument()
        )
    })

    it('should correctly update results to indicate follow status', async () => {
        // Arrange
        axios.get.mockResolvedValueOnce({ data: { username: 'testuser' } })
        axios.post.mockResolvedValueOnce({ data: [mockUser] })
        axios.get.mockResolvedValueOnce({ data: { follower_accounts: [{ _id: '1' }] } })

        render(
            <MemoryRouter>
                <SearchPage />
            </MemoryRouter>
        )
        const searchBarInput = screen.getByRole('textbox')

        // Act
        fireEvent.change(searchBarInput, { target: { value: 'test' } })
        fireEvent.keyDown(searchBarInput, { key: 'Enter', code: 'Enter' })

        // Assert
        await waitFor(() => expect(screen.getByText('@testuser')).toBeInTheDocument())
        expect(screen.getByText('Following')).toBeInTheDocument()
    })

    it('should reset results when search query is empty', async () => {
        // Arrange
        render(
            <MemoryRouter>
                <SearchPage />
            </MemoryRouter>
        )
        const searchBarInput = screen.getByRole('textbox')

        // Act
        fireEvent.change(searchBarInput, { target: { value: '' } })

        // Assert
        expect(screen.queryByText('@testuser')).not.toBeInTheDocument()
        expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument()
    })
})
