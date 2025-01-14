import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    // Mock API call
    const mockNotes = [
      { id: 1, title: "Note 1", content: "This is the first note" },
      { id: 2, title: "Note 2", content: "This is the second note" },
    ];
    setNotes(mockNotes);
  };

  const handleAddNote = () => {
    navigate("/notes/add");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Notes</h1>
        <button
          onClick={handleAddNote}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + New Note
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-700">
                {note.title}
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                {note.content.substring(0, 50)}...
              </p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => navigate(`/notes/${note.id}`)}
                  className="text-blue-500 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/notes/add/${note.id}`)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No notes available. Create your first note!
          </p>
        )}
      </div>
    </div>
  );
};

export default NotesList;
