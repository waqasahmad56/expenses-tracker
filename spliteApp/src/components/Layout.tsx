import { useLocation, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/add-user";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div>
        {children}
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
