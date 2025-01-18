import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes } from "../../services/notesService";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const fetchNotes = useCallback(async () => {
    try {
      const response = await getNotes();
      if (response.success) {
        setNotes(response.notes);
      } else {
        console.error("Failed to fetch notes:", response);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

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
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-700">
                {note.title}
              </h3>
              <div
                className="text-gray-500 text-sm mt-2"
                dangerouslySetInnerHTML={{
                  __html: note.content.substring(0, 50) + "...",
                }}
              ></div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => navigate(`/notes/${note._id}`)}
                  className="text-blue-500 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/notes/add/${note._id}`)}
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
