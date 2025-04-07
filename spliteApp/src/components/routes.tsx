import Login from "./Login";
import AddUser from "./AddUser";
import Groups from "../pages/Groups";
import Summary from "./Summary";
import UserSelection from "./UserSelection";

const routes = [
  { path: "/add-user", element: <AddUser /> },
  { path: "/", element: <Login /> },
  { path: "/group", element: <Groups /> },
  { path: "/expenses/:groupId", element: <Summary /> },
  { path:"/group/:groupId", element:<UserSelection />},


];

export default routes;
