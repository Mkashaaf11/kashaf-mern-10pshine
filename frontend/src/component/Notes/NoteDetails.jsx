import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNote } from "../../services/notesService";

const NoteDetails = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  const fetchNoteDetails = async (id) => {
    try {
      const response = await getNote(id);
      if (response.success) {
        setNote(response.note);
      } else {
        console.error("Failed to fetch note:", response);
      }
      console.log("Fetched Note: ", response.note);
    } catch (error) {
      console.error("Error fetching note details:", error);
    }
  };

  useEffect(() => {
    if (noteId) {
      fetchNoteDetails(noteId);
    }
  }, [noteId]);

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
