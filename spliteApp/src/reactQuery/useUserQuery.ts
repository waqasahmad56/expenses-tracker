import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface IUser {
  id: string;
  name: string;
}

const fetchUsers = async (): Promise<IUser[]> => {
    const response = await axios.get('/api/users');
    return response.data;
};

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });
};
