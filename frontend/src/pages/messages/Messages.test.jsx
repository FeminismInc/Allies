import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import MessagesPage from './Messages';


//mocking modules
vi.mock('axios');
vi.mock('socket.io-client', () => ({
    io: vi.isMockFunction(() => ({
        on: vi.fn(),
        emit: vi.fn(),
        off: vi.fn()
    }))
}));

describe('MessagesPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderMessagesPage = () => {
        return render(
            <BrowserRouter>
                <MessagesPage />
            </BrowserRouter>
        );
    };


    describe('Rendering', () => {
        it('renders all required elements', () => {
            // arrange and act
            renderMessagesPage();

            //assert
            expect(screen.getByText('Conversation List')).toBeInTheDocument();
            expect(screen.getByText('Message Log')).toBeInTheDocument();
            expect(screen.getAllByPlaceholderText('Type your message...')).toBeInTheDocument();
            expect(screen.getByText())
        })
    })
})