import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import type { ScriptTabId, SingleScript } from "../../types";
import { SCRIPT_TABS } from "./constants";
import LoadingState from "@/components/layout/LoadingState";

const ScriptDetailsInfo = lazy(async () => import("../ScriptDetailsInfo"));

const ScriptCode = lazy(async () => import("../ScriptCode"));

const ScriptsVersionHistory = lazy(
  async () => import("../ScriptsVersionHistory"),
);

interface ScriptDetailsTabsProps {
  readonly script: SingleScript;
  readonly viewVersionHistory: () => void;
  readonly scriptAttachments: unknown[];
  readonly initialTabId?: ScriptTabId;
}

const ScriptDetailsTabs: FC<ScriptDetailsTabsProps> = ({
  script,
  scriptAttachments,
  initialTabId = "info",
  viewVersionHistory,
}) => {
  const [tabId, setTabId] = useState(initialTabId);
  const links = SCRIPT_TABS.map(({ label, id }) => ({
    label,
    active: id === tabId,
    role: "tab",
    onClick: (): void => {
      setTabId(id);
    },
  })).filter(
    (link) => link.label !== "Version history" || script.status !== "V1",
  );

  return (
    <>
      <Tabs links={links} />

      {tabId === "info" && (
        <Suspense fallback={<LoadingState />}>
          <ScriptDetailsInfo
            script={script}
            scriptAttachments={scriptAttachments}
          />
        </Suspense>
      )}

      {tabId === "code" && (
        <Suspense fallback={<LoadingState />}>
          <ScriptCode scriptId={script.id} />
        </Suspense>
      )}

      {tabId === "version-history" && script.status !== "V1" && (
        <Suspense fallback={<LoadingState />}>
          <ScriptsVersionHistory
            script={script}
            viewVersionHistory={viewVersionHistory}
          />
        </Suspense>
      )}
    </>
  );
};

export default ScriptDetailsTabs;
