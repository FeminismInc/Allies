import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfileTabs from './ProfileTabs'
import axios from 'axios'
import { it, vi } from 'vitest'

//mock axios
vi.mock('axios')

describe('ProfileTabs Component', () => {
    const username = 'testuser'

    beforeEach(() => {
        axios.get.mockReset();
    })

    it('should set "posts" tab as active by default and fetch posts', async () => {
        //arrange
        axios.get.mockResolvedValueOnce({ data: [{ author: 'testuser', datetime: new Date().toISOString(), text: 'Test post' }] })

        //act
        render(<ProfileTabs username={username} />)

        //assert
        expect(screen.getByRole('button', { name: /posts/i }).className).toContain('active')

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith(`http://localhost:5050/api/users/getPosts/${username}`))
        expect(screen.getByText('Test post')).toBeInTheDocument()
    })

    it('should display no posts found if there are no posts', async () => {
        //arrange
        axios.get.mockResolvedValueOnce({ data: [] })

        //act
        render(<ProfileTabs username={username} />)

        //assert
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith(`http://localhost:5050/api/users/getPosts/${username}`))
        expect(screen.getByText('No posts found.')).toBeInTheDocument()
    })

    it('should switch to media tab and render media content', () => {
        //arrange
        render(<ProfileTabs username={username} />)
        const mediaTab = screen.getByRole('button', { name: /media/i })

        //act
        fireEvent.click(mediaTab)

        //assert
        expect(mediaTab.className).toContain('active')
        expect(screen.getByText(/lex_the_cat/i)).toBeInTheDocument()
    })

    it('should switch to reposts tab and display the followers list', () => {
        //arrange
        render(<ProfileTabs username={username} />)
        const followersTab = screen.getByRole('button', { name: /reposts/i })

        //act
        fireEvent.click(followersTab)

        //assert
        expect(followersTab.className).toContain('active')
        expect(screen.getByText(/reposts/i)).toBeInTheDocument()
        expect(screen.getByText(/follower 1/i)).toBeInTheDocument()
        expect(screen.getByText(/follower 2/i)).toBeInTheDocument()
        expect(screen.getByText(/follower 3/i)).toBeInTheDocument()
    })

    it('should call fetchPostsByUsername only when the posts tab is active', async () => {
        //arrange
        axios.get.mockResolvedValueOnce({ data: [{ author: 'testuser', datetime: new Date().toISOString(), text: 'Test post'}] })
        render(<ProfileTabs username={username} />)

        //act 
        fireEvent.click(screen.getByRole('button', { name: /media/i }))
        fireEvent.click(screen.getByRole('button', { name: /reposts/i }))
        fireEvent.click(screen.getByRole('button', { name: /posts/i }))

        //assert
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith('http://localhost:5050/api/useres/getPosts/${username}'))
        expect(screen.getByText('Test post')).toBeInTheDocument()
    })
})