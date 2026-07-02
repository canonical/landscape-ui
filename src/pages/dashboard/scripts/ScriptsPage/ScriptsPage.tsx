import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import LoadingState from "@/components/layout/LoadingState";
import { ScriptsTabs } from "@/features/scripts";
import useAuth from "@/hooks/useAuth";
import { Notification } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useAuthHandle } from "@/features/auth";
import { Link } from "react-router";

const ScriptsContainer = lazy(
  async () => import("@/features/scripts/components/ScriptsContainer"),
);

const ScriptsPage: FC = () => {
  const { isFeatureEnabled } = useAuth();

  const { getClassicDashboardUrlQuery } = useAuthHandle();

  const { data } = getClassicDashboardUrlQuery();

  const { value: isNotificationVisible, setFalse: hideNotification } =
    useBoolean(true);

  return (
    <PageMain>
      <PageHeader title="Scripts" />
      <PageContent hasTable>
        {isNotificationVisible && (
          <Notification onDismiss={hideNotification} severity="caution">
            <strong>This page only displays v2 scripts.</strong> Older (v1)
            scripts can be found in{" "}
            {data?.data.url ? (
              <Link to={`${data.data.url}/scripts`}>the legacy web portal</Link>
            ) : (
              "the legacy web portal"
            )}
            .
          </Notification>
        )}

        {isFeatureEnabled("script-profiles") ? (
          <ScriptsTabs />
        ) : (
          <Suspense fallback={<LoadingState />}>
            <ScriptsContainer />
          </Suspense>
        )}
      </PageContent>
    </PageMain>
  );
};

export default ScriptsPage;
