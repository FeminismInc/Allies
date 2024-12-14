import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MessageLog from './Messagelog';
import axios from 'axios';
import { it, describe, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter as Router } from "react-router-dom";


vi.mock('axios');

// all pass 
describe("MessageLog Component", () => {
    const currentUsername = "currentUser";
    const currentConversation = {
        users: ["currentUser", "otherUser1", "otherUser2"],
    };
    const messageList = [
        { sender: "currentUser", message_content: "Hello there!" },
        { sender: "otherUser1", message_content: "Hi, how are you?" },
    ];
    let message = "";
    const setMessage = vi.fn((newMessage) => (message = newMessage));
    const send = vi.fn();
    const deleteConversation = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // PASS
    it("should render participant usernames except the current user", () => {
        render(
            <Router>
                <MessageLog
                    currentUsername={currentUsername}
                    currentConversation={currentConversation}
                    messageList={[]}
                    message=""
                    setMessage={setMessage}
                    send={send}
                    deleteConversation={deleteConversation}
                />
            </Router>
        );

        const participantLinks = screen.getAllByRole("link");
        expect(participantLinks).toHaveLength(2); // Other users
        expect(participantLinks[0]).toHaveTextContent("otherUser1");
        expect(participantLinks[1]).toHaveTextContent("otherUser2");
    });

    it("should render messages in the message log", () => {
        render(
            <Router>
                <MessageLog
                    currentUsername={currentUsername}
                    currentConversation={currentConversation}
                    messageList={messageList}
                    message=""
                    setMessage={setMessage}
                    send={send}
                    deleteConversation={deleteConversation}
                />
            </Router>
        );

        const messages = screen.getAllByText(/(Hello there!|Hi, how are you?)/i);
        expect(messages).toHaveLength(2);

        // Ensure "mine" and "yours" classes are applied correctly
        const mineMessage = screen.getByText("Hello there!");
        const yoursMessage = screen.getByText("Hi, how are you?");
        expect(mineMessage.parentElement).toHaveClass("mine");
        expect(yoursMessage.parentElement).toHaveClass("yours");
    });

    it("should update input value when typing", () => {
        render(
            <Router>
                <MessageLog
                    currentUsername={currentUsername}
                    currentConversation={currentConversation}
                    messageList={[]}
                    message={message}
                    setMessage={setMessage}
                    send={send}
                    deleteConversation={deleteConversation}
                />
            </Router>
        );

        const input = screen.getByPlaceholderText(/type your message/i);
        fireEvent.change(input, { target: { value: "New message" } });

        expect(setMessage).toHaveBeenCalledWith("New message");
    });
    it("should call send function when send button is clicked", () => {
        render(
            <Router>
                <MessageLog
                    currentUsername={currentUsername}
                    currentConversation={currentConversation}
                    messageList={[]}
                    message="New message"
                    setMessage={setMessage}
                    send={send}
                    deleteConversation={deleteConversation}
                />
            </Router>
        );

        const sendButton = screen.getByLabelText("send-button");
        fireEvent.click(sendButton);

        expect(send).toHaveBeenCalled();
    });

    it("should call deleteConversation function when delete button is clicked", () => {
        render(
            <Router>
                <MessageLog
                    currentUsername={currentUsername}
                    currentConversation={currentConversation}
                    messageList={[]}
                    message=""
                    setMessage={setMessage}
                    send={send}
                    deleteConversation={deleteConversation}
                />
            </Router>
        );


        const deleteButton = screen.getByRole("button", { name: /delete/i });
        fireEvent.click(deleteButton);

        expect(deleteConversation).toHaveBeenCalled();
    });

    it("should display 'No other participants' if no other users exist", () => {
        render(
            <Router>
                <MessageLog
                    currentUsername={currentUsername}
                    currentConversation={{ users: ["currentUser"] }}
                    messageList={[]}
                    message=""
                    setMessage={setMessage}
                    send={send}
                    deleteConversation={deleteConversation}
                />
            </Router>
        );

        expect(screen.getByText(/no other participants/i)).toBeInTheDocument();
    });
});