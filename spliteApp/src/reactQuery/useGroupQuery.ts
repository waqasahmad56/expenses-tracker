import { useMutation, useQuery } from '@tanstack/react-query';
import {
  fetchGroups,
  fetchSummary,
  addUser,
  login
} from '../api/api';
import { IUser } from '../../../backend/src/interfaces/user.interface';
import axios from 'axios';


export const useGroups = () => {
  return useQuery({ queryKey: ['groups'], queryFn: fetchGroups });
};

const createGroup = async ({ name, users }: { name: string; users: string[] }) => {
  const response = await axios.post('/api/auth/create', { name, users });
  return response.data;
};

export const useCreateGroup = () => {
  return useMutation({
      mutationFn: createGroup,
  });
};

export const useSummary = (groupId: string) => {
  return useQuery({
    queryKey: ['summary', groupId],
    queryFn: () => fetchSummary(groupId),
    enabled: !!groupId,
  });
};

export const useAddUser = () => {
  return useMutation({
    mutationFn: (user: Omit<IUser, 'id'>) => addUser(user),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => login(credentials),
  });
};

const fetchUsers = async () => {
    const response = await axios.get('/api/users');
    return response.data;
};

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });
};



