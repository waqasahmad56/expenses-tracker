import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import routes from "./components/routes";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;


