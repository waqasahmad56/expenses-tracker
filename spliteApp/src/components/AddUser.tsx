import { useState } from 'react';
import { useUserStore } from '../store/useAuth';
import { useMutation } from '@tanstack/react-query';
import { addUser } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const AddUser: React.FC = () => {
  const { addUser: addUserToStore } = useUserStore();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: (data) => {
      addUserToStore(data);
      setFormData({ name: '', email: '', password: '' });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
    navigate("/");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={6} sx={{ padding: 4, width: 400, bgcolor: 'white', color: 'black', borderRadius: 2 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          User Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ bgcolor:"primary", color: 'white', padding: 1.5, mt: 1 }}
          >
            Add User
          </Button>
        </form>
        <Typography textAlign="center" mt={2}>
          Already have an account?{' '}
          <Link to="/" style={{color:"primary", textDecoration: 'underline' }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default AddUser;
