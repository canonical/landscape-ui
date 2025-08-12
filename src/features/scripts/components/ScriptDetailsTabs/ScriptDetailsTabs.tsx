import LoadingState from "@/components/layout/LoadingState";
import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { getCode } from "../../helpers";
import type { ScriptTabId, SingleScript } from "../../types";
import { SCRIPT_TABS } from "./constants";
import classes from "./ScriptDetailsTabs.module.scss";

const ScriptDetailsInfo = lazy(async () => import("../ScriptDetailsInfo"));

const ScriptCode = lazy(async () => import("../ScriptCode"));

const ScriptsVersionHistory = lazy(
  async () => import("../ScriptsVersionHistory"),
);

interface ScriptDetailsTabsProps {
  readonly script: SingleScript;
  readonly viewVersionHistory: () => void;
  readonly initialTabId?: ScriptTabId;
}

const ScriptDetailsTabs: FC<ScriptDetailsTabsProps> = ({
  script,
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
  }));

  return (
    <>
      <Tabs listClassName={classes.tabs} links={links} />

      {tabId === "info" && (
        <Suspense fallback={<LoadingState />}>
          <ScriptDetailsInfo script={script} />
        </Suspense>
      )}

      {tabId === "code" && (
        <Suspense fallback={<LoadingState />}>
          <ScriptCode
            code={getCode({
              code: script.code,
              interpreter: script.interpreter,
            })}
          />
        </Suspense>
      )}

      {tabId === "version-history" && (
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
