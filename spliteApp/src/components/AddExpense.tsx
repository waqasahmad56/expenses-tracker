import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import useExpenseStore from "../store/useExpenseStore";
import useGroupsQuery from "../reactQuery/useGroupsQuery";
import useSubmitExpense from "../reactQuery/useSubmitExpense";

const AddExpense = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();

  const {
    payer,
    description,
    amount,
    splitAmong,
    setPayer,
    setDescription,
    setAmount,
    setSplitAmong,
  } = useExpenseStore();

  const { data: groups, isLoading } = useGroupsQuery();
  const submitExpense = useSubmitExpense();
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");
  let userId: string | null = null;

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      userId = decodedToken?.id || null;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (isLoading) return <p>Loading groups...</p>;

  const selectedGroup = groups?.find((group) => group._id === groupId) ?? null;

  if (!selectedGroup) {
    return <p>Group not found</p>;
  }

  const loggedInUser = selectedGroup.users.find((groupUser) => groupUser._id === user._id);

  return (
    <>
      <div style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            position: "fixed",
            top: "17px",
            right: "30px",
            zIndex: "1000",
          }}
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => setShowModal(true)}
          >
            Add Expense
          </button>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "600px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ textAlign: "center" }}>Add Expense</h2>

            <div style={{ marginBottom: "10px" }}>
              <label>Payer:</label>
              <select
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Select Payer</option>

                {loggedInUser && (
                  <option key={loggedInUser._id} value={loggedInUser._id}>
                    {loggedInUser.name}
                  </option>
                )}
              </select>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Split Among:</label>
              {selectedGroup.users.map((user) => (
                <div key={user._id}>
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={splitAmong.includes(user._id)}
                    onChange={(e) => {
                      const updatedUsers = e.target.checked
                        ? [...splitAmong, user._id]
                        : splitAmong.filter((id) => id !== user._id);
                      setSplitAmong(updatedUsers);
                    }}
                  />
                  {user.name}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  submitExpense.mutate();
                  setShowModal(false);
                  navigate(`/expenses/${selectedGroup._id}`);
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddExpense;
