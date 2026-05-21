import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import LoadingState from "@/components/layout/LoadingState";
import { redirectToExternalUrl } from "@/features/auth";
import { ScriptsTabs, useGetSingleScript } from "@/features/scripts";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import { Button, Notification } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";
import { useBoolean } from "usehooks-ts";

const ScriptsContainer = lazy(
  async () => import("@/features/scripts/components/ScriptsContainer"),
);

const CreateScriptForm = lazy(
  async () => import("@/features/scripts/components/CreateScriptForm"),
);
const EditScriptForm = lazy(
  async () => import("@/features/scripts/components/EditScriptForm"),
);
const RunScriptForm = lazy(
  async () => import("@/features/scripts/components/RunScriptForm"),
);
const ScriptDetails = lazy(
  async () => import("@/features/scripts/components/ScriptDetails"),
);
const ScriptVersionHistoryDetails = lazy(
  async () =>
    import("@/features/scripts/components/ScriptVersionHistoryDetails"),
);

const ScriptsPage: FC = () => {
  const { isFeatureEnabled } = useAuth();
  const authFetch = useFetch();

  const { value: isNotificationVisible, setFalse: hideNotification } =
    useBoolean(true);

  const { lastSidePathSegment, name, popSidePathUntilClear, version } = usePageParams();

  useSetDynamicFilterValidation("sidePath", [
    "create",
    "view",
    "edit",
    "run",
    "version-history",
    "version",
  ]);

  const { script } = useGetSingleScript(Number(name));

  return (
    <PageMain>
      <PageHeader title="Scripts" />
      <PageContent hasTable>
        {isNotificationVisible && (
          <Notification onDismiss={hideNotification} severity="caution">
            <strong>This page only displays v2 scripts.</strong> Older (v1)
            scripts can be found in{" "}
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
        )}

        {isFeatureEnabled("script-profiles") ? (
          <ScriptsTabs />
        ) : (
          <Suspense fallback={<LoadingState />}>
            <ScriptsContainer />
          </Suspense>
        )}
      </PageContent>

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={
          lastSidePathSegment === "create" ||
          (!!lastSidePathSegment && !!script)
        }
        size={lastSidePathSegment === "run" ? "large" : "small"}
      >
        {lastSidePathSegment === "create" && (
          <SidePanel.Suspense key="create">
            <SidePanel.Header>Add script</SidePanel.Header>
            <SidePanel.Content>
              <CreateScriptForm />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {(lastSidePathSegment === "view" ||
          lastSidePathSegment === "version-history") &&
          script && (
            <SidePanel.Suspense key="view">
              <SidePanel.Header>{script.title}</SidePanel.Header>
              <SidePanel.Content>
                <ScriptDetails
                  scriptId={script.id}
                  initialTabId={
                    lastSidePathSegment === "version-history"
                      ? "version-history"
                      : "info"
                  }
                />
              </SidePanel.Content>
            </SidePanel.Suspense>
          )}

        {lastSidePathSegment === "edit" && script && (
          <SidePanel.Suspense key="edit">
            <SidePanel.Header>Edit "{script.title}" script</SidePanel.Header>
            <SidePanel.Content>
              <EditScriptForm script={script} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "run" && script && (
          <SidePanel.Suspense key="run">
            <SidePanel.Header>Run "{script.title}" script</SidePanel.Header>
            <SidePanel.Content>
              <RunScriptForm script={script} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "version" && script && (
          <SidePanel.Suspense key="version">
            <SidePanel.Header>{script.title}</SidePanel.Header>
            <SidePanel.Content>
              <ScriptVersionHistoryDetails
                scriptId={script.id}
                isArchived={script.status === "ARCHIVED"}
                versionId={version}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default ScriptsPage;
