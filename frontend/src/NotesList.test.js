import { render, screen, fireEvent } from "@testing-library/react";
//import { MemoryRouter } from "../node_modules/react-router-dom";
import NotesList from "./component/Notes/NotesList";
const MemoryRouter = require("react-router-dom").MemoryRouter;

// Mock the services used in the component
jest.mock("./services/notesService.js", () => ({
  getNotes: jest.fn().mockResolvedValue({
    success: true,
    notes: [
      {
        _id: "1",
        title: "Test Note",
        content: "This is a test note",
        createdAt: "2024-01-01T00:00:00Z",
      },
    ],
  }),
  removeNote: jest.fn().mockResolvedValue({ success: true }),
}));

const renderComponent = () => {
  render(
    <MemoryRouter>
      <NotesList />
    </MemoryRouter>
  );
};

describe("NotesList Component", () => {
  test("renders loading state initially", () => {
    renderComponent();
    expect(screen.getByText("Loading notes...")).toBeInTheDocument();
  });

  test("renders fetched notes after loading", async () => {
    renderComponent();
    expect(await screen.findByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("This is a test note")).toBeInTheDocument();
  });

  test("handles search input change", async () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText("Search notes...");
    fireEvent.change(searchInput, { target: { value: "Test" } });
    expect(searchInput.value).toBe("Test");
  });

  test("navigates to add note page when 'New Note' button is clicked", () => {
    renderComponent();
    const newNoteButton = screen.getByText("New Note");
    fireEvent.click(newNoteButton);
    expect(window.location.pathname).toBe("/notes/add");
  });

  test("deletes a note when delete button is clicked", async () => {
    renderComponent();
    const deleteButton = await screen.findByText("Delete");
    fireEvent.click(deleteButton);
    expect(screen.queryByText("Test Note")).not.toBeInTheDocument();
  });
});
