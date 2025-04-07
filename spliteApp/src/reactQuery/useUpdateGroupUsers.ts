import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const updateGroupUsers = async ({ groupId, users }: { groupId: string; users: string[] }) => {
  const response = await axios.patch(`http://localhost:5001/api/auth/${groupId}/users`, { users });
  return response.data;
};

const useUpdateGroupUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGroupUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export default useUpdateGroupUsers;
