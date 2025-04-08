import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchSummary } from "../api/api";
import useGroupsQuery from "../reactQuery/useGroupsQuery";

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

const Summary: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const { data: expenses, isLoading, error } = useQuery<IExpense[]>({
    queryKey: ["Expenses", groupId],
    queryFn: () => fetchSummary(groupId!),
    enabled: !!groupId,
  });

  const { data: groups } = useGroupsQuery();
  const currentGroup = groups?.find((group) => group._id === groupId);

  const getUserName = (userId: string) => {
    return currentGroup?.users.find((user) => user._id === userId)?.name;
  };

  if (isLoading) return <p style={styles.loadingText}>Loading...</p>;
  if (error) return <p style={styles.errorText}>Error fetching data</p>;
  if (!expenses || expenses.length === 0) return <p style={styles.noDataText}>No expenses found</p>;

  const latestExpense = [...expenses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}> Expense Summary</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Payer</th>
              <th style={styles.th}>Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr key={latestExpense._id} style={styles.stripedRow}>
              <td style={styles.td}>{latestExpense.description}</td>
              <td style={{ ...styles.td, ...styles.amount }}>{latestExpense.amount}</td>
              <td style={styles.td}>{getUserName(latestExpense.payerId)}</td>
              <td style={styles.td}>
                {new Date(latestExpense.createdAt).toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style={styles.heading}>Split Amount Details</h3>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Group Members</th>
              <th style={styles.th}>Owed Amount</th>
            </tr>
          </thead>
          <tbody>
            {latestExpense.splitAmount.map((split, idx) => (
              <tr key={split._id} style={idx % 2 === 0 ? styles.stripedRow : {}}>
                <td style={styles.td}>{getUserName(split.userId)}</td>
                <td style={{ ...styles.td, ...styles.amount }}>{split.amountOwed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container:{
    marginTop:"140px"
  },
  heading: {
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: "20px",
  },
  tableWrapper: {
    overflowX: "auto",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  thead: {
    backgroundColor: "black",
    color: "white",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  stripedRow: {
    backgroundColor: "#f2f2f2",
  },
  amount: {
    color: "#d9534f",
    fontWeight: "bold",
  },
};

export default Summary;
