import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import axios from 'axios'
import LoginSignUp from './login'

//mocking modules
vi.mock('axios');
vi.mock('gapi-script', () => ({
    gapi: {
        load: vi.fn((api, callback) => callback()),
        client: {
            init: vi.fn()
        }
    }
}));

// mocking useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('LoginSignUp Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {}); //mock alert
    });

    afterEach(() => {
        vi.restoreAllMocks(); // restore all mocks after each test
    })

    const renderLoginComponent = () => {
        return render(
            <BrowserRouter>
                <LoginSignUp />
            </BrowserRouter>
        );
    };


    describe('Rendering', () => {
        it('renders all required elements', () => {
            //arrange and act
            renderLoginComponent();

            //assert
            expect(screen.getByText('Allies')).toBeInTheDocument;
            expect(screen.getByText('Connect, Collaborate, and Empower')).toBeInTheDocument;
            expect(screen.getByText('Log in')).toBeInTheDocument;
            expect(screen.getByPlaceholderText('email')).toBeInTheDocument;
            expect(screen.getByPlaceholderText('password')).toBeInTheDocument;
            expect(screen.getByText('Login')).toBeInTheDocument;
            expect(screen.getByText('Sign up!')).toBeInTheDocument;
        });
    });

    describe('Input Handling', () => {
        it('updates email input value correctly', () => {
            //arrange
            renderLoginComponent();
            const emailInput = screen.getByPlaceholderText('email');
            const testEmail = 'test@example.com';

            //act
            fireEvent.change(emailInput, { target: { value: testEmail } });

            // assert
            expect(emailInput.value).toBe(testEmail);
        });

        it('updates password input value correctly', () => {
            //arrange
            renderLoginComponent();
            const passwordInput = screen.getByPlaceholderText('password');
            const testPassword = 'testpassword123';

            //act
            fireEvent.change(passwordInput, { target: { value: testPassword } });

            //assert
            expect(passwordInput.value).toBe(testPassword);
        });
    });

    describe('Form Submission', () => {
        it('shows alert when submitting with empty fields', async () => {
            //arrange
            renderLoginComponent();
            //select login button
            const loginButton = screen.getByRole('button', { name: /login/i });

            //act
            fireEvent.click(loginButton);

            //assert
            expect(window.alert).toHaveBeenCalledWith('Please fill in both email and password.');
        });

        it('navigates to profile page on successful login', async () => {
            //arrange
            renderLoginComponent();
            const emailInput = screen.getByPlaceholderText('email');
            const passwordInput = screen.getByPlaceholderText('password');
            const loginButton = screen.getByText('Login');

            axios.post.mockResolvedValueOnce({ data: { exists: true } });

            //act
            fireEvent.change(emailInput, { target: { value: 'test@example.com'} });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(loginButton);

            //assert
            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith(
                    'http://localhost:5050/api/users/findUserbyEmail',
                    { email: 'test@example.com', password: 'password123' }
                );
                expect(mockNavigate).toHaveBeenCalledWith('/profile');
            });
        });

        it('shows alert when user is not found', async () => {
            //arrange
            renderLoginComponent();
            const emailInput = screen.getByPlaceholderText('email');
            const passwordInput = screen.getByPlaceholderText('password');
            const loginButton = screen.getByText('Login');

            axios.post.mockResolvedValueOnce({ data: { exists: false} });

            //act
            fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123 '} });
            fireEvent.click(loginButton);

            //assert
            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('Email not found. Please sign up.');
                expect(mockNavigate).not.toHaveBeenCalled();
            });
        });
    });

    describe('Navigation', () => {
        it('navigates to form page when clicking the sign up button', () => {
            //arrange
            renderLoginComponent();
            const signUpButton = screen.getByText('Sign up!');

            //act
            fireEvent.click(signUpButton);

            //assert
            expect(mockNavigate).toHaveBeenCalledWith('/form');
        });
    });
});


