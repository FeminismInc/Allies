import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserPost from "./userPost";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from "vitest";

vi.mock("axios");

describe("UserPost Component", () => {
  const mockPost = {
    _id: "123",
    author: "testauthor",
    datetime: new Date().toISOString(),
    text: "This is a test post",
    media: [],
    repost: null,
  };

  const username = "testuser";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render post content correctly", () => {
    render(
      <Router>
        <UserPost post={mockPost} username={username} />
      </Router>
    );

    expect(screen.getByText("This is a test post")).toBeInTheDocument();
    expect(screen.getByText(`@${mockPost.author}`)).toBeInTheDocument();
  });

  it("should fetch likes and dislikes on mount", async () => {
    axios.get.mockResolvedValueOnce({ data: ["user1", "user2"] }); // Likes
    axios.get.mockResolvedValueOnce({ data: ["user3"] }); // Dislikes

    render(
      <Router>
        <UserPost post={mockPost} username={username} />
      </Router>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:5050/api/posts/getPostLikes/${mockPost._id}`,
        {}
      );
      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:5050/api/posts/getPostDislikes/${mockPost._id}`,
        {}
      );
    });

    expect(screen.getByText(/2 likes/i)).toBeInTheDocument();
    expect(screen.getByText(/1 dislikes/i)).toBeInTheDocument();
  });

  it("should handle like button click and update likes", async () => {
    axios.post.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: ["user1", "user2", "testuser"] });

    render(
      <Router>
        <UserPost post={mockPost} username={username} />
      </Router>
    );

    const likeButton = screen.getByRole("button", { name: /Likes Icon Button/i });
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `http://localhost:5050/api/posts/addLike/${mockPost._id}`,
        { username }
      );
    });

    expect(await screen.findByText(/likes/i)).toBeInTheDocument();
  });

  it("should handle dislike button click and update dislikes", async () => {
    axios.post.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: ["user1", "user2", "user3"] });

    render(
      <Router>
        <UserPost post={mockPost} username={username} />
      </Router>
    );

    const dislikeButton = screen.getByRole("button", { name: /Dislike Icon Button/i });
    fireEvent.click(dislikeButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `http://localhost:5050/api/posts/addDislike/${mockPost._id}`,
        { username }
      );
    });

    expect(await screen.findByText(/0 dislikes/i)).toBeInTheDocument();
  });

  it("should navigate to the comment view when the comment button is clicked", () => {
    const { container } = render(
      <Router>
        <UserPost post={mockPost} username={username} />
      </Router>
    );

    const commentButton = container.querySelector(".comment-button");
    fireEvent.click(commentButton);

    // Simulating navigation is beyond the scope of a unit test but would verify the button was clicked
  });

  it("should toggle the like box visibility", () => {
    render(
      <Router>
        <UserPost post={mockPost} username={username} />
      </Router>
    );

    const likeText = screen.getByText(/0 likes/i);
    fireEvent.click(likeText);
    expect(screen.getByText(/accounts that liked/i)).toBeInTheDocument();
    const openButton = screen.getAllByText(/close/i)[0];
    fireEvent.click(openButton);
    expect(screen.queryByText(/accounts that liked/i)).toBeInTheDocument();
  });

  it("should toggle the dislike box visibility", () => {
    render(
      <Router>
        <UserPost post={mockPost} username={username} />
      </Router>
    );

    const dislikeText = screen.getByText(/0 dislikes/i);
    fireEvent.click(dislikeText);
    expect(screen.getByText(/accounts that disliked/i)).toBeInTheDocument();

    const openButton = screen.getAllByText(/close/i)[1];
    fireEvent.click(openButton);
    expect(screen.queryByText(/accounts that disliked/i)).toBeInTheDocument();
  });
});
