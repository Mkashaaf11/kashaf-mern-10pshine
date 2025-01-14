import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const NoteDetails = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (noteId) {
      fetchNoteDetails(noteId);
    }
  }, [noteId]);

  const fetchNoteDetails = async (id) => {
    const mockNote = {
      id,
      title: "Sample Note Title",
      content: "<p>This is the content of the note.</p>",
    };
    setNote(mockNote);
  };

  if (!note) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{note.title}</h1>
      </header>
      <div
        className="bg-white p-6 rounded-lg shadow-md"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
      <div className="mt-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NoteDetails;
