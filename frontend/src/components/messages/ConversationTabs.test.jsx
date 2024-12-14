import { render, screen } from "@testing-library/react";
import ConversationTabs from "./ConversationTabs";
import { vi } from "vitest";

describe("ConversationTabs Component", () => {
    const currentUsername = "currentUser";
    const conversation = {
        users: ["currentUser", "otherUser1", "otherUser2"],
    };

    it("should render conversation users except the current user", () => {
        render(
            <ConversationTabs
                conversation={conversation}
                currentUsername={currentUsername}
                isSelected={false}
            />
        );

        const userElements = screen.getAllByText(/otherUser/i);
        expect(userElements).toHaveLength(2); // Excludes currentUser
        expect(userElements[0]).toHaveTextContent("otherUser1");
        expect(userElements[1]).toHaveTextContent("otherUser2");
    });
    
    it("should add 'selected' class if isSelected is true", () => {
        render(
            <ConversationTabs
                conversation={conversation}
                currentUsername={currentUsername}
                isSelected={true}
            />
        );

        const tabElement = screen.getByRole("button", { name: /profile-picture/i }).closest("div");
        expect(tabElement).toHaveClass("selected");
    });

    it("should not add 'selected' class if isSelected is false", () => {
        render(
            <ConversationTabs
                conversation={conversation}
                currentUsername={currentUsername}
                isSelected={false}
            />
        );

        const tabElement = screen.getByRole("button", { name: /profile-picture/i }).closest("div");
        expect(tabElement).not.toHaveClass("selected");
    });

    it("should render an IconButton with the profile picture icon", () => {
        render(
            <ConversationTabs
                conversation={conversation}
                currentUsername={currentUsername}
                isSelected={false}
            />
        );

        const iconButton = screen.getByRole("button", { name: /profile-picture/i });
        expect(iconButton).toBeInTheDocument();
    });
});
