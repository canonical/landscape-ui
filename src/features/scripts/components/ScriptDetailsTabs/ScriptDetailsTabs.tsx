import AppTabs from "@/components/AppTabs";
import type { FC } from "react";
import { lazy } from "react";
import { getCode } from "../../helpers";
import type { ScriptTabId, SingleScript } from "../../types";

const ScriptDetailsInfo = lazy(async () => import("../ScriptDetailsInfo"));

const ScriptCode = lazy(async () => import("../ScriptCode"));

const ScriptsVersionHistory = lazy(
  async () => import("../ScriptsVersionHistory"),
);

interface ScriptDetailsTabsProps {
  readonly script: SingleScript;
  readonly viewVersionHistory: () => void;
}

const ScriptDetailsTabs: FC<ScriptDetailsTabsProps> = ({
  script,
  viewVersionHistory,
}) => (
  <AppTabs<ScriptTabId>
    aria-label="Script details"
    slot="panel"
    items={[
      {
        id: "info",
        label: "Info",
        panel: <ScriptDetailsInfo script={script} />,
      },
      {
        id: "code",
        label: "Code",
        panel: (
          <ScriptCode
            code={getCode({
              code: script.code,
              interpreter: script.interpreter,
            })}
          />
        ),
      },
      {
        id: "version-history",
        label: "Version history",
        panel: (
          <ScriptsVersionHistory
            script={script}
            viewVersionHistory={viewVersionHistory}
          />
        ),
      },
    ]}
  />
);

export default ScriptDetailsTabs;
