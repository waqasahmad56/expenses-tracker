import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../reactQuery/useAuth";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const mutation = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper
        elevation={6}
        sx={{
          width: 400,
          p: 3,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          color: "black",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            sx={{ mb: 2, input: { color: "black" }, label: { color: "black" } }}
            InputProps={{ style: { color: "black" } }}
            InputLabelProps={{ style: { color: "black" } }}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            sx={{ mb: 2, input: { color: "black" }, label: { color: "black" } }}
            InputProps={{ style: { color: "black" } }}
            InputLabelProps={{ style: { color: "black" } }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={mutation.isPending}
            sx={{ mb: 2 }}
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
        <Typography align="center">
          Don't have an account?{" "}
          <Link to="/add-user" style={{ color:"primary", textDecoration: "underline" }}>
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
