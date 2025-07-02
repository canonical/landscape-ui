import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import type { AutoinstallFileTabId } from "../../types";
import type { AutoinstallFile, WithGroups } from "../../types/AutoinstallFile";
import AutoinstallFileInfo from "../AutoinstallFileInfo";
import AutoinstallFileVersionHistory from "../AutoinstallFileVersionHistory";
import { AUTOINSTALL_FILE_TABS } from "./constants";

interface AutoinstallFileTabsProps {
  readonly file: WithGroups<AutoinstallFile>;
  readonly viewVersionHistory: () => void;
  readonly initialTabId?: AutoinstallFileTabId;
}

const AutoinstallFileTabs: FC<AutoinstallFileTabsProps> = ({
  file,
  viewVersionHistory,
  initialTabId = "info",
}) => {
  const [tabId, setTabId] = useState(initialTabId);

  const links = AUTOINSTALL_FILE_TABS.map(({ label, id }) => ({
    label,
    active: id === tabId,
    role: "tab",
    onClick: (): void => {
      setTabId(id);
    },
  }));

  return (
    <>
      <Tabs links={links} />

      {tabId === "info" && <AutoinstallFileInfo file={file} />}

      {tabId === "version-history" && (
        <AutoinstallFileVersionHistory
          file={file}
          viewVersionHistory={viewVersionHistory}
        />
      )}
    </>
  );
};

export default AutoinstallFileTabs;
