import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchPage from './Search'
import axios from 'axios'
import { beforeEach, expect, it, vi } from 'vitest'

//mock axios
vi.mock('axios')

describe('SearchPage Component', () => {
    const mockUser = { _id: '1', username: 'testuser', handle: '@testuser' }
    const mockFollowers = [{ _id: '1', username: 'follower1' }]

    beforeEach(() => {
        axios.get.mockReset()
        axios.post.mockReset()
    })

    it('should render Sidebar and SearchBar components', () => {
        // arrange and act
        render(<SearchPage />)

        //assert
        expect(screen.getByText(/search/i)).toBeInTheDocument()
        expect(scren.getByRole('textbox')).toBeInTheDocument()
    })

    it('should set search query and fetch results', async () => {
        //arrange
        axios.get.mockResolvedValueOnce({ data: { username: 'testuser' } })
        axios.post.mockResolvedValueOnce({ data: [mockUser ]})
        axios.get.mockResolvedValueOnce({ data: { follower_accounts: mockFollowers } })

        render(<SearchPage />)
        const searchBarInput = screen.getByRole('textbox')

        //act
        fireEvent.change(searchBarInput, { target: { value: 'test' } })
        fireEvent.keyDown(searchBarInput, { key: 'Enter', code: 'Enter' })

        //assert
        await waitFor(() => expect(axios.post).toHaveBeenCalledWith("http://localhost:5050/api/users/search", { username: 'test' }))
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith("http://localhost:5050/api/users/followers/testuser"))
        expect(screen.getByText('@testuser')).toBeInTheDocument()
    })

    it('should display no results found if no users match the search query', async () => {
        //arrange
        axios.get.mockResolvedValueOnce({ data: { username: 'testuser' } })
        axios.post.mockResolvedValueOnce({ data: [] })

        render(<SearchPage />)
        const searchBarInput = screen.getByRole('textbox')

        //act
        fireEvent.change(searchBarInput, { target: { value: 'unknown' } })
        fireEvent.keyDown(searchBarInput, { key: 'Enter', code: 'Enter' })

        //assert
        await waitFor(() => expect(axios.post).toHaveBeenCalledWith("http://localhost:5050/api/users/search", { username: 'unknown' }))
        expect(screen.getByText(/no results found/i)).toBeInTheDocument()
    })

    it('should correctly update results to indicate follow status', async () => {
        //arrange
        axios.get.mockResolvedValueOnce({ data: { username: 'testuser' } })
        axios.post.mockResolvedValueOnce({ data: [mockUser] })
        axios.get.mockResolvedValueOnce({ data: { follower_accounts: [{ _id: '1' }] } })

        render(<SearchPage />)
        const searchBarInput = screen.getByRole('textbox')

        //act
        fireEvent.change(searchBarInput, { target: { value: 'test' } })
        fireEvent.keyDown(searchBarInput, { key: 'Enter', code: 'Enter' })
        
        //assert
        await waitFor(() => expect(screen.getByText('@testuser')).toBeInTheDocument())
        expect(screen.getByText('Following')).toBeInTheDocument()
    })

    it('should reset results when search query is empty', async () => {
        //arrange
        render(<SearchPage />)
        const searchBarInput = screen.getByRole('textbox')

        //act
        fireEvent.change(searchBarInput, { target: { value: '' } })

        //assert
        expect(screen.queryByText('@testuser')).not.toBeInTheDocument()
        expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument()
    })
})