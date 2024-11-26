import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Profile from './Profile'
import axios from 'axios'

// Mocking child components
vi.mock('../../components/sidebar/Sidebar', () => ({
    default: () => <div data-testid="sidebar">Sidebar component</div>
}))

vi.mock('./ProfileTabs', () => ({
    default: ({ username }) => <div data-testid="profile-tabs">Profile Tabs for {username}</div>
}))

vi.mock('./ProfileHeader', () => ({
    default: ({ username }) => <div data-testid="profile-header">Profile Header for {username}</div>
}))

// Mocking axios
vi.mock('axios')

describe('Profile Component', () => {
    const uri = 'http://localhost:5050/api'

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Initial Render', () => {
        it('renders the component with an initially empty username', () => {
            // Arrange
            axios.get.mockResolvedValueOnce({ data: { username: '' } })

            // Act
            render(<Profile />)

            // Assert
            expect(screen.getByTestId('sidebar')).toBeInTheDocument()
            expect(screen.getByTestId('profile-header')).toBeInTheDocument()
            expect(screen.getByTestId('profile-tabs')).toBeInTheDocument()
        })

        it('renders with proper CSS classes', () => {
            // Arrange
            axios.get.mockResolvedValueOnce({ data: { username: '' } })

            // Act
            const { container } = render(<Profile />)

            // Assert
            expect(container.querySelector('.profileMainContent')).toBeInTheDocument()
            expect(container.querySelector('.sidebarContainer')).toBeInTheDocument()
            expect(container.querySelector('.profile-container')).toBeInTheDocument()
            expect(container.querySelector('.profile-tabs')).toBeInTheDocument()
        })
    })

    describe('API Integration', () => {
        it('successfully fetches and sets username', async () => {
            // Arrange
            const mockUsername = 'TestUser'
            axios.get.mockResolvedValueOnce({ data: { username: mockUsername } })

            // Act
            render(<Profile />)

            // Assert
            await waitFor(() => {
                expect(axios.get).toHaveBeenCalledWith(`${uri}/users/findUser`, { withCredentials: true })
                expect(screen.getByTestId('profile-header')).toHaveTextContent(`Profile Header for ${mockUsername}`)
                expect(screen.getByTestId('profile-tabs')).toHaveTextContent(`Profile Tabs for ${mockUsername}`)
            })
        })

        it('handles API errors well', async () => {
            // Arrange
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            const mockError = new Error('API Error')
            axios.get.mockRejectedValueOnce(mockError)

            // Act
            render(<Profile />)

            // Assert
            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Error fetching user:', mockError)
            })
            expect(screen.getByTestId('profile-header')).toHaveTextContent('Profile Header for')
            expect(screen.getByTestId('profile-tabs')).toHaveTextContent('Profile Tabs for')

            consoleSpy.mockRestore()
        })
    })

    describe('Child Component Integration', () => {
        it('passes username prop to child components', async () => {
            // Arrange
            const mockUsername = 'TestUser'
            axios.get.mockResolvedValueOnce({ data: { username: mockUsername } })

            // Act
            render(<Profile />)

            // Assert
            await waitFor(() => {
                const profileHeader = screen.getByTestId('profile-header')
                const profileTabs = screen.getByTestId('profile-tabs')

                expect(profileHeader).toHaveTextContent(mockUsername)
                expect(profileTabs).toHaveTextContent(mockUsername)
            })
        })
    })

    describe('useEffect Behavior', () => {
        it('makes an API call on initial render only', () => {
            // Arrange
            axios.get.mockResolvedValueOnce({ data: { username: 'TestUser' } })

            // Act
            render(<Profile />)

            // Assert
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith(`${uri}/users/findUser`, { withCredentials: true })
        })

        it('updates username state after successful API call', async () => {
            // Arrange
            const mockUsername = 'TestUser'
            axios.get.mockResolvedValueOnce({ data: { username: mockUsername } })

            // Act
            render(<Profile />)

            // Assert
            // It should be empty at the start
            expect(screen.getByTestId('profile-header')).toHaveTextContent('Profile Header for')
            // After API call
            await waitFor(() => {
                expect(screen.getByTestId('profile-header')).toHaveTextContent(`Profile Header for ${mockUsername}`)
            })
        })
    })
})
