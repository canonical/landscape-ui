import { HOMEPAGE_PATH } from "@/constants";
import { DashboardTemplate, LoadingState } from "@landscape/ui";
import type { FC } from "react";
import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if ("/" !== pathname) {
      return;
    }

    navigate(HOMEPAGE_PATH, { replace: true });
  }, [pathname]);

  return (
    <DashboardTemplate
      menuItems={[
        // TODO : CHANGE
        {
          label: "Instances",
          path: "/instances",
          icon: "machines",
        },
        {
          label: "Help",
          path: "/help",
          icon: "help",
          items: [
            {
              label: "Legal",
              path: "https://ubuntu.com/legal",
            },
            {
              label: "Documentation",
              path: "https://ubuntu.com/landscape/docs",
            },
            {
              label: "Support",
              path: "https://support-portal.canonical.com/",
            },
          ],
        },
      ]}
    >
      <Suspense fallback={<LoadingState />}>
        <Outlet />
      </Suspense>
    </DashboardTemplate>
  );
};

export default DashboardPage;
