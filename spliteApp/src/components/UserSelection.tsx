import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchSummary } from "../api/api";
import useGroupsQuery from "../reactQuery/useGroupsQuery";
import AddExpenseForm from "./AddExpenseForm";
import { fetchUsers } from "../api/userApi";
import useUpdateGroupUsers from "../reactQuery/useUpdateGroupUsers";

import { useState } from "react";
import {
  Modal,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ISplitAmount {
  userId: string;
  amountOwed: number;
  _id: string;
}

interface IExpense {
  _id: string;
  groupId: string;
  payerId: string;
  description: string;
  amount: number;
  splitAmount: ISplitAmount[];
  createdAt: string;
  updatedAt: string;
}

const UserSelection: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  // const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openMyBalance, setOpenMyBalance] = useState(false);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

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

  const {
    data: expenses,
    isLoading,
    error,
  } = useQuery<IExpense[]>({
    queryKey: ["Expenses", groupId],
    queryFn: () => fetchSummary(groupId!),
    enabled: !!groupId,
  });

  const { mutate: updateGroupUsers } = useUpdateGroupUsers();

  const handleAddMembers = () => {
    if (selectedUsers.length > 0 && groupId) {
      updateGroupUsers({ groupId, users: selectedUsers });
      setOpenAddMemberModal(false);
    }
  };
  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const { data: groups } = useGroupsQuery();
  const currentGroup = groups?.find((group) => group._id === groupId);
  const getUserName = (userId: string) =>
    currentGroup?.users.find((user) => user._id === userId)?.name;

  if (isLoading) return <p style={styles.loadingText}>Loading...</p>;
  if (error) return <p style={styles.errorText}>Error fetching data</p>;
  if (!expenses || expenses.length === 0)
    return (
      <p style={{ marginTop: "140px", textAlign: "center" }}>
        No expenses found for this group.
      </p>
    );

  const balance: Record<string, number> = {};
  expenses.forEach((expense) => {
    balance[expense.payerId] = (balance[expense.payerId] || 0) + expense.amount;
    expense.splitAmount.forEach((split) => {
      balance[split.userId] = (balance[split.userId] || 0) - split.amountOwed;
    });
  });

  const totalNegative = Object.values(balance).reduce(
    (acc, val) => (val < 0 ? acc + Math.abs(val) : acc),
    0
  );

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.heading}>
          {currentGroup ? `${currentGroup.name} Expenses` : ""}
        </h2>

        {expenses.map((expense) => (
          <Accordion key={expense._id} style={styles.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={styles.accordionSummary}
            >
              <Typography style={styles.accordionTitle}>
                {expense.description}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                display="flex"
                justifyContent="center"
                marginLeft="155px"
                gap={20}
                alignItems="center"
              >
                <Typography>
                  <strong>Amount:</strong> {expense.amount}
                </Typography>
                <Typography>
                  <strong>Payer:</strong> {getUserName(expense.payerId)}
                </Typography>
                <Typography>
                  <strong>Date and Time:</strong>{" "}
                  {new Date(expense.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <h3 style={styles.heading}>Splitted Amount</h3>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={2}
                  width="100%"
                  maxWidth="430px"
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                    padding="8px 0"
                    sx={{ borderBottom: "2px solid #000" }}
                  >
                    <Typography
                      sx={{ fontWeight: "bold", textAlign: "center", flex: 1 }}
                    >
                      Group Members
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography
                      sx={{ fontWeight: "bold", textAlign: "center", flex: 1 }}
                    >
                      Owes
                    </Typography>
                  </Box>

                  {expense.splitAmount.map((split, index) => (
                    <Box key={split._id} width="100%">
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        padding="8px 0"
                      >
                        <Typography sx={{ textAlign: "center", flex: 1 }}>
                          {getUserName(split.userId)}
                        </Typography>
                        <Divider orientation="vertical" flexItem />
                        <Typography sx={{ textAlign: "center", flex: 1 }}>
                          <strong>{split.amountOwed}</strong>
                        </Typography>
                      </Box>
                      {index !== expense.splitAmount.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
        <Box
          sx={{
            position: "fixed",
            top: "17px",
            right: "30px",
            zIndex: 1000,
            display: "flex",
            gap: "10px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenModal(true)}
            style={styles.modalButton}
          >
            View Summary
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenMyBalance(true)}
            style={styles.modalButton}
          >
            My Balance
          </Button>

          <Button
            variant="contained"
            color="secondary"
            style={styles.modalButton}
            onClick={() => setOpenAddMemberModal(true)}
          >
            Add Member
          </Button>

          <Button
            variant="contained"
            color="secondary"
            style={styles.modalButton}
          >
            Add Expense
          </Button>
        </Box>

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          style={styles.modal}
        >
          <Box sx={styles.modalContent}>
            <Typography variant="h6" style={styles.headingStyle}>
              Balance Summary
            </Typography>
            {Object.entries(balance).map(([id, amount]) => {
              if (amount > 0) {
                return (
                  <div
                    key={id}
                    style={{ marginBottom: "10px", textAlign: "left" }}
                  >
                    <strong style={{ color: "green", display: "block" }}>
                      • {getUserName(id)} will receive {amount.toFixed(2)}
                    </strong>
                    {Object.entries(balance)
                      .filter(([payerId, payerAmount]) => payerAmount < 0)
                      .map(([payerId, payerAmount]) => (
                        <Typography
                          key={payerId}
                          style={{ marginLeft: "15px", color: "green" }}
                        >
                          • {getUserName(payerId)} should pay{" "}
                          {Math.abs(
                            (payerAmount * amount) / Math.abs(totalNegative)
                          ).toFixed(2)}
                        </Typography>
                      ))}
                  </div>
                );
              } else if (amount < 0) {
                return (
                  <Typography
                    key={id}
                    style={{
                      color: "red",
                      marginBottom: "10px",
                      textAlign: "left",
                    }}
                  >
                    • {getUserName(id)} owes {Math.abs(amount).toFixed(2)}
                  </Typography>
                );
              }
              return null;
            })}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenModal(false)}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </Modal>
        <Modal
          open={openMyBalance}
          onClose={() => setOpenMyBalance(false)}
          style={styles.modal}
        >
          <Box sx={styles.modalContent}>
            <Typography variant="h6" style={styles.headingStyle}>
              My Balance
            </Typography>
            {userId && balance[userId] !== undefined ? (
              balance[userId] > 0 ? (
                <div style={{ textAlign: "left" }}>
                  <Typography
                    variant="body1"
                    style={{ color: "green", marginBottom: "10px" }}
                  >
                    • You will receive {balance[userId].toFixed(2)}
                  </Typography>
                  {Object.entries(balance)
                    .filter(([id, amt]) => amt < 0)
                    .map(([id, amt]) => (
                      <Typography
                        key={id}
                        variant="body2"
                        style={{ marginLeft: "15px", color: "green" }}
                      >
                        • {getUserName(id)} should pay{" "}
                        {Math.abs(
                          (amt * balance[userId]) /
                            Math.abs(
                              Object.values(balance).reduce(
                                (acc, val) => (val < 0 ? acc + val : acc),
                                0
                              )
                            )
                        ).toFixed(2)}
                      </Typography>
                    ))}
                </div>
              ) : balance[userId] < 0 ? (
                <div style={{ textAlign: "left" }}>
                  <Typography
                    variant="body1"
                    style={{ color: "red", marginBottom: "10px" }}
                  >
                    • You owe {Math.abs(balance[userId]).toFixed(2)}
                  </Typography>
                  {Object.entries(balance)
                    .filter(([id, amt]) => amt > 0)
                    .map(([id, amt]) => (
                      <Typography
                        key={id}
                        variant="body2"
                        style={{ marginLeft: "15px", color: "red" }}
                      >
                        •You pay{" "}
                        {Math.abs(
                          (amt * Math.abs(balance[userId])) /
                            Object.values(balance).reduce(
                              (acc, val) => (val > 0 ? acc + val : acc),
                              0
                            )
                        ).toFixed(2)}{" "}
                        to {getUserName(id)}
                      </Typography>
                    ))}
                </div>
              ) : (
                <Typography
                  variant="body1"
                  style={{ textAlign: "left", marginBottom: "10px" }}
                >
                  Your balance is settled.
                </Typography>
              )
            ) : (
              <Typography
                variant="body1"
                style={{ textAlign: "left", marginBottom: "10px" }}
              >
                No balance.
              </Typography>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenMyBalance(false)}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </Modal>

        <Modal
          open={openAddMemberModal}
          onClose={() => setOpenAddMemberModal(false)}
          style={styles.modal}
        >
          <Box sx={styles.modalContent}>
            <Typography variant="h6" style={styles.headingStyle}>
              Add Member
            </Typography>
            <input
              type="text"
              value={currentGroup?.name || ""}
              readOnly
              style={{
                marginBottom: "16px",
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            {isLoading ? (
              <Typography>Loading users...</Typography>
            ) : (
              <Box sx={{ maxHeight: 200, overflowY: "auto", mb: 2, p: 1 }}>
                {users
                  ?.filter(
                    (user) =>
                      !currentGroup?.users.some(
                        (groupUser) => groupUser._id === user._id
                      )
                  )
                  .map((user) => (
                    <div
                      key={user._id}
                      style={{
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={user._id}
                        value={user._id}
                        name="users"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        style={{ marginRight: "8px" }}
                      />

                      <label htmlFor={user._id} style={{ cursor: "pointer" }}>
                        {user.name}
                      </label>
                    </div>
                  ))}
              </Box>
            )}
            <div style={{display:"flex",gap:"20px"}}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddMembers}
              sx={{ mt: 2 }}

            >
              Add Members
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenAddMemberModal(false)}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
            </div>
          </Box>
        </Modal>
      </div>
      <AddExpenseForm />
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: "20px", marginTop: "80px" },
  heading: { textAlign: "center", color: "#4CAF50", marginBottom: "20px" },
  accordion: { marginBottom: "10px", borderRadius: "5px" },
  accordionSummary: { backgroundColor: "#f0f0f0", fontWeight: "bold" },
  accordionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: { display: "flex", alignItems: "center", justifyContent: "center" },
  modalContent: {
    backgroundColor: "#fff",
    fontWeight: "bold",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    maxWidth: "1000px",
    minWidth: "400px",
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    textTransform: "none",
  },
  headingStyle: {
    color: "#28a745",
    marginBottom: "20px",
    textAlign: "left",
  },
};

export default UserSelection;
