import { useQuery, useMutation } from "@tanstack/react-query";
import { useGroupStore } from "../store/useGroupStore";
import { createGroup } from "../api/groupApi";
import { fetchUsers } from "../api/userApi";
import Modal from "../components/Modal";
import { useModalStore } from "../store/useModalStore";
import "./CreateGroup.css";

const CreateGroup = () => {
  const { groupName, selectedUsers, setGroupName, setSelectedUsers, reset } = useGroupStore();
  const { isCreateGroupOpen, closeCreateGroup, openAddMembers, isAddMembersOpen, closeAddMembers } = useModalStore();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      reset();
      closeCreateGroup();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || selectedUsers.length === 0) {
      alert("Please enter group name and select users!");
      return;
    }
    mutation.mutate({ name: groupName, users: selectedUsers });
  };

  return (
    <>
      {isCreateGroupOpen && (
        <Modal isOpen={isCreateGroupOpen} onClose={closeCreateGroup}>
          <h2>Create Group</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                required
              />
            </div>

            <button type="button" className="add-members-btn" onClick={openAddMembers}>
              Add Members
            </button>

            <button type="submit" className="submit-btn">Create Group</button>
          </form>
        </Modal>
      )}

      {isAddMembersOpen && (
        <Modal isOpen={isAddMembersOpen} onClose={closeAddMembers}>
          <h2>Select Members</h2>
          <div className="user-list">
            {isLoading ? (
              <p className="loading">Loading users...</p>
            ) : (
              users?.map((user: { _id: string; name: string }) => (
                <div key={user._id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => setSelectedUsers(user._id)}
                    id={`user-${user._id}`}
                  />
                  <label htmlFor={`user-${user._id}`}>{user.name}</label>
                </div>
              ))
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateGroup;
