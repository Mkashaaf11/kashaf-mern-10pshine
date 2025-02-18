// src/services/notesService.js
import API from "./axiosInstance";

export const getNotes = async () => {
  const response = await API.get("/notes/");
  return response.data;
};

export const getNote = async (noteId) => {
  const response = await API.get(`/notes/${noteId}`);
  return response.data;
};

export const addNote = async (title, content) => {
  const response = await API.post("/notes/", { title, content });
  return response.data;
};

export const editNote = async (title, content, noteId) => {
  const response = await API.put(`/notes/${noteId}`, {
    title,
    content,
  });
  return response.data;
};

export const removeNote = async (noteId) => {
  const response = await API.delete(`/notes/${noteId}`);
  return response.data;
};
