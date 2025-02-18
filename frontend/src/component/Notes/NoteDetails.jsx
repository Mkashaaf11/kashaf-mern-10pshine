import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNote } from "../../services/notesService";
import { ArrowLeft, FileText, Edit3, Clock, Download } from "lucide-react";
import html2pdf from "html2pdf.js";

const NoteDetails = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNoteDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNote(id);
      if (response.success) {
        setNote(response.note);
      } else {
        setError("Failed to fetch note details");
      }
    } catch (error) {
      setError("Error loading note details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (noteId) {
      fetchNoteDetails(noteId);
    }
  }, [noteId]);

  const handleExportPDF = () => {
    const content = document.getElementById("note-content");
    const opt = {
      margin: [10, 10],
      filename: `${note.title}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(content).save();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-10 w-10 text-[#2ab6ac] mb-4 mx-auto animate-pulse" />
          <p className="text-gray-600">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-[#2ab6ac] hover:text-[#239d94] flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Note not found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-[#2ab6ac] hover:text-[#239d94] flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-start">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#2ab6ac] transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 text-[#2ab6ac] hover:text-[#239d94] transition-colors duration-200"
            >
              <Download className="h-5 w-5" />
              Download PDF
            </button>
            <button
              onClick={() => navigate(`/notes/add/${noteId}`)}
              className="flex items-center gap-2 text-[#2ab6ac] hover:text-[#239d94] transition-colors duration-200"
            >
              <Edit3 className="h-5 w-5" />
              Edit Note
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6" id="note-content">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {note.title}
            </h1>
            <div className="flex items-center text-gray-500 text-sm mb-6">
              <Clock className="h-4 w-4 mr-2" />
              <span>Last updated: {formatDate(note.updatedAt)}</span>
            </div>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-sm">
              <FileText className="h-4 w-4 mr-2" />
              <span>Created: {formatDate(note.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;
