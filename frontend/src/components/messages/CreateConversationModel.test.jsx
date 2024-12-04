
import { render, screen, fireEvent } from "@testing-library/react";
import CreateConversationModal from "./CreateConversationModal";
import { vi } from "vitest";


// all pass! 
describe("CreateConversationModal Component", () => {
  let showModal, closeModal, otherUsername, setOtherUsername, error, handleCreateConversation;

  beforeEach(() => {
    showModal = true; // ensures that the modal is visible by default
    closeModal = vi.fn();
    setOtherUsername = vi.fn();
    handleCreateConversation = vi.fn();
    otherUsername = "";
    error = null; // and that there is no error by default
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when showModal is false", () => {
    render(
      <CreateConversationModal
        showModal={false}
        closeModal={closeModal}
        otherUsername={otherUsername}
        setOtherUsername={setOtherUsername}
        error={error}
        handleCreateConversation={handleCreateConversation}
      />
    );

    expect(screen.queryByText(/start a conversation/i)).not.toBeInTheDocument();
  });

  it("should render when showModal is true", () => {
    render(
      <CreateConversationModal
        showModal={showModal}
        closeModal={closeModal}
        otherUsername={otherUsername}
        setOtherUsername={setOtherUsername}
        error={error}
        handleCreateConversation={handleCreateConversation}
      />
    );

    expect(screen.getByText(/start a conversation/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
  });

  it("should call setOtherUsername when typing in the input field", () => {
    render(
      <CreateConversationModal
        showModal={showModal}
        closeModal={closeModal}
        otherUsername={otherUsername}
        setOtherUsername={setOtherUsername}
        error={error}
        handleCreateConversation={handleCreateConversation}
      />
    );

    const input = screen.getByPlaceholderText(/enter username/i);
    fireEvent.change(input, { target: { value: "newUser" } });

    expect(setOtherUsername).toHaveBeenCalledWith("newUser");
  });

  it("should display an error message if error prop is set", () => {
    render(
      <CreateConversationModal
        showModal={showModal}
        closeModal={closeModal}
        otherUsername={otherUsername}
        setOtherUsername={setOtherUsername}
        error="User not found"
        handleCreateConversation={handleCreateConversation}
      />
    );

    expect(screen.getByText(/user not found/i)).toBeInTheDocument();
  });

  it("should call handleCreateConversation when the Start Conversation button is clicked", () => {
    render(
      <CreateConversationModal
        showModal={showModal}
        closeModal={closeModal}
        otherUsername={otherUsername}
        setOtherUsername={setOtherUsername}
        error={error}
        handleCreateConversation={handleCreateConversation}
      />
    );

    const startButton = screen.getByText(/start conversation/i);
    fireEvent.click(startButton);

    expect(handleCreateConversation).toHaveBeenCalled();
  });

  it("should call closeModal when the Cancel button is clicked", () => {
    render(
      <CreateConversationModal
        showModal={showModal}
        closeModal={closeModal}
        otherUsername={otherUsername}
        setOtherUsername={setOtherUsername}
        error={error}
        handleCreateConversation={handleCreateConversation}
      />
    );

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(closeModal).toHaveBeenCalled();
  });
});
