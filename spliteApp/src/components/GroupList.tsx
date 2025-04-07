import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGroupsQuery from "../reactQuery/useGroupsQuery";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { logout } from "../api/api";
const GroupList: React.FC = () => {
  const { data: groups, isLoading, error } = useGroupsQuery();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let userId: string | null = null;
  const [showMenu, setShowMenu] = useState(false);

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      userId = decodedToken?.id || null;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (isLoading) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 10 }}>
        Loading groups
      </Typography>
    );
  }
  if (error) {
    return (
      <Typography variant="h6" align="center" color="error" sx={{ mt: 10 }}>
        Error loading groups
      </Typography>
    );
  }

  interface IUser {
    _id: string;
    name: string;
    email: string;
  }
  interface IGroup {
    _id?: string;
    name: string;
    users: IUser[] | string[];
  }

  const userGroups: IGroup[] =
    groups?.filter((group: IGroup) =>
      group.users
        .map((user) => (typeof user === "string" ? user : user._id))
        .includes(userId!)
    ) ?? [];

  return (
    <>
    <Box sx={{ mt:15, px: 2 }}>
{/*
<div style={{ position: "relative", width: "100%" }}>
  <div
    style={{
      position: "fixed",
      top: "1px",
      right: "330px",
      zIndex:"1000"
    }}
  >
    <p
      style={{
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize:"22px",

      }}
    >
      {user.name}
    </p>
  </div>
</div> */}
 <div style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          position: "fixed",
          top: "2px",
          right: "330px",
          zIndex: 1000,
        }}
      >
        <p
          onClick={() => setShowMenu(!showMenu)}
          style={{
            color: "white",
            cursor: "pointer",
            fontSize: "22px",
            fontWeight: "bold",
            transition: "background 0.3s",
            textTransform:"capitalize"
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "")}
          onMouseOut={(e) => (e.currentTarget.style.background = "")}
        >
          {user.name} ⌵
        </p>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              right: "0",
              background: "white",
              borderRadius: "8px",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
              width: "150px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                color: "#dc2626",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "")}
              onMouseOut={(e) => (e.currentTarget.style.background = "")}
              onClick={logout}
            >
              Logout
            </p>

          </div>
        )}
      </div>
    </div>

      <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto" }}>
        <Typography variant="h5" align="center" color= "#4CAF50" gutterBottom>
          Group Details
        </Typography>
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="group details table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#4CAF50"}}>Group Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#4CAF50" }}>Group Members</TableCell>
                <TableCell sx={{ fontWeight: "bold" , color: "#4CAF50",textAlign: "center" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userGroups.map((group) => (
                <TableRow key={group._id} hover>
                  <TableCell component="th" scope="row" >
                    {group.name}
                  </TableCell>
                  <TableCell>
                    {group.users
                      .map((user) => (typeof user === "string" ? user : user.name))
                      .join(", ")}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/group/${group._id}`)}
                      sx={{ textTransform: "none" , color: "#4CAF50",borderColor:"#4CAF50"}}
                    >
                      Manage Groups
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {userGroups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No group
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
    </>
  );
};

export default GroupList;


