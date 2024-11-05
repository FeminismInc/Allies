import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import axios from  'axios'
import ProfileForm from './Form'


//mocking modules
vi.mock('axios')
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => vi.fn()
    }
})
vi.mock('react-native', () => ({
    Button: ({ onPress, title }) => (
        <button onClick={onPress}>{title}</button>
    )
}))

describe('ProfileForm Component', () => {
    const mockNavigate = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        // mocking useNavigate
    })

    afterEach(() => {
        cleanup()
    })


    const renderProfileForm = () => {
        return render(
            <BrowserRouter>
                <ProfileForm />
            </BrowserRouter>
        )
    }

    it('should render all the form fields', () => {
        //arrange
        renderProfileForm()

        // act and assert
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/handle/i)).toBeInTheDocument()
        expect(screen.getByText(/preferred pronouns/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/birthday/i)).toBeInTheDocument()
    })

    it('should render all the pronoun options', () => {
        //arrange
        renderProfileForm()
    
        // act and assert
        expect(screen.getByLabelText(/she\/her/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/he\/him/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/they\/them/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/other/i)).toBeInTheDocument()
    })
    

    it('should show an alert when an empty field is submitted', async () => {
        //arrange
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
        renderProfileForm()
        
        //act
        const submitButton = screen.getByText(/submit/i)
        await userEvent.click(submitButton)

        //assert
        expect(alertMock).toHaveBeenCalledWith('Please fill out all sections.')
        expect(mockNavigate).not.toHaveBeenCalled()

    })

    it('should update form values when user types', async () => {
        //arrange
        renderProfileForm()

        //act
        await userEvent.type(screen.getByLabelText(/username/i), 'testuser')
        await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
        await userEvent.type(screen.getByLabelText(/password/i), 'password123')
        await userEvent.type(screen.getByLabelText(/handle/i), 'TestHandle')

        //select pronoun
        const pronounRadio = screen.getByLabelText(/they\/them/i)
        await userEvent.click(pronounRadio)

        //set birthday
        const birthdateInput = screen.getByLabelText(/birthday/i)
        await userEvent.type(birthdateInput, '2000-01-01')

        //assert
        expect(screen.getByLabelText(/username/i)).toHaveValue('testuser')
        expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com')
        expect(screen.getByLabelText(/password/i)).toHaveValue('password123')
        expect(screen.getByLabelText(/handle/i)).toHaveValue('TestHandle')
        expect(pronounRadio).toBeChecked()
        expect(birthdateInput).toHaveValue('2000-01-01')
    })

    it('should submit the form successfully with valid data', async () => {
        //arrange
        renderProfileForm()
        const formData = {
            username: 'testUser',
            email: 'test@example.com',
            password: 'password123',
            handle: 'TestHandle',
            pronouns: 'they/them',
            birthdate: '2000-01-01'
        }

        axios.post.mockResolvedValueOnce({ data: { success: true } })
        axios.post.mockResolvedValueOnce({ data: { exists: true } })

        //act
        await userEvent.type(screen.getByLabelText(/username/i), formData.username)
        await userEvent.type(screen.getByLabelText(/email/i), formData.email)
        await userEvent.type(screen.getByLabelText(/password/i), formData.password)
        await userEvent.type(screen.getByLabelText(/handle/i), formData.handle)
        await userEvent.click(screen.getByLabelText(/they\/them/i))
        await userEvent.type(screen.getByLabelText(/birthday/i), formData.birthdate)

        await userEvent.click(screen.getByRole('button', { name: /submit/i }))

        //assert
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5050/api/users/form',
                formData
            )
            expect(mockNavigate).toHaveBeenCalledWith('/profile')
        })
    })

    it('should handle API errors during submission', async () => {
        //arrange
        renderProfileForm()
        const consoleSpy = vi.spyOn(console, 'log')
        axios.post.mockRejectedValueOnce(new Error('API Error'))

        //act
        await userEvent.type(screen.getByLabelText(/username/i), 'testUser')
        await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
        await userEvent.type(screen.getByLabelText(/password/i), 'password123')
        await userEvent.type(screen.getByLabelText(/handle/i), 'TestHandle')
        await userEvent.click(screen.getByLabelText(/they\them/i))
        await userEvent.type(screen.getByLabelText(/birthday/i), '2000-01-01')

        await userEvent.click(screen.getByText(/submit/i))

        //assert
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('test1')
        })
    })

    it('should sent an alert when an email is not found', async () => {
        //arrange
        renderProfileForm()
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
        axios.post.mockResolvedValueOnce({ data: { success: true } })
        axios.post.mockResolvedValueOnce({ data: {exists: false } })

        //act
        await userEvent.type(screen.getByLabelText(/username/i), 'testuser')
        await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
        await userEvent.type(screen.getByLabelText(/password/i), 'password123')
        await userEvent.type(screen.getByLabelText(/handle/i), 'TestHandle')
        await userEvent.click(screen.getByLabelText(/they\/them/i))
        await userEvent.type(screen.getByLabelText(/birthday/i), '2000-01-01')

        await userEvent.click(screen.getByText(/submit/i))

        //assert
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('Email not found. Please sign up.')
        })
    })

    it('should require a minimum password length', async () => {
        //arrange
        renderProfileForm()

        //act
        const passwordInput = screen.getByLabelText(/password/i)

        //assert
        expect(passwordInput).toHaveAttribute('minlength', '8')
    })

    it('should render terms of service', () => {
        //arrange
        renderProfileForm()

        //act and assert
        expect(screen.getByText(/By creating an account, you agree to the Terms of Use and Privacy Policy./i)).toBeInTheDocument()
    })

    it('should render password recommendation', () => {
        //arrange
        renderProfileForm()

        //act and assert
        expect(screen.getByText(/Use 8 or more characters with a mix of letters, numbers & symbols/i)).toBeInTheDocument()
    })
})