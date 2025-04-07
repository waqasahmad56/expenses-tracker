import { useModalStore } from "../store/useModalStore";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Navbar: React.FC = () => {
  const { openCreateGroup } = useModalStore();
  const location = useLocation();
  const isGroupPage = location.pathname === "/group";
 const navigate=useNavigate();
 const handleclick=()=>{
  navigate("/group")
 }
  return (
    <nav style={navStyle}>
      <div style={logoContainerStyle} onClick={handleclick}>
        <img src="/images.png" alt="SplitWise" style={logoStyle} />
        <h2 style={titleStyle}>Splitwise</h2>
      </div>
      {isGroupPage && (
        <button style={buttonStyle} onClick={openCreateGroup}>
          Create Group
        </button>

      )}
    </nav>
  );
};

const navStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  backgroundColor: "#333",
  padding: "15px 30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: 1000,
};

const logoContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "30px",
  cursor:"pointer"

};

const logoStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
};

const titleStyle: React.CSSProperties = {
  color: "white",
  margin: 0,
  fontSize: "1.5rem",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#28a745",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
  marginRight:"200px"
};

export default Navbar;
