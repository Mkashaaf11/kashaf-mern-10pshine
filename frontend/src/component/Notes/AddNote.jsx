import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NoteEditor = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (noteId) {
      fetchNoteData(noteId);
    }
  }, [noteId]);

  const fetchNoteData = async (id) => {
    const mockNote = {
      id,
      title: "Sample Note",
      content: "<p>This is an editable note.</p>",
    };
    setTitle(mockNote.title);
    setContent(mockNote.content);
  };

  const handleSave = async () => {
    const noteData = { title, content };
    if (noteId) {
      console.log("Updating note:", noteData);
    } else {
      console.log("Creating new note:", noteData);
    }
    navigate("/dashboard");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {noteId ? "Edit Note" : "Add New Note"}
        </h1>
      </header>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <ReactQuill value={content} onChange={setContent} className="mb-4" />

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
