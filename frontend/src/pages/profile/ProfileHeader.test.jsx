import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfileHeader from './ProfileHeader'
import axios from 'axios'
import { expect, it, vi } from 'vitest'
import { wait } from '@testing-library/user-event/dist/cjs/utils/index.js'

// Mocking axios
vi.mock('axios')

describe('ProfileHeader Component', () => {
    const username = 'testuser'

    beforeEach(() => {
        axios.get.mockReset()
    })

    it('should toggle the bio editing box when the edit bio button is clicked', () => {
        // Arrange
        render(<ProfileHeader username={username} />)
        const editBioButton = screen.getByRole('button', { name: /edit bio/i })

        // Act - Toggle on
        fireEvent.click(editBioButton)

        // Assert
        expect(screen.getByPlaceholderText(/write your bio here.../i)).toBeInTheDocument()

        // Act - Toggle off
        fireEvent.click(editBioButton)

        // Assert
        expect(screen.queryByPlaceholderText(/write your bio here.../i)).not.toBeInTheDocument()
    })

    it('should update the bio text when typing in the text box', () => {
        // Arrange
        render(<ProfileHeader username={username} />)
        fireEvent.click(screen.getByRole('button', { name: /edit bio/i }))
        const textbox = screen.getByPlaceholderText(/write your bio here.../i)

        // Act
        fireEvent.change(textbox, { target: { value: 'New bio text' } })
        
        // Assert
        expect(textbox.value).toBe('New bio text')
    })

    it('should toggle the settings box when clicking the settings button', () => {
        // Arrange
        render(<ProfileHeader username={username} />)
        const settingsButton = screen.getByRole('button', { name: /settings/i })

        // Act - Toggle on
        fireEvent.click(settingsButton)

        // Assert
        expect(screen.getByText(/settings/i)).toBeInTheDocument()

        // Act - Toggle off
        fireEvent.click(settingsButton)

        // Assert
        expect(screen.queryByText(/settings/i)).not.toBeInTheDocument()
    })

    it('should fetch and display followers when clicking the followers button', async () => {
        // Arrange
        axios.get.mockResolvedValueOnce({ data: { follower_accounts: [{ username: 'follower1' }] } })
        render(<ProfileHeader username={username} />)
        const followersButton = screen.getByRole('button', { name: /followers/i }) // Changed to getByRole

        // Act
        fireEvent.click(followersButton)

        // Assert
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith(`http://localhost:5050/api/users/followers/${username}`))
        await waitFor(() => expect(screen.getByText('follower1')).toBeInTheDocument())
    })

    it('should fetch and display following when clicking the following button', async () => {
        // Arrange
        // mock the axios call to return the expected data when calling the following endpoint
        axios.get.mockResolvedValueOnce({ data: { account_followed: [{ username: 'following1' }] } })

        //render the component with the username
        render(<ProfileHeader username={username} />)

        //get the following button and ensure it matches the button text or role
        const followingButton = screen.getByRole('button', { name: / following/i })

        //act click the following button to trigger the api call
        fireEvent.click(followingButton)

        //assert  ensure the correct api url was called for following
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith(`http://localhost:5050/api/users/following/${username}`))

        //assert ensure the ui updates to show following1
        await waitFor(() => expect(screen.getByText('following1')).toBeInTheDocument())
    })
})
