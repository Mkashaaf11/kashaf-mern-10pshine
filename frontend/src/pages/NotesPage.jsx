import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotesList from "../component/Notes/NotesList";
import AddNote from "../component/Notes/AddNote";
import UpdateNote from "../component/Notes/UpdateNote";
import NoteDetails from "../component/Notes/NoteDetails";

const NotesPage = () => {
  return (
    <Routes>
      <Route path="/" element={<NotesList />} />
      <Route path="add" element={<AddNote />} />
      <Route path="edit/:id" element={<UpdateNote />} />
      <Route path=":id" element={<NoteDetails />} />
      {/* Redirect to the NotesList if no path matches */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default NotesPage;
