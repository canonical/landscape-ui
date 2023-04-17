import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/dashboard";
import PageNotFound from "./pages/PageNotFound";
import RepositoriesPage from "./pages/dashboard/repositories";
import ProfilesPage from "./pages/dashboard/repositories/profiles";

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />}>
        <Route path="repositories" element={<RepositoriesPage />} />
        <Route path="repositories/profiles" element={<ProfilesPage />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
