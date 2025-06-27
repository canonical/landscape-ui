import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { redirectToExternalUrl } from "@/features/auth";
import {
  ScriptList,
  ScriptsEmptyState,
  useGetScripts,
} from "@/features/scripts";
import useFetch from "@/hooks/useFetch";
import usePageParams from "@/hooks/usePageParams";
import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import ScriptsHeader from "../ScriptsHeader";
import { SCRIPT_NOTIFICATION_LOCAL_STORAGE_ITEM } from "./constants";
import { isScriptsEmptyState, isScriptsLoadingState } from "./helpers";

const ScriptsContainer: FC = () => {
  const authFetch = useFetch();
  const { currentPage, pageSize, search, status } = usePageParams();

  const { scripts, scriptsCount, isScriptsLoading } = useGetScripts();

  const { value: isNotificationVisible, setFalse: hideNotification } =
    useBoolean(!localStorage.getItem(SCRIPT_NOTIFICATION_LOCAL_STORAGE_ITEM));

  if (
    isScriptsEmptyState(
      currentPage,
      pageSize,
      isScriptsLoading,
      scriptsCount,
      search,
      status,
    )
  ) {
    return <ScriptsEmptyState />;
  }

  const dismiss = () => {
    hideNotification();
    localStorage.setItem(SCRIPT_NOTIFICATION_LOCAL_STORAGE_ITEM, "true");
  };

  return (
    <>
      {isNotificationVisible && (
        <Notification onDismiss={dismiss}>
          <strong>This page only displays v2 scripts.</strong> To access older
          (v1) scripts, go to{" "}
          <Button
            appearance="link"
            onClick={async () => {
              redirectToExternalUrl(
                (await authFetch.get<{ url: string }>("classic_dashboard_url"))
                  .data.url,
              );
            }}
          >
            the legacy web portal
          </Button>
          .
        </Notification>
      )}

      <ScriptsHeader />
      {isScriptsLoadingState(currentPage, pageSize, isScriptsLoading) ? (
        <LoadingState />
      ) : (
        <ScriptList scripts={scripts} />
      )}
      <TablePagination
        totalItems={scriptsCount}
        currentItemCount={scripts.length}
      />
    </>
  );
};

export default ScriptsContainer;
