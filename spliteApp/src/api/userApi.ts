import axios from "axios";

export const fetchUsers = async () => {
  const response = await axios.get("http://localhost:5001/api/auth/getUser");
  return response.data;
};
