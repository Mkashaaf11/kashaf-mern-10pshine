import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "../node_modules/react-router-dom";
import Login from "./Login";
import AuthContext from "../../services/context/authContext";
import { login as loginService } from "../../services/authService";

jest.mock("./services/authService.js", () => ({
  login: jest.fn(),
}));

const mockLoginProvider = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ loginProvider: mockLoginProvider }}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  test("handles successful login", async () => {
    loginService.mockResolvedValue({
      token: "test-token",
      message: "Login successful",
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() => {
      expect(loginService).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });

    expect(mockLoginProvider).toHaveBeenCalledWith(
      { email: "test@example.com" },
      "test-token"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("displays error on login failure", async () => {
    loginService.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
