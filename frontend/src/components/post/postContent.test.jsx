import { render, screen, waitFor } from "@testing-library/react";
import PostContent from "./postContent";
import { vi } from "vitest";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

vi.mock("axios");

describe("PostContent Component", () => {
    const mockPost = {
        _id: "123",
        author: "testauthor",
        datetime: "2023-11-25T10:30:00Z",
        text: "This is a test post",
        media: "mockMediaId",
    };
    const username = "testuser";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render null if isAParent is true", () => {
        const { container } = render(
            <Router>
                <PostContent post={mockPost} username={username} isAParent={true} />
            </Router>
        );
        expect(container.firstChild).toBeNull();
    });

    it("should render post details correctly", async () => {
        axios.get.mockResolvedValueOnce({ data: "http://mock-media-url.com/media.jpg" }); // Mock media URL
        axios.get.mockResolvedValueOnce({ data: { profilePicture: null } }); // No profile image

        render(
            <Router>
                <PostContent post={mockPost} username={username} isAParent={false} />
            </Router>
        );

        // Assert that post details are displayed
        expect(screen.getByText(username)).toBeInTheDocument();
        expect(screen.getByText(`@${mockPost.author}`)).toBeInTheDocument();
        expect(screen.getByText("This is a test post")).toBeInTheDocument();
        expect(screen.getByText(new Date(mockPost.datetime).toLocaleString())).toBeInTheDocument();
    });

    it("should fetch and display media if available", async () => {
        axios.get.mockResolvedValueOnce({ data: "http://mock-media-url.com/media.jpg" }); // Mock media URL
        axios.get.mockResolvedValueOnce({ data: { profilePicture: null } }); // No profile image

        render(
            <Router>
                <PostContent post={mockPost} username={username} isAParent={false} />
            </Router>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                "http://localhost:5050/api/posts/getMedia/123"
            );
            expect(screen.getByAltText("post-media")).toBeInTheDocument();
        });
    });

    it("should fetch and display profile picture if available", async () => {
        axios.get.mockResolvedValueOnce({ data: { profilePicture: "http://mock-profile-pic.com/image.jpg" } }); // Mock profile picture
        axios.get.mockResolvedValueOnce({ data: "http://mock-media-url.com/media.jpg" }); // Mock media URL

        render(
            <Router>
                <PostContent post={mockPost} username={username} isAParent={false} />
            </Router>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                "http://localhost:5050/api/users/getProfilePicture/testuser"
            );
            expect(screen.getByAltText("Profile")).toBeInTheDocument();
        });
    });

    it("should render fallback icon if profile picture is not available", async () => {
        axios.get.mockResolvedValueOnce({ data: { profilePicture: null } }); // No profile picture
        axios.get.mockResolvedValueOnce({ data: "http://mock-media-url.com/media.jpg" }); // Mock media URL

        render(
            <Router>
                <PostContent post={mockPost} username={username} isAParent={false} />
            </Router>
        );

        expect(screen.getByTestId("AccountCircleOutlinedIcon")).toBeInTheDocument();
    });

    it("should render null if no post is provided", () => {
        const { container } = render(
            <Router>
                <PostContent post={null} username={username} isAParent={false} />
            </Router>
        );
        expect(container.firstChild).toBeNull();
    });

    it("should handle API errors gracefully", async () => {
        axios.get.mockRejectedValueOnce(new Error("Media fetch failed"));
        axios.get.mockRejectedValueOnce(new Error("Profile picture fetch failed"));

        render(
            <Router>
                <PostContent post={mockPost} username={username} isAParent={false} />
            </Router>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(2); // Two API calls (media + profile picture)
        });

        // Assert no media or profile image is displayed
        expect(screen.queryByAltText("post-media")).not.toBeInTheDocument();
        expect(screen.getByTestId("AccountCircleOutlinedIcon")).toBeInTheDocument();
    });
});
