import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addNote, editNote, getNote } from "../../services/notesService";
import { Save, X, ArrowLeft, Loader } from "lucide-react";

const NoteEditor = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchNoteData = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNote(id);
      if (response.success) {
        const note = response.note;
        setTitle(note.title);
        setContent(note.content);
      } else {
        setError("Failed to fetch note");
        console.error("Failed to fetch note:", response);
      }
    } catch (error) {
      setError("Error loading note");
      console.error("Error fetching note data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (noteId) {
      fetchNoteData(noteId);
    }
  }, [noteId]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      if (noteId) {
        await editNote(title, content, noteId);
      } else {
        await addNote(title, content);
      }
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to save note");
      console.error("Error saving note:", error);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "code-block", "blockquote"],
      ["clean"],
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading note...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-[#2ab6ac] transition-colors duration-200"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {noteId ? "Edit Note" : "Create New Note"}
            </h1>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-6 px-4 py-3 text-xl font-semibold border-b border-gray-200 focus:border-[#2ab6ac] focus:outline-none transition-colors duration-200"
            />

            <div className="h-[calc(100vh-380px)] min-h-[400px]">
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-full"
                theme="snow"
              />
            </div>
          </div>

          {error && (
            <div className="px-6 py-3 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#2ab6ac] text-white px-6 py-2 rounded-lg hover:bg-[#239d94] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
