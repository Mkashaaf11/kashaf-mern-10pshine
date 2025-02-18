import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotesList from "../component/Notes/NotesList";
import NoteEditor from "../component/Notes/AddNote";
import NoteDetails from "../component/Notes/NoteDetails";

const NotesPage = () => {
  return (
    <Routes>
      <Route path="/" element={<NotesList />} />
      <Route path="add" element={<NoteEditor />} />
      <Route path="add/:noteId" element={<NoteEditor />} />

      <Route path=":noteId" element={<NoteDetails />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default NotesPage;
