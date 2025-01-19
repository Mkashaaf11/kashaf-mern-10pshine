import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes, removeNote } from "../../services/notesService";
import { Plus, FileText, Edit3, Trash2, Eye } from "lucide-react";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getNotes();
      if (response.success) {
        setNotes(response.notes);
      } else {
        console.error("Failed to fetch notes:", response);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = () => {
    navigate("/notes/add");
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await removeNote(noteId);
      if (response.success) {
        setNotes((prevNotes) =>
          prevNotes.filter((currentNote) => currentNote._id !== noteId)
        );
      } else {
        console.error("Failed to delete note:", response);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-[#2ab6ac] mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
            </div>
            <button
              onClick={handleAddNote}
              className="bg-[#2ab6ac] text-white px-4 py-2 rounded-lg hover:bg-[#239d94] transition-colors duration-200 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              New Note
            </button>
          </div>
        </header>

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No notes available. Create your first note!
            </p>
            <button
              onClick={handleAddNote}
              className="mt-4 inline-flex items-center gap-2 text-[#2ab6ac] hover:text-[#239d94] font-medium"
            >
              <Plus className="h-5 w-5" />
              Create Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-1">
                    {note.title}
                  </h3>
                  <div
                    className="text-gray-600 text-sm line-clamp-3 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: note.content,
                    }}
                  ></div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/notes/${note._id}`)}
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-[#2ab6ac] transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">View</span>
                    </button>
                    <button
                      onClick={() => navigate(`/notes/add/${note._id}`)}
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-[#2ab6ac] transition-colors duration-200"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="inline-flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;
