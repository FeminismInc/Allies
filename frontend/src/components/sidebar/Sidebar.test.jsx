import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

describe("Sidebar Component", () => {
  const mockUsername = "testuser";
  const mockUri = process.env.REACT_APP_URI;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    axios.get.mockResolvedValueOnce({ data: { username: mockUsername } });
  });

  const renderSidebar = () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );
  };

  it("renders the Sidebar component correctly", () => {
    renderSidebar();
    expect(screen.getByText("Allies")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Post")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("fetches and displays the username dynamically", async () => {
    renderSidebar();

    await waitFor(() => {
      const profileLink = screen.getByText("Profile");
      expect(profileLink).toBeInTheDocument();
      expect(profileLink.closest("a")).toHaveAttribute("href", `/profile/${mockUsername}`);
    });
  });

  it("handles API errors gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch user"));
    renderSidebar();

    await waitFor(() => {
      const profileLink = screen.getByText("Profile");
      expect(profileLink).toBeInTheDocument();
      expect(profileLink.closest("a")).toHaveAttribute("href", "/profile/");
    });
  });

  it("toggles the sidebar when the menu button is clicked", () => {
    renderSidebar();

    const toggleButton = screen.getByLabelText('bars');
    expect(toggleButton).toBeInTheDocument();

    const sidebar = screen.getByLabelText('sidebar');
    expect(sidebar).toHaveStyle("width: 240px");

    fireEvent.click(toggleButton);
    expect(sidebar).toHaveStyle("width: 100px");

    fireEvent.click(toggleButton);
    expect(sidebar).toHaveStyle("width: 240px");
  });

  it("renders correct icons for each menu item", () => {
    renderSidebar();

    expect(screen.getByTestId("HomeOutlinedIcon")).toBeInTheDocument();
    expect(screen.getByTestId("AccountCircleOutlinedIcon")).toBeInTheDocument();
    expect(screen.getByTestId("AddBoxIcon")).toBeInTheDocument();
    expect(screen.getByTestId("ChatBubbleOutlineOutlinedIcon")).toBeInTheDocument();
    expect(screen.getByTestId("SearchIcon")).toBeInTheDocument();
    expect(screen.getByTestId("LogoutOutlinedIcon")).toBeInTheDocument();
  });

  it("navigates correctly when menu items are clicked", () => {
    renderSidebar();

    const homeLink = screen.getByText("Home");
    fireEvent.click(homeLink);
    expect(window.location.pathname).toBe("/home");

    const logoutLink = screen.getByText("Logout");
    fireEvent.click(logoutLink);
    expect(window.location.pathname).toBe("/");
  });
});
