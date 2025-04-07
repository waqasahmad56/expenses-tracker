import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { login } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login Success:", data);
      console.log("User Data:", data?.user);
      console.log("Token:", data?.token);
      console.log("API Response from backend:", data);

      if (!data?.user || !data?.token) {
        console.error("Invalid API response: Missing user or token.");
        alert("Invalid login response from server.");
        return;
      }

      setUser({
        _id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        token: data.token,
      });

      localStorage.setItem("token", data.token);
      toast.success("Login Successfuly")

      navigate("/group");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed!");
    },
  });

  return mutation;
};

