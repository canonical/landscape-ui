import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/dashboard";
import PageNotFound from "./pages/PageNotFound";
import RepositoriesPage from "./pages/dashboard/repositories";
import ProfilesPage from "./pages/dashboard/repositories/profiles";
import FetchProvider from "./context/fetch";

const App: FC = () => {
  return (
    <FetchProvider>
      <Routes>
        <Route path="/" element={<DashboardPage />}>
          <Route path="repositories" element={<RepositoriesPage />} />
          <Route path="repositories/profiles" element={<ProfilesPage />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </FetchProvider>
  );
};

export default App;
