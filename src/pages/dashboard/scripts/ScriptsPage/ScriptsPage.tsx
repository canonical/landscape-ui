import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { redirectToExternalUrl } from "@/features/auth";
import { ScriptsContainer, ScriptsTabs } from "@/features/scripts";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";

const ScriptsPage: FC = () => {
  const { isFeatureEnabled } = useAuth();
  const authFetch = useFetch();

  return (
    <PageMain>
      <PageHeader title="Scripts" />
      <PageContent>
        <Notification severity="caution">
          <strong>This page only displays v2 scripts.</strong> To access older
          (v1) scripts, go to{" "}
          <Button
            appearance="link"
            onClick={async () => {
              redirectToExternalUrl(
                `${
                  (
                    await authFetch.get<{ url: string }>(
                      "classic_dashboard_url",
                    )
                  ).data.url
                }/scripts`,
              );
            }}
          >
            the legacy web portal
          </Button>
          .
        </Notification>

        {isFeatureEnabled("script-profiles") ? (
          <ScriptsTabs />
        ) : (
          <ScriptsContainer />
        )}
      </PageContent>
    </PageMain>
  );
};

export default ScriptsPage;
