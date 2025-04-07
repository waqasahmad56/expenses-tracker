import axios from "axios";

export const createGroup = async (groupData: { name: string; users: string[] }) => {
  const response = await axios.post("http://localhost:5001/api/auth/create", groupData);
  return response.data;
};

