import { render, screen, fireEvent } from "@testing-library/react";
import ConversationList from "./ConversationList";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";

describe("ConversationList Component", () => {
    const mockConversationIds = [
        { _id: "1", users: ["currentUser", "user1"] },
        { _id: "2", users: ["currentUser", "user2"] },
    ];
    const currentUsername = "currentUser";
    const currentConversation = { _id: "1", users: ["currentUser", "user1"] };
    const setCurrentConversation = vi.fn();
    const handleOpenModal = vi.fn();
    const handleCloseModal = vi.fn();
    const handleCreateConversation = vi.fn();
    const setOtherUsername = vi.fn();
    const otherUsername = "";
    const error = null;


    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render the header with 'Recent Messages'", () => {
        render(
            <Router>
                <ConversationList
                    conversationIds={mockConversationIds}
                    currentUsername={currentUsername}
                    currentConversation={null}
                    setCurrentConversation={setCurrentConversation}
                    showModal={false}
                    handleOpenModal={handleOpenModal}
                    handleCloseModal={handleCloseModal}
                    otherUsername={otherUsername}
                    setOtherUsername={setOtherUsername}
                    error={error}
                    handleCreateConversation={handleCreateConversation}
                />
            </Router>
        );

        expect(screen.getByText(/recent messages/i)).toBeInTheDocument();
    });

    it("should call handleOpenModal when the create conversation button is clicked", () => {
        render(
            <Router>
                <ConversationList
                    conversationIds={mockConversationIds}
                    currentUsername={currentUsername}
                    currentConversation={null}
                    setCurrentConversation={setCurrentConversation}
                    showModal={false}
                    handleOpenModal={handleOpenModal}
                    handleCloseModal={handleCloseModal}
                    otherUsername={otherUsername}
                    setOtherUsername={setOtherUsername}
                    error={error}
                    handleCreateConversation={handleCreateConversation}
                />
            </Router>
        );

        const createButton = screen.getByRole("button", { name: /create-conversation/i });
        fireEvent.click(createButton);

        expect(handleOpenModal).toHaveBeenCalled();
    });

    it("should render conversations when conversationIds is not empty", () => {
        render(
            <Router>
                <ConversationList
                    conversationIds={mockConversationIds}
                    currentUsername={currentUsername}
                    currentConversation={null}
                    setCurrentConversation={setCurrentConversation}
                    showModal={false}
                    handleOpenModal={handleOpenModal}
                    handleCloseModal={handleCloseModal}
                    otherUsername={otherUsername}
                    setOtherUsername={setOtherUsername}
                    error={error}
                    handleCreateConversation={handleCreateConversation}
                />
            </Router>
        );

        const conversationTabs = screen.getAllByText(/user/i);
        expect(conversationTabs).toHaveLength(2); // Two other users
        expect(conversationTabs[0]).toHaveTextContent("user1");
        expect(conversationTabs[1]).toHaveTextContent("user2");
    });

    it("should render 'No recent messages' when conversationIds is empty", () => {
        render(
            <Router>
                <ConversationList
                    conversationIds={[]}
                    currentUsername={currentUsername}
                    currentConversation={null}
                    setCurrentConversation={setCurrentConversation}
                    showModal={false}
                    handleOpenModal={handleOpenModal}
                    handleCloseModal={handleCloseModal}
                    otherUsername={otherUsername}
                    setOtherUsername={setOtherUsername}
                    error={error}
                    handleCreateConversation={handleCreateConversation}
                />
            </Router>
        );

        expect(screen.getByText(/no recent messages/i)).toBeInTheDocument();
    });

    it("should call setCurrentConversation when a conversation is clicked", () => {
        render(
            <Router>
                <ConversationList
                    conversationIds={mockConversationIds}
                    currentUsername={currentUsername}
                    currentConversation={null}
                    setCurrentConversation={setCurrentConversation}
                    showModal={false}
                    handleOpenModal={handleOpenModal}
                    handleCloseModal={handleCloseModal}
                    otherUsername={otherUsername}
                    setOtherUsername={setOtherUsername}
                    error={error}
                    handleCreateConversation={handleCreateConversation}
                />
            </Router>
        );

        const firstConversation = screen.getByText("user1");
        fireEvent.click(firstConversation);

        expect(setCurrentConversation).toHaveBeenCalledWith(mockConversationIds[0]);
    });

    it("should render CreateConversationModal when showModal is true", () => {
        render(
            <Router>
                <ConversationList
                    conversationIds={mockConversationIds}
                    currentUsername={currentUsername}
                    currentConversation={null}
                    setCurrentConversation={setCurrentConversation}
                    showModal={true}
                    handleOpenModal={handleOpenModal}
                    handleCloseModal={handleCloseModal}
                    otherUsername={otherUsername}
                    setOtherUsername={setOtherUsername}
                    error={error}
                    handleCreateConversation={handleCreateConversation}
                />
            </Router>
        );

        expect(screen.getByText(/start a conversation/i)).toBeInTheDocument();
    });
});
