import type { FC } from "react";
import { Route, Routes } from "react-router";
import { PATHS } from "@/libs/routes";
import { GlobalShell } from "@/components/layout/GlobalShell";
import { DashboardRoutes } from "@/routes/DashboardRoutes";
import { AuthRoutes } from "@/routes/AuthRoutes";
import * as Pages from "@/routes/elements";

const App: FC = () => {
  return (
    <GlobalShell>
      <Routes>
        {DashboardRoutes}

        {AuthRoutes}

        <Route path={PATHS.root.notFound} element={<Pages.PageNotFound />} />
      </Routes>
    </GlobalShell>
  );
};

export default App;
