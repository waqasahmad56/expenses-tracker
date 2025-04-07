import axios from 'axios';
import { IUser } from '../../../backend/src/interfaces/user.interface';
// import { useNavigate } from 'react-router-dom';
// import { fetchSummary } from './api';
// const navigate=useNavigate();
export const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

// export const fetchGroups = async () => {
//   const { data } = await API.get('/auth/get');
//   return data;
// };

export const fetchGroups = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:5001/api/auth/get`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const createGroup = async (groupName: string) => {
  const { data } = await API.post('/auth/creategrp', { name: groupName });
  return data;
};

export const fetchSummary = async (groupId: string) => {
  try {
    console.log("Fetching expenses for groupId:", groupId);

    const response = await axios.get(`http://localhost:5001/expenses/${groupId}`);

    console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch expenses");
  }
};



export const addUser = async (user: Omit<IUser, 'id'>) => {
  const { data } = await API.post('/auth/add', user);
  return data;
};

// export const login = async (credentials: { email: string; password: string }) => {
//   const response = await axios.post(`http://localhost:5001/api/auth/login`, credentials, {
//     withCredentials: true,
//   });
//   return response.data;
// };


const API_URL = "http://localhost:5001/api/auth";

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      withCredentials: true,
    });

    if (!response.data?.user || !response.data?.token) {
      throw new Error("Invalid API response: Missing user or token.");
    }

    return response.data;
  } catch (error: any) {
    console.error(" API Login Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


export const logout = async () => {
  await axios.post("http://localhost:5001/api/auth/logout", {}, { withCredentials: true });
  localStorage.removeItem("user");
  localStorage.removeItem("token");
   window.location.href="/"
  // navigate("/")
};

export const fetchUsers = async () => {
  const response = await fetch("/api/users");
  return response.json();
};


export const addMembersToGroup = async (groupId: string, userIds: string[]) => {
  const response = await fetch(`/api/groups/${groupId}/add-member`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIds }),
  });

  if (!response.ok) {
    throw new Error("Failed to add members");
  }

  return response.json();
};



