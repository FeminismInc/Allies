import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";
import RepostWrapper from "./RepostWrapper";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("RepostWrapper Component", () => {
  const mockPost = {
    _id: "123",
    author: "testauthor",
    datetime: "2023-11-25T10:30:00Z",
    text: "This is a test post",
  };
  const mockChildPost = {
    _id: "456",
    author: "childauthor",
    datetime: "2023-11-26T12:00:00Z",
    text: "This is a child post",
  };
  const username = "testuser";

  const MockWrappedComponent = ({ post, username, isAParent }) => (
    <div>
      <p>{post.text}</p>
      <p>{username}</p>
      <p>{isAParent ? "Parent Post" : "Child Post"}</p>
    </div>
  );

  const WrappedRepost = RepostWrapper(MockWrappedComponent);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render null if isAParent is false", () => {
    const { container } = render(
      <Router>
        <WrappedRepost
          post={mockPost}
          username={username}
          isAParent={false}
          childPost={mockChildPost}
        />
      </Router>
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render the repost header and child post if isAParent is true", () => {
    render(
      <Router>
        <WrappedRepost
          post={mockPost}
          username={username}
          isAParent={true}
          childPost={mockChildPost}
        />
      </Router>
    );


    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByText(`@${mockPost.author}`)).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockPost.datetime).toLocaleString())
    ).toBeInTheDocument();


    expect(screen.getByText(mockChildPost.text)).toBeInTheDocument();
    expect(screen.getByText(mockChildPost.author)).toBeInTheDocument();
  });

  it("should navigate to child post on button click", () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <Router>
        <WrappedRepost
          post={mockPost}
          username={username}
          isAParent={true}
          childPost={mockChildPost}
        />
      </Router>
    );

    const button = screen.getByRole("button", { name: /View Child Post/i});
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/PostView", {
      state: { post: mockChildPost },
    });
  });
});
