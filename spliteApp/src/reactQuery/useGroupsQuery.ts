import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface IUser {
  _id: string;
  name: string;
  email: string;
}

interface IGroup {
  _id: string;
  name: string;
  users: IUser[];
  createdAt: string;
  updatedAt: string;
}

const fetchGroups = async (): Promise<IGroup[]> => {
  const res = await axios.get('http://localhost:5001/api/auth/get');
  return res.data;
};

const useGroupsQuery = () => {
  return useQuery<IGroup[], Error>({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGroupsQuery;
