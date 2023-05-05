import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/dashboard";
import PageNotFound from "./pages/PageNotFound";
import DistributionsPage from "./pages/dashboard/repositories";
import DistributionProfilesPage from "./pages/dashboard/repositories/profiles";
import GPGKeysPage from "./pages/dashboard/repositories/gpg-keys";
import FetchProvider from "./context/fetch";

const App: FC = () => {
  return (
    <FetchProvider>
      <Routes>
        <Route path="/" element={<DashboardPage />}>
          <Route path="repositories" element={<DistributionsPage />} />
          <Route
            path="repositories/profiles"
            element={<DistributionProfilesPage />}
          />
          <Route path="repositories/gpg-keys" element={<GPGKeysPage />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </FetchProvider>
  );
};

export default App;
