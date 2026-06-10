import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import LoadingState from "@/components/layout/LoadingState";
import { redirectToExternalUrl } from "@/features/auth";
import { ScriptsTabs } from "@/features/scripts";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import { ActionButton, Notification } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/api/ApiError";

const ScriptsContainer = lazy(
  async () => import("@/features/scripts/components/ScriptsContainer"),
);

const ScriptsPage: FC = () => {
  const { isFeatureEnabled } = useAuth();
  const authFetch = useFetch();

  const { value: isNotificationVisible, setFalse: hideNotification } =
    useBoolean(true);

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<{ url: string }>,
    AxiosError<ApiError>
  >({
    mutationKey: ["classicDashboardUrl"],
    mutationFn: async () => authFetch.get("classic_dashboard_url"),
  });

  return (
    <PageMain>
      <PageHeader title="Scripts" />
      <PageContent hasTable>
        {isNotificationVisible && (
          <Notification onDismiss={hideNotification} severity="caution">
            <strong>This page only displays v2 scripts.</strong> Older (v1)
            scripts can be found in{" "}
            <ActionButton
              appearance="link"
              onClick={async () => {
                const { data } = await mutateAsync();
                redirectToExternalUrl(`${data.url}/scripts`);
              }}
              loading={isPending}
            >
              the legacy web portal
            </ActionButton>
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
