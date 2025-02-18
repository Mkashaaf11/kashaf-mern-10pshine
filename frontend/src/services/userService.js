import API from "./axiosInstance";

export const getUsers = async () => {
  const response = await API.get("/user/");
  return response.data;
};

export const getUser = async (userId) => {
  const response = await API.get(`/user/${userId}`);
  return response.data;
};

export const addUser = async (name, email, password) => {
  const response = await API.post("/user/", { name, email, password });
  return response.data;
};

export const updateUser = async (userId, updates) => {
  const response = await API.put(`/user/${userId}`, updates);
  return response.data.user;
};

export const deleteUser = async (userId) => {
  const response = await API.delete(`/user/${userId}`);
  return response.data;
};
